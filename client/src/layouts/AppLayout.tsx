import { Outlet } from "react-router-dom";

import Sidebar from "@/components/app/Sidebar";
import Topbar from "@/components/app/Topbar";

function AppLayout() {
    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;