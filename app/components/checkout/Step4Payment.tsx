"use client";

import React, { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { StepWrapper } from "../common/StepWrapper";
import { StepTitle } from "../common/StepTitle";
import { NavButtons } from "../common/NavButtons";
import { useCheckout } from "@/app/context/CheckoutContext";

export function Step4Payment() {
  const { state, prevStep } = useCheckout();
  const { userInfo, serviceSelection, serviceConfig } = state;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // TODO: Aquí enviarías los datos al backend para generar el link de pago personalizado
      const checkoutData = {
        userInfo,
        serviceSelection,
        serviceConfig,
      };

      console.log("Checkout data:", checkoutData);

      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Aquí mostrarías un mensaje de éxito o redirigirías
      alert(
        "¡Solicitud enviada! Te enviaremos un link de pago personalizado a tu email."
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepWrapper>
      <StepTitle
        title="Resumen de tu pedido"
        subtitle="Revisa la información antes de continuar. Te enviaremos un link de pago personalizado."
      />

      <div className="rounded-3xl border border-[rgba(0,1,34,0.12)] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,1,34,0.65)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-dark)]/45">
              Resumen
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--brand-dark)]">
              {serviceSelection.planName}
            </div>
            <div className="mt-1 text-sm text-[var(--brand-dark)]/60">
              Precio personalizado según tus necesidades
            </div>
          </div>
          <div className="inline-flex items-center rounded-2xl bg-[var(--brand-dark)] px-4 py-3 text-sm font-medium text-[var(--brand-light)]">
            <CreditCard className="mr-2 h-4 w-4" />
            Precio a confirmar
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[rgba(0,1,34,0.08)] pt-6">
          <div className="text-sm font-semibold text-[var(--brand-dark)]">
            Información del usuario
          </div>
          <div className="grid gap-2 text-sm text-[var(--brand-dark)]/70">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Nombre:</strong> {userInfo.fullName}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Email:</strong> {userInfo.email}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Teléfono:</strong> {userInfo.phone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Empresa:</strong> {userInfo.company}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[rgba(0,1,34,0.08)] pt-6">
          <div className="text-sm font-semibold text-[var(--brand-dark)]">
            Configuración del servicio
          </div>
          <div className="grid gap-2 text-sm text-[var(--brand-dark)]/70">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Nombre:</strong> {serviceConfig.name}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
              <span>
                <strong>Dirección:</strong> {serviceConfig.address},{" "}
                {serviceConfig.city}
              </span>
            </div>
            {serviceConfig.geoJsonArea && (
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/60 flex-shrink-0" />
                <span>Zona geográfica delimitada en el mapa</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-accent)]/10 p-4 text-sm text-[var(--brand-dark)]/80">
        <div className="font-semibold text-[var(--brand-dark)]">
          ¿Qué sigue?
        </div>
        <p className="mt-1">
          Al continuar, revisaremos tu solicitud y te enviaremos un link de
          pago personalizado de Stripe a <strong>{userInfo.email}</strong>.
          Este link incluirá el precio final basado en tus necesidades
          específicas.
        </p>
      </div>

      <NavButtons
        onBack={prevStep}
        onNext={handleSubmit}
        nextLabel="Enviar solicitud"
        loading={loading}
      />
    </StepWrapper>
  );
}
