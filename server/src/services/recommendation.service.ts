import LearningProgress from "../models/LearningProgress.js";
import Roadmap from "../models/Roadmap.js";
import Skill from "../models/Skill.js";
import SkillDependency from "../models/SkillDependency.js";

export const getLearningRecommendations = async (
    userId: string
) => {
    const roadmap = await Roadmap.findOne({
        userId,
    });

    if (!roadmap) {
        return [];
    }

    // Get user's skill-level progress only
    const progressRecords = await LearningProgress.find({
        userId,
        topicId: {
            $exists: false,
        },
    });

    const completedSkills = new Set(
        progressRecords
            .filter(
                (item) => item.status === "completed"
            )
            .map(
                (item) => item.skillId.toString()
            )
    );

    const progressMap = new Map(
        progressRecords.map((item) => [
            item.skillId.toString(),
            item,
        ])
    );

    // Get unique roadmap skill IDs
    const skillIds = [
        ...new Set(
            roadmap.items.map(
                (item) => item.skillId.toString()
            )
        ),
    ];

    // Fetch all skills at once
    const skills = await Skill.find({
        _id: {
            $in: skillIds,
        },
        isActive: true,
    }).select(
        "name slug description domain icon"
    );

    const skillMap = new Map(
        skills.map((skill) => [
            skill._id.toString(),
            skill,
        ])
    );

    // Fetch all dependencies at once
    const dependencies = await SkillDependency.find({
        dependentSkillId: {
            $in: skillIds,
        },
    }).select(
        "dependentSkillId prerequisiteSkillId"
    );

    const dependencyMap = new Map<
        string,
        string[]
    >();

    for (const dependency of dependencies) {

        const dependentSkillId =
            dependency.dependentSkillId.toString();

        const prerequisiteSkillId =
            dependency.prerequisiteSkillId.toString();

        const existing =
            dependencyMap.get(dependentSkillId) ?? [];

        existing.push(prerequisiteSkillId);

        dependencyMap.set(
            dependentSkillId,
            existing
        );
    }

    const recommendations = [];

    for (const roadmapItem of roadmap.items) {

        const skillId =
            roadmapItem.skillId.toString();

        const progress =
            progressMap.get(skillId);

        // Already completed
        if (
            progress?.status === "completed"
        ) {
            continue;
        }

        const skill =
            skillMap.get(skillId);

        if (!skill) {
            continue;
        }

        const prerequisiteIds =
            dependencyMap.get(skillId) ?? [];

        const prerequisitesCompleted =
            prerequisiteIds.every(
                (prerequisiteId) =>
                    completedSkills.has(
                        prerequisiteId
                    )
            );

        if (!prerequisitesCompleted) {
            continue;
        }

        /*
         * Recommendation score
         */
        let score = 0;

        // User has not started it yet
        if (!progress) {
            score += 20;
        }

        // User already started it
        if (
            progress?.status === "in-progress"
        ) {
            score += 40;
        }

        // Partially completed
        if (
            progress &&
            progress.progress > 0 &&
            progress.progress < 100
        ) {
            score += 20;
        }

        // Priority
        if (
            roadmapItem.priority === "high"
        ) {
            score += 30;
        } else if (
            roadmapItem.priority === "medium"
        ) {
            score += 15;
        } else {
            score += 5;
        }

        // Target date
        if (roadmapItem.targetDate) {

            const daysRemaining = Math.ceil(
                (
                    roadmapItem.targetDate.getTime() -
                    Date.now()
                ) /
                (1000 * 60 * 60 * 24)
            );

            if (daysRemaining < 0) {
                score += 40;
            } else if (daysRemaining <= 3) {
                score += 35;
            } else if (daysRemaining <= 7) {
                score += 25;
            } else if (daysRemaining <= 14) {
                score += 15;
            }
        }

        const reasons: string[] = [];

        if (
            progress?.status === "in-progress"
        ) {
            reasons.push(
                "You have already started this skill."
            );
        }

        if (
            roadmapItem.priority === "high"
        ) {
            reasons.push(
                "This skill is marked as high priority."
            );
        }

        if (roadmapItem.targetDate) {

            const daysRemaining = Math.ceil(
                (
                    roadmapItem.targetDate.getTime() -
                    Date.now()
                ) /
                (1000 * 60 * 60 * 24)
            );

            if (daysRemaining < 0) {
                reasons.push(
                    "Its target date has passed."
                );
            } else if (daysRemaining <= 7) {
                reasons.push(
                    "Its target date is approaching."
                );
            }
        }

        if (reasons.length === 0) {
            reasons.push(
                prerequisiteIds.length === 0
                    ? "This skill has no prerequisites."
                    : "All prerequisites have been completed."
            );
        }

        recommendations.push({
            skill,

            roadmapItemId:
                roadmapItem._id,

            progress:
                progress?.progress ?? 0,

            status:
                progress?.status ??
                "not-started",

            priority:
                roadmapItem.priority,

            estimatedMinutes:
                roadmapItem.estimatedMinutes,

            targetDate:
                roadmapItem.targetDate ?? null,

            score,

            reason: reasons.join(" "),
        });
    }

    recommendations.sort(
        (a, b) => b.score - a.score
    );

    return recommendations.slice(0, 5);
};