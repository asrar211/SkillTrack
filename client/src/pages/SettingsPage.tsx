import { LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-pink-500">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-zinc-500">
          Manage your SkillTrack account and session.
        </p>
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <UserRound className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Profile</h2>
            <p className="text-sm text-zinc-500">Your signed-in identity</p>
          </div>
        </div>

        <dl className="mt-6 divide-y rounded-xl border">
          <div className="flex items-center gap-3 p-4">
            <UserRound className="size-4 text-zinc-400" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Name</dt>
              <dd className="mt-0.5 text-sm font-medium">{user?.name ?? "—"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Mail className="size-4 text-zinc-400" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
              <dd className="mt-0.5 text-sm font-medium">{user?.email ?? "—"}</dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Session</h2>
            <p className="text-sm text-zinc-500">Securely end this browser session.</p>
          </div>
        </div>
        <Button variant="outline" className="mt-6" onClick={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </section>
    </div>
  );
}
