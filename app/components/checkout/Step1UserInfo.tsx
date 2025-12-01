"use client";

import React, { useMemo } from "react";
import { User, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { StepWrapper } from "../common/StepWrapper";
import { StepTitle } from "../common/StepTitle";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { NavButtons } from "../common/NavButtons";
import { useCheckout } from "@/app/context/CheckoutContext";
import { BusinessSector } from "@/app/types/checkout";

const sectorOptions: { value: BusinessSector | ""; label: string }[] = [
  { value: "", label: "Selecciona tu sector" },
  { value: "hosteleria", label: "Hostelería" },
  { value: "turismo", label: "Turismo" },
  { value: "eventos", label: "Eventos" },
  { value: "retail", label: "Retail" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "otros", label: "Otros" },
];

export function Step1UserInfo() {
  const { state, updateUserInfo, nextStep } = useCheckout();
  const { userInfo } = state;

  const emailValid = /\S+@\S+\.\S+/.test(userInfo.email);
  const phoneValid = /^[+]?[\d\s()-]{9,}$/.test(userInfo.phone);

  const canContinue = useMemo(() => {
    return (
      userInfo.fullName.trim().length > 0 &&
      emailValid &&
      phoneValid &&
      userInfo.company.trim().length > 0 &&
      userInfo.sector !== ""
    );
  }, [userInfo, emailValid, phoneValid]);

  const handleContinue = () => {
    if (canContinue) {
      nextStep();
    }
  };

  return (
    <StepWrapper>
      <StepTitle
        title="Cuéntanos sobre ti"
        subtitle="Necesitamos algunos datos para personalizar tu experiencia. En el futuro podrás iniciar sesión para autocompletar este paso."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          value={userInfo.fullName}
          onChange={(value) => updateUserInfo({ fullName: value })}
          icon={User}
          placeholder="María García López"
        />

        <Input
          label="Email"
          type="email"
          value={userInfo.email}
          onChange={(value) => updateUserInfo({ email: value })}
          icon={Mail}
          placeholder="maria@empresa.com"
          error={
            userInfo.email && !emailValid ? "Email inválido" : undefined
          }
        />

        <Input
          label="Teléfono"
          type="tel"
          value={userInfo.phone}
          onChange={(value) => updateUserInfo({ phone: value })}
          icon={Phone}
          placeholder="+34 600 123 456"
          error={
            userInfo.phone && !phoneValid ? "Teléfono inválido" : undefined
          }
        />

        <Input
          label="Empresa u Organización"
          value={userInfo.company}
          onChange={(value) => updateUserInfo({ company: value })}
          icon={Building2}
          placeholder="Mi Empresa S.L."
        />

        <Select
          label="Sector o Vertical"
          value={userInfo.sector}
          onChange={(value) =>
            updateUserInfo({ sector: value as BusinessSector | "" })
          }
          options={sectorOptions.map((opt) => opt.value)}
        />
      </div>

      <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-muted)]/50 p-4 text-sm text-[var(--brand-dark)]/80">
        <div className="font-semibold text-[var(--brand-dark)]">
          ¿Por qué necesitamos esta información?
        </div>
        <p className="mt-1">
          Estos datos nos ayudan a adaptar la plataforma a tu sector y enviarte
          comunicaciones relevantes. Tu privacidad es importante para nosotros.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continuar
        </button>
      </div>
    </StepWrapper>
  );
}
