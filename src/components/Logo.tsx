import { FC } from "react";
import clsx from "clsx";

interface LogoProps {
  collapsed?: boolean;
}

const Logo: FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center justify-center h-16 px-6 overflow-hidden">
      <span
        className={clsx(
          "font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent",
          collapsed ? "text-xl" : "text-2xl"
        )}
      >
        {collapsed ? "H" : "HoWhite"}
      </span>
    </div>
  );
};

export default Logo;
