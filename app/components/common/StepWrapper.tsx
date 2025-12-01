"use client";

import React from "react";
import { motion } from "framer-motion";

interface StepWrapperProps {
  children: React.ReactNode;
}

export function StepWrapper({ children }: StepWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}
