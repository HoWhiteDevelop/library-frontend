import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface LogoProps {
  collapsed?: boolean;
}

const Logo: FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center justify-center h-16 px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={collapsed ? "collapsed" : "expanded"}
          initial={{ opacity: 0, x: collapsed ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: collapsed ? -20 : 20 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent",
            collapsed ? "text-xl" : "text-2xl"
          )}
        >
          {collapsed ? "H" : "HoWhite"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default Logo;
