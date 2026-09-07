import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:pt-32">

            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-130 w-225 rounded-full bg-linear-to-r from-pink-200/40 via-purple-200/40 to-blue-200/40 blur-3xl" />
            </div>

            <div className="mx-auto max-w-5xl text-center">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                    Built for developers
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mx-auto mt-7 max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl"
                >
                    Master your developer journey.

                    <span className="block bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                        One skill at a time.
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-500"
                >
                    Follow personalized roadmaps, understand skill dependencies,
                    solve DSA problems, and track your progress — all in one place.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    <Button
                        size="lg"
                        className="h-12 rounded-full px-7 text-base shadow-lg shadow-pink-500/20"
                    >
                        Start Learning

                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-full px-7 text-base"
                    >
                        Explore Roadmaps
                    </Button>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-zinc-500"
                >
                    {[
                        "Personalized Roadmaps",
                        "Skill Dependencies",
                        "Progress Analytics",
                    ].map((item) => (
                        <span
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4 text-pink-500" />
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;