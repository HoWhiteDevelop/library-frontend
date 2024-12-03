import { FC } from "react";

const Logo: FC = () => {
  return (
    <div className="logo-container flex items-center justify-center h-8 m-4">
      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-logo">
        HoWhite
      </span>
    </div>
  );
};

export default Logo;
