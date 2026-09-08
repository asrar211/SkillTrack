import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

import PublicLayout from "@/layouts/PublicLayout";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
const SkillDetailPage = lazy(() => import("@/pages/SkillDetailPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const RoadmapsPage = lazy(() => import("@/pages/RoadmapsPage"));
const RoadmapDetailPage = lazy(() => import("@/pages/RoadmapDetailPage"));
const CreateRoadmapPage = lazy(() => import("@/pages/CreateRoadmapPage"));
const GoalsPage = lazy(() => import("@/pages/GoalsPage"));
const DSAPage = lazy(() => import("@/pages/DSAPage"));
const DSAProblemDetailPage = lazy(() => import("@/pages/DSAProblemDetailPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const InsightsPage = lazy(() => import("@/pages/InsightsPage"));

function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-50"><div className="size-8 animate-spin rounded-full border-2 border-zinc-200 border-t-pink-500" /></div>}>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Application */}
                <Route element={<ProtectedRoute/>}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/skills" element={<SkillsPage/>} />
                    <Route path="/skills/:id" element={<SkillDetailPage/>} />

                    <Route path="/roadmaps" element={<RoadmapsPage/>} />
                    <Route path="/roadmaps/:id" element={<RoadmapDetailPage/>} />
                    <Route path="/roadmaps/create" element={<CreateRoadmapPage/>} />
                    <Route path="/dsa" element={<DSAPage/>} />
                    <Route path="/dsa/:id" element={<DSAProblemDetailPage/>} />
                    <Route path="/goals" element={<GoalsPage/>} />
                    <Route path="/insights" element={<InsightsPage />} />

                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default AppRoutes;
