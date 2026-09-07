import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DashboardMotionProps {
    children: ReactNode;
    delay?: number;
}

function DashboardMotion({
    children,
    delay = 0,
}: DashboardMotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.45,
                delay,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}

export default DashboardMotion;