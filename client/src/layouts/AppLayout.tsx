import { Outlet } from "react-router-dom";

import Sidebar from "@/components/app/Sidebar";
import Topbar from "@/components/app/Topbar";
import MobileNav from "@/components/app/MobileNav";

function AppLayout() {
    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />

                <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
                    <Outlet />
                </main>
            </div>

            <MobileNav />
        </div>
    );
}

export default AppLayout;
