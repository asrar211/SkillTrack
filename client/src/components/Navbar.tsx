import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
                        S
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        Skill<span className="text-pink-500">Track</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <a
                        href="#product"
                        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                    >
                        Product
                        <ChevronDown className="h-3.5 w-3.5" />
                    </a>

                    <a
                        href="#roadmaps"
                        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                    >
                        Roadmaps
                        <ChevronDown className="h-3.5 w-3.5" />
                    </a>

                    <a
                        href="#resources"
                        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                    >
                        Resources
                        <ChevronDown className="h-3.5 w-3.5" />
                    </a>

                    <a
                        href="#pricing"
                        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                    >
                        Pricing
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="hidden sm:inline-flex"
                    >
                        <Link to="/login">Sign In</Link>
                    </Button>

                    <Button
                        className="group rounded-full px-5 shadow-sm"
                        onClick={() => navigate("/register")}
                    >
                        Start Learning
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
