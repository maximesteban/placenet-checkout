"use client";

import React, { useMemo } from "react";
import { CalendarDays, Users, PartyPopper, Building2 } from "lucide-react";
import { StepWrapper } from "../common/StepWrapper";
import { StepTitle } from "../common/StepTitle";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { NavButtons } from "../common/NavButtons";
import { InteractiveMap } from "./InteractiveMap";
import { useCheckout } from "@/app/context/CheckoutContext";

export function Step3ServiceConfig() {
  const { state, updateServiceConfig, nextStep, prevStep } = useCheckout();
  const { serviceConfig, serviceSelection } = state;
  const isEventPlan = serviceSelection.serviceType === "event";

  const canContinue = useMemo(() => {
    const baseValid =
      serviceConfig.name.trim().length > 0 &&
      serviceConfig.address.trim().length > 0 &&
      serviceConfig.coordinates !== null;

    if (isEventPlan) {
      return (
        baseValid &&
        !!serviceConfig.date &&
        !!serviceConfig.attendees &&
        parseInt(serviceConfig.attendees) > 0
      );
    }

    return baseValid && !!serviceConfig.type;
  }, [serviceConfig, isEventPlan]);

  const handleContinue = () => {
    if (canContinue) {
      nextStep();
    }
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    // Extract city from address (usually the last or second to last part)
    const parts = address.split(",");
    const city =
      parts.length > 2
        ? parts[parts.length - 2].trim()
        : parts[parts.length - 1].trim();

    updateServiceConfig({
      address,
      city,
      coordinates: { lat, lng },
    });
  };

  return (
    <StepWrapper>
      <StepTitle
        title="Configura tu espacio"
        subtitle="Personaliza los detalles de tu evento o comunidad y define su ubicación."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {isEventPlan ? (
          <>
            <Input
              label="Nombre del evento"
              value={serviceConfig.name}
              onChange={(value) => updateServiceConfig({ name: value })}
              icon={PartyPopper}
              placeholder="Festival de Verano 2025"
            />
            <Input
              label="Fecha del evento"
              type="date"
              value={serviceConfig.date || ""}
              onChange={(value) => updateServiceConfig({ date: value })}
              icon={CalendarDays}
            />
            <Input
              label="Asistentes (aprox.)"
              type="number"
              value={serviceConfig.attendees || ""}
              onChange={(value) => updateServiceConfig({ attendees: value })}
              icon={Users}
              placeholder="500"
            />
          </>
        ) : (
          <>
            <Input
              label="Nombre de la comunidad"
              value={serviceConfig.name}
              onChange={(value) => updateServiceConfig({ name: value })}
              icon={Building2}
              placeholder="Residencial Los Olivos"
            />
            <Select
              label="Tipo de espacio"
              value={serviceConfig.type || "Finca"}
              onChange={(value) => updateServiceConfig({ type: value })}
              options={["Finca", "Edificio", "Club", "Otro"]}
            />
          </>
        )}
      </div>

      <InteractiveMap
        onAddressSelect={handleAddressSelect}
        onGeoJsonChange={(geoJson) =>
          updateServiceConfig({ geoJsonArea: geoJson })
        }
        initialAddress={serviceConfig.address}
      />

      {serviceConfig.address && (
        <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-muted)]/50 p-4 text-sm text-[var(--brand-dark)]/80">
          <div className="font-semibold text-[var(--brand-dark)]">
            Ubicación seleccionada
          </div>
          <p className="mt-1">{serviceConfig.address}</p>
          {serviceConfig.geoJsonArea && (
            <p className="mt-2 text-xs text-[var(--brand-dark)]/65">
              ✓ Zona delimitada en el mapa
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-muted)]/50 p-4 text-sm text-[var(--brand-dark)]/80">
        <div className="font-semibold text-[var(--brand-dark)]">
          ¿Por qué necesitamos esta información?
        </div>
        <p className="mt-1">
          La ubicación y la zona geográfica nos permiten crear experiencias
          contextuales y personalizadas para tus usuarios. Los datos del{" "}
          {isEventPlan ? "evento" : "espacio"} nos ayudan a configurar
          funcionalidades específicas desde el primer día.
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
