import { aiModel, isAIConfigured, openai } from "../config/openai.js";

import {
    getLearningRecommendations,
} from "./recommendation.service.js";

import { AppError } from "../utils/AppError.js";

interface AICoachingPlan {
    summary: string;
    recommendations: Array<{
        skill: string;
        why: string;
        nextStep: string;
    }>;
}

export const generateAIRecommendations = async (
    userId: string
) => {

    if (!isAIConfigured || !openai) {
        throw new AppError(
            "AI coaching is unavailable. Configure OPENAI_API_KEY and OPENAI_MODEL to enable it.",
            503
        );
    }

    const recommendations =
        await getLearningRecommendations(userId);

    if (recommendations.length === 0) {
        throw new AppError(
            "No learning recommendations available",
            404
        );
    }

    const context = recommendations.map(
        (item) => ({
            skill: item.skill.name,
            domain: item.skill.domain,
            progress: item.progress,
            status: item.status,
            priority: item.priority,
            estimatedMinutes:
                item.estimatedMinutes,
            targetDate:
                item.targetDate,
            score: item.score,
            reason: item.reason,
        })
    );

    const response = await openai.responses.create({
    model: aiModel,

    store: false,

    instructions: `
You are the Skill Track learning coach.

The backend has already determined the valid
learning recommendations.

Rules:
- Only discuss supplied recommendations.
- Never invent skills.
- Never change prerequisite relationships.
- Never recommend a skill that was not supplied.
- Explain why each recommendation is useful.
- Give one practical next step.
- Keep the response concise.
`,

    input: JSON.stringify({
        recommendations: context,
    }),

    text: {
        format: {
            type: "json_schema",
            name: "learning_recommendations",
            strict: true,
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    summary: {
                        type: "string",
                    },

                    recommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                skill: {
                                    type: "string",
                                },

                                why: {
                                    type: "string",
                                },

                                nextStep: {
                                    type: "string",
                                },
                            },
                            required: [
                                "skill",
                                "why",
                                "nextStep",
                            ],
                        },
                    },
                },
                required: [
                    "summary",
                    "recommendations",
                ],
            },
        },
    },
});

    if (!response.output_text) {
        throw new AppError(
            "AI coaching did not return a usable plan. Please try again.",
            502
        );
    }

    let aiResult: AICoachingPlan;

    try {
        aiResult = JSON.parse(response.output_text) as AICoachingPlan;
    } catch {
        throw new AppError(
            "AI coaching returned an invalid plan. Please try again.",
            502
        );
    }

    const availableSkills = new Set(
        context.map((item) => item.skill)
    );

    const validRecommendations = aiResult.recommendations.filter(
        (item) =>
            availableSkills.has(item.skill) &&
            typeof item.why === "string" &&
            typeof item.nextStep === "string"
    );

    if (
        typeof aiResult.summary !== "string" ||
        validRecommendations.length === 0
    ) {
        throw new AppError(
            "AI coaching returned an incomplete plan. Please try again.",
            502
        );
    }

    return {
        recommendations: context,
        ai: {
            summary: aiResult.summary,
            recommendations: validRecommendations,
        },
    };
};
