"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="mt-5 h-2.5 w-full rounded-full bg-[var(--brand-muted)]/60">
      <div
        className="h-2.5 rounded-full bg-[var(--brand-dark)] transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
