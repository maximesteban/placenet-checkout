"use client";

import React from "react";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: {
    id: string;
    title: string;
    emoji: string;
    price: string;
    bullets: string[];
  };
  selected: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex h-full flex-col rounded-[28px] border p-6 text-left transition-all duration-200 ${
        selected
          ? "border-[var(--brand-dark)] bg-[var(--brand-dark)] text-[var(--brand-light)] shadow-[0_30px_60px_-40px_rgba(0,1,34,0.8)]"
          : "border-[rgba(0,1,34,0.12)] bg-white/85 text-[var(--brand-dark)] shadow-[0_15px_40px_-35px_rgba(0,1,34,0.75)] hover:-translate-y-1 hover:border-[rgba(0,1,34,0.25)]"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">{plan.title}</div>
        <div className="text-2xl">{plan.emoji}</div>
      </div>
      <div
        className={`mt-2 text-sm font-medium ${
          selected
            ? "text-[var(--brand-light)]/80"
            : "text-[var(--brand-dark)]/60"
        }`}
      >
        {plan.price}
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {plan.bullets.map((b) => (
          <li
            key={b}
            className={`flex items-center gap-2 ${
              selected
                ? "text-[var(--brand-light)]/80"
                : "text-[var(--brand-dark)]/65"
            }`}
          >
            <Check
              className={`h-4 w-4 ${
                selected
                  ? "text-[var(--brand-light)]"
                  : "text-[var(--brand-dark)]/35"
              }`}
            />{" "}
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5 text-sm font-semibold">
        {selected ? "Seleccionado" : "Elegir plan"}
      </div>
    </button>
  );
}
