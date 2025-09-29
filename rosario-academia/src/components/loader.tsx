"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VolleyballLoaderProps {
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  color?: string;
  backgroundColor?: string;
}

function VolleyballIcon({ color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Horizontal line */}
      <path d="M1 12H23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Curved lines */}
      <path
        d="M12 1C16.5 4 19 8 19 12C19 16 16.5 20 12 23"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 1C7.5 4 5 8 5 12C5 16 7.5 20 12 23"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function VolleyballLoader({
  isLoading = true,
  size = "medium",
  color = "currentColor",
  backgroundColor = "transparent",
}: VolleyballLoaderProps) {
  const [dimensions, setDimensions] = useState({ width: 40, height: 40 });

  useEffect(() => {
    // Set dimensions based on size prop
    switch (size) {
      case "small":
        setDimensions({ width: 24, height: 24 });
        break;
      case "large":
        setDimensions({ width: 64, height: 64 });
        break;
      default:
        setDimensions({ width: 40, height: 40 });
    }
  }, [size]);

  if (!isLoading) return null;

  return (
    <div
      className="flex items-center justify-center"
      style={{ backgroundColor }}
      aria-label="Loading"
      role="status"
    >
      <motion.div
        animate={{
          rotate: 360,
          y: [0, -10, 0],
        }}
        transition={{
          rotate: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          y: { duration: 0.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <VolleyballIcon color={color} />
      </motion.div>
    </div>
  );
}
