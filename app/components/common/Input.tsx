"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  icon?: LucideIcon;
  placeholder?: string;
  error?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
  error,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--brand-dark)]/75">
        {label}
      </label>
      <div className="relative mt-2">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-dark)]/40" />
        )}
        <input
          type={type}
          className={`input ${Icon ? "pl-10" : ""} ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
