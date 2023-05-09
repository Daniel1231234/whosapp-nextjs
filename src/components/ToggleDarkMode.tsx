"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

const ButtonToggleDarkMode = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="absolute top-20 right-10 z-50 "
  >
    {theme === "dark" ? (
      <MoonIcon className="border-none bg-transparent" />
    ) : (
      <SunIcon className="border-none bg-transparent" />
    )}
  </button>
  )
};

export default ButtonToggleDarkMode;

