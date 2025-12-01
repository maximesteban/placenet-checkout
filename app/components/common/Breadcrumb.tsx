"use client";

import React from "react";

interface BreadcrumbProps {
  step: number;
}

export function Breadcrumb({ step }: BreadcrumbProps) {
  const items = ["Usuario", "Servicio", "Configuración", "Pago"];

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {items.map((label, idx) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition ${
              idx + 1 <= step
                ? "border-[var(--brand-dark)] bg-[var(--brand-dark)] text-[var(--brand-light)]"
                : "border-[rgba(0,1,34,0.15)] bg-white text-[var(--brand-dark)]/45"
            }`}
          >
            {idx + 1}
          </span>
          <span
            className={`font-medium ${
              idx + 1 <= step
                ? "text-[var(--brand-dark)]"
                : "text-[var(--brand-dark)]/45"
            }`}
          >
            {label}
          </span>
          {idx < items.length - 1 && (
            <span className="text-[var(--brand-dark)]/20">/</span>
          )}
        </div>
      ))}
    </div>
  );
}
