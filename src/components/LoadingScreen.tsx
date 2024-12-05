import { FC } from "react";
import { motion } from "framer-motion";

const LoadingScreen: FC = () => {
  return (
    <div className="fixed inset-0 bg-[rgba(17,25,40,0.95)] flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
            HoWhite
          </span>
        </motion.div>
        <div className="flex gap-2 justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{
                y: [-10, 0, -10],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
