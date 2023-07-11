"use client";

import { SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { ChangeEvent, useEffect, useState } from "react";

interface DarkmodeProps {}

const Darkmode: React.FC<DarkmodeProps> = ({}) => {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setEnabled(!enabled);
    setTheme(e.target.value);
  };

  if (!mounted) return null;
  return (
    <>
      <div className="flex gap-1">
        <SunMoonIcon className="mr-2 h-5 w-5" />
        <span>Theme</span>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <select
          className="h-10 text-gray-900"
          value={theme}
          onChange={handleChange}
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </>
  );
};

export default Darkmode;
