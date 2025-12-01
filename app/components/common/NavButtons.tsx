"use client";

import React from "react";

interface NavButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  loading?: boolean;
}

export function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continuar",
  backLabel = "Atrás",
  loading = false,
}: NavButtonsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button className="btn-secondary" onClick={onBack} disabled={loading}>
        {backLabel}
      </button>
      <button
        className="btn-primary"
        onClick={onNext}
        disabled={nextDisabled || loading}
      >
        {loading ? "Procesando..." : nextLabel}
      </button>
    </div>
  );
}
