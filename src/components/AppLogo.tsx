import React from "react";
import { Globe } from "lucide-react";
import Image from "next/image";

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold tracking-tight  rounded-md p-2">
        WhosApp
      </span>
      <Globe className="mr-2" />
      <span className="text-1xl">Social</span>
    </div>
  );
};

export default AppLogo;
