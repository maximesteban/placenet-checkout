"use client";

import React from "react";
import { StepWrapper } from "../common/StepWrapper";
import { StepTitle } from "../common/StepTitle";
import { PlanCard } from "../common/PlanCard";
import { NavButtons } from "../common/NavButtons";
import { useCheckout } from "@/app/context/CheckoutContext";
import { ServiceType } from "@/app/types/checkout";

const planCards = [
  {
    id: "event" as ServiceType,
    title: "Pack Eventos",
    emoji: "🥳",
    price: "Precio personalizado",
    bullets: [
      "Chat del evento",
      "QR y acceso in situ",
      "Patrocinios y activaciones",
      "Geolocalización de zonas del evento",
    ],
  },
  {
    id: "basic" as ServiceType,
    title: "Plan Basic",
    emoji: "🏠",
    price: "Precio personalizado",
    bullets: [
      "Comunidad del espacio",
      "Anuncios y avisos",
      "Gestión sencilla",
      "Geolocalización del lugar",
    ],
  },
];

export function Step2ServiceSelection() {
  const { state, updateServiceSelection, nextStep, prevStep } = useCheckout();
  const { serviceSelection } = state;

  const handleSelectPlan = (planId: ServiceType) => {
    updateServiceSelection({
      serviceType: planId,
      planName: planCards.find((p) => p.id === planId)?.title || "",
    });
  };

  const canContinue = serviceSelection.serviceType !== null;

  const handleContinue = () => {
    if (canContinue) {
      nextStep();
    }
  };

  return (
    <StepWrapper>
      <StepTitle
        title="Selecciona el plan ideal"
        subtitle="Empieza hoy. Ajusta o pausa tu suscripción cuando lo necesites."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {planCards.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={serviceSelection.serviceType === plan.id}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-muted)]/50 p-4 text-sm text-[var(--brand-dark)]/80">
        <div className="font-semibold text-[var(--brand-dark)]">
          Todos los planes incluyen
        </div>
        <p className="mt-1">
          Acompañamiento experto, soporte contextual y actualizaciones
          continuas. Los precios varían según tus necesidades específicas.
        </p>
      </div>

      <NavButtons
        onBack={prevStep}
        onNext={handleContinue}
        nextDisabled={!canContinue}
      />
    </StepWrapper>
  );
}
