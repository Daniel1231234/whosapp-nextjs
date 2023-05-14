"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

interface ButtonToggleDarkModeProps {
  className?:string
}

const ButtonToggleDarkMode = ({className = ""}:ButtonToggleDarkModeProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`  ${className}  z-50 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full p-2 focus:outline-none shadow-md`}
    >
      {theme === "dark" ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
      <span className="text-sm font-medium">
        {theme === "dark" ? "Change to Light" : "Change to Dark"}
      </span>
    </button>
  );
};

export default ButtonToggleDarkMode;

