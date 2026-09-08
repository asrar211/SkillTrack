import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  LayoutDashboard,
  Target,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Plans", icon: BookOpen, path: "/roadmaps" },
  { label: "Skills", icon: BrainCircuit, path: "/skills" },
  { label: "Practice", icon: BarChart3, path: "/dsa" },
  { label: "Goals", icon: Target, path: "/goals" },
];

export default function MobileNav() {
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-white/95 px-1 py-2 backdrop-blur lg:hidden">
      {navigation.map(({ label, icon: Icon, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-medium ${isActive ? "text-pink-600" : "text-zinc-500"}`}
        >
          <Icon className="size-4" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
