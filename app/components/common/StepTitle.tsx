"use client";

import React from "react";

interface StepTitleProps {
  title: string;
  subtitle?: string;
}

export function StepTitle({ title, subtitle }: StepTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-[var(--brand-dark)]/65 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
