"use client";

import React, { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { CheckoutProvider, useCheckout } from "./context/CheckoutContext";
import { Breadcrumb } from "./components/common/Breadcrumb";
import { ProgressBar } from "./components/common/ProgressBar";
import { Step1UserInfo } from "./components/checkout/Step1UserInfo";
import { Step2ServiceSelection } from "./components/checkout/Step2ServiceSelection";
import { Step3ServiceConfig } from "./components/checkout/Step3ServiceConfig";
import { Step4Payment } from "./components/checkout/Step4Payment";

function CheckoutFlowContent() {
  const { state } = useCheckout();
  const { currentStep } = state;

  const progress = useMemo(() => {
    return {
      1: 25,
      2: 50,
      3: 75,
      4: 100,
    }[currentStep];
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[var(--brand-light)] text-[var(--brand-dark)]">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16">
        <div className="mb-6 flex justify-end">
          <a href="https://placenet.app" className="btn-secondary">
            Salir
          </a>
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <span className="pill-muted mx-auto sm:mx-0">Checkout placenet</span>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Activa tu espacio inteligente
          </h1>
          <p className="text-sm text-[var(--brand-dark)]/70 sm:text-base">
            Completa los siguientes pasos para configurar tu experiencia placenet.
          </p>
        </div>

        <div className="mt-10 rounded-[32px] border border-[rgba(0,1,34,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_-35px_rgba(0,1,34,0.55)] backdrop-blur">
          <Breadcrumb step={currentStep} />
          <ProgressBar value={progress ?? 0} />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <Step1UserInfo key="step1" />}
              {currentStep === 2 && <Step2ServiceSelection key="step2" />}
              {currentStep === 3 && <Step3ServiceConfig key="step3" />}
              {currentStep === 4 && <Step4Payment key="step4" />}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlacenetCheckoutFlow() {
  return (
    <CheckoutProvider>
      <CheckoutFlowContent />
    </CheckoutProvider>
  );
}
