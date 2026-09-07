import { motion } from "motion/react";
import { Link } from "react-router-dom";

import RegisterForm from "@/features/auth/components/RegisterForm";

function RegisterPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-50">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-2">

                {/* Visual side */}
                <div className="relative hidden overflow-hidden bg-zinc-950 p-12 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-32 -top-32 size-96 rounded-full bg-purple-500/20 blur-3xl" />

                    <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-pink-500/20 blur-3xl" />

                    <Link
                        to="/"
                        className="relative z-10 text-lg font-bold text-white"
                    >
                        SkillTrack
                    </Link>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        className="relative z-10 max-w-lg"
                    >
                        <p className="mb-4 text-sm font-medium text-purple-400">
                            BUILD YOUR ROADMAP
                        </p>

                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                            Your skills.
                            <br />
                            Your roadmap.
                            <br />
                            Your progress.
                        </h1>

                        <p className="mt-6 max-w-md text-zinc-400">
                            Create a personalized developer learning
                            journey and turn your goals into measurable
                            progress.
                        </p>
                    </motion.div>

                    <p className="relative z-10 text-xs text-zinc-500">
                        © 2026 SkillTrack
                    </p>
                </div>

                {/* Form */}
                <div className="flex items-center justify-center p-6 sm:p-10">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 16,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-8">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-purple-600 text-sm font-bold text-white lg:hidden">
                                S
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                                Start building your developer journey.
                            </p>
                        </div>

                        <RegisterForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;