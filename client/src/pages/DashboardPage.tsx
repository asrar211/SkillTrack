import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardMotion from "@/features/dashboard/components/DashboardMotion";
import DailyGoalCard from "@/features/dashboard/components/DailyGoalCard";
import LearningProgressCard from "@/features/dashboard/components/LearningProgressCard";
import RecentActivity from "@/features/dashboard/components/RecentActivity";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import RecommendedForYou from "@/features/dashboard/components/RecommendedForYou";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useLearningActivities } from "@/features/activity/hooks/useLearningActivities";

function DashboardPage() {
    const {
        data,
        isLoading,
        isError,
    } = useDashboard();
    const { data: activityData, isLoading: isActivityLoading } = useLearningActivities(8);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-200" />

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="h-32 animate-pulse rounded-2xl bg-white"
                            />
                        )
                    )}
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-700">
                        Unable to load dashboard
                    </h2>

                    <p className="mt-1 text-sm text-red-600">
                        Please try refreshing the page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            <DashboardMotion>
                <DashboardHeader />
            </DashboardMotion>

            <DashboardMotion delay={0.08}>
                <StatsGrid
                    overview={data.data.overview}
                    streak={data.data.streak}
                />
            </DashboardMotion>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <DashboardMotion delay={0.16}>
                    <LearningProgressCard
                        progress={
                            data.data.overview
                                .overallProgress
                        }
                    />
                </DashboardMotion>

                <DashboardMotion delay={0.24}>
                    <DailyGoalCard goal={data.data.dailyGoal}/>
                </DashboardMotion>
            </div>

            <div className="mt-6">
                <DashboardMotion delay={0.32}>
                    <RecentActivity
                        activities={activityData?.data}
                        isLoading={isActivityLoading}
                    />
                </DashboardMotion>
            </div>
            <div className="mt-6">
                <DashboardMotion delay={0.32}>
                    <RecommendedForYou recommendations={data.data.recommendations}/>
                </DashboardMotion>
            </div>
        </div>
    );
}

export default DashboardPage;
