"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Mail, Building2, CalendarDays, MapPin, Users, PartyPopper } from "lucide-react";

// ————————————————————————————————————————————————
// Placenet Checkout Flow (Single-file React component)
// Ready for Next.js / React app. TailwindCSS required.
// Optional: react-hook-form + zod could be integrated; kept light here.
// Stripe integration is scaffolded (mocked submit) — plug your logic where marked.
// ————————————————————————————————————————————————

export default function PlacenetCheckoutFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedPlan, setSelectedPlan] = useState<"event" | "basic" | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Config forms state (minimal viable inputs)
  const [eventCfg, setEventCfg] = useState({
    name: "",
    date: "",
    city: "",
    attendees: "",
    slug: "",
  });
  const [basicCfg, setBasicCfg] = useState({
    name: "",
    type: "Finca",
    city: "",
    slug: "",
  });
  const progress = useMemo(() => ({ 1: 20, 2: 40, 3: 70, 4: 90, 5: 100 }[step]), [step]);

  const next = async () => setStep((s) => (s < 5 ? ((s + 1) as any) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

  const planCards = [
    {
      id: "event" as const,
      title: "Pack Eventos",
      emoji: "🥳",
      price: "€XX / mes",
      bullets: ["Chat del evento", "QR y acceso in situ", "Patrocinios y activaciones"],
    },
    {
      id: "basic" as const,
      title: "Plan Basic",
      emoji: "🏠",
      price: "€YY / mes",
      bullets: ["Comunidad del espacio", "Anuncios y avisos", "Gestión sencilla"],
    },
  ];

  // ——— Validation helpers (very simple, extend as needed)
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const slugValid = (slug: string) => /^[a-z0-9-]{3,30}$/.test(slug);
  const canContinueConfig = useMemo(() => {
    if (selectedPlan === "event") {
      const ok = !!eventCfg.name && !!eventCfg.date && !!eventCfg.city && !!eventCfg.attendees && slugValid(eventCfg.slug);
      return ok;
    }
    if (selectedPlan === "basic") {
      const ok = !!basicCfg.name && !!basicCfg.type && !!basicCfg.city && slugValid(basicCfg.slug);
      return ok;
    }
    return false;
  }, [selectedPlan, eventCfg, basicCfg]);

  // ——— Mock submit payment (replace with Stripe)
  const handlePayment = async () => {
    setLoading(true);
    // TODO: Replace with Stripe Elements / Checkout session creation.
    // Send metadata: plan_type, email, slug, etc.
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[var(--brand-light)] text-[var(--brand-dark)]">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16">
        <div className="mb-6 flex justify-end">
          <a href="https://placenet.app" className="btn-secondary">Salir</a>
        </div>
        <div className="space-y-3 text-center sm:text-left">
          <span className="pill-muted mx-auto sm:mx-0">Checkout placenet</span>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Activa tu espacio inteligente
          </h1>
          <p className="text-sm text-[var(--brand-dark)]/70 sm:text-base">
            Selecciona tu plan, completa los datos clave y habilita la experiencia placenet en cuestión de minutos.
          </p>
        </div>

        <div className="mt-10 rounded-[32px] border border-[rgba(0,1,34,0.08)] bg-white/90 p-6 shadow-[0_25px_60px_-35px_rgba(0,1,34,0.55)] backdrop-blur">
          <Breadcrumb step={step} />
          <ProgressBar value={progress ?? 0} />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepWrapper key="step1">
                  <StepTitle
                    title="Selecciona el plan ideal"
                    subtitle="Empieza hoy. Ajusta o pausa tu suscripción cuando lo necesites."
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {planCards.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        selected={selectedPlan === plan.id}
                        onSelect={() => setSelectedPlan(plan.id)}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[var(--brand-dark)]/60">
                      Todos los planes incluyen acompañamiento experto y soporte contextual.
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => (selectedPlan ? next() : null)}
                      disabled={!selectedPlan}
                    >
                      Continuar
                    </button>
                  </div>
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper key="step2">
                  <StepTitle
                    title="Crea tu cuenta"
                    subtitle="Tu correo será el punto de acceso y donde recibirás facturas y actualizaciones."
                  />
                  <label className="block text-sm font-medium text-[var(--brand-dark)]/75">Correo electrónico</label>
                  <div className="relative mt-2 w-full">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--brand-dark)]/35" />
                    <input
                      type="email"
                      className="input pl-12"
                      placeholder="tucorreo@empresa.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-[var(--brand-dark)]/55">
                    Revisa tu bandeja de entrada: recibirás un onboarding y los accesos al dashboard placenet.
                  </p>
                  <NavButtons onBack={back} onNext={() => emailValid && next()} nextDisabled={!emailValid} />
                </StepWrapper>
              )}

              {step === 3 && selectedPlan && (
                <StepWrapper key="step3">
                  <StepTitle
                    title="Configura tu espacio"
                    subtitle="Personalizamos la app con la identidad de tu evento o comunidad."
                  />

                  {selectedPlan === "event" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Nombre del evento" value={eventCfg.name} onChange={(value) => setEventCfg({ ...eventCfg, name: value })} icon={PartyPopper} />
                      <Input label="Fecha" type="date" value={eventCfg.date} onChange={(value) => setEventCfg({ ...eventCfg, date: value })} icon={CalendarDays} />
                      <Input label="Ciudad" value={eventCfg.city} onChange={(value) => setEventCfg({ ...eventCfg, city: value })} icon={MapPin} />
                      <Input label="Asistentes (aprox.)" type="number" value={eventCfg.attendees} onChange={(value) => setEventCfg({ ...eventCfg, attendees: value })} icon={Users} />
                      <SlugInput value={eventCfg.slug} onChange={(value) => setEventCfg({ ...eventCfg, slug: value })} />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Nombre de la comunidad" value={basicCfg.name} onChange={(value) => setBasicCfg({ ...basicCfg, name: value })} icon={Building2} />
                      <Select
                        label="Tipo de espacio"
                        value={basicCfg.type}
                        onChange={(value) => setBasicCfg({ ...basicCfg, type: value })}
                        options={["Finca", "Edificio", "Club", "Otro"]}
                      />
                      <Input label="Ciudad" value={basicCfg.city} onChange={(value) => setBasicCfg({ ...basicCfg, city: value })} icon={MapPin} />
                      <SlugInput value={basicCfg.slug} onChange={(value) => setBasicCfg({ ...basicCfg, slug: value })} />
                    </div>
                  )}

                  <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-muted)]/50 p-4 text-sm text-[var(--brand-dark)]/80">
                    <div className="font-semibold text-[var(--brand-dark)]">¿Por qué pedimos estos datos?</div>
                    <p className="mt-1">
                      Nos permiten generar agendas inteligentes, accesos con QR y comunicaciones hipercontextuales desde el primer día.
                    </p>
                  </div>

                  <NavButtons onBack={back} onNext={() => canContinueConfig && next()} nextDisabled={!canContinueConfig} />
                </StepWrapper>
              )}

              {step === 4 && (
                <StepWrapper key="step4">
                  <StepTitle title="Confirma tu suscripción" subtitle="Pagos seguros con Stripe. Cancela cuando quieras." />

                  <div className="rounded-3xl border border-[rgba(0,1,34,0.12)] bg-white p-5 shadow-[0_20px_50px_-40px_rgba(0,1,34,0.65)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-dark)]/45">Resumen</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--brand-dark)]">
                          {selectedPlan === "event" ? "Pack Eventos" : "Plan Basic"}
                        </div>
                        <div className="mt-1 text-sm text-[var(--brand-dark)]/60">Facturación mensual • Soporte premium incluido</div>
                      </div>
                      <div className="inline-flex items-center rounded-2xl bg-[var(--brand-dark)] px-4 py-3 text-sm font-medium text-[var(--brand-light)]">
                        Total {selectedPlan === "event" ? "€XX/mes" : "€YY/mes"}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 text-sm text-[var(--brand-dark)]/70">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[var(--brand-dark)]/60" />
                        <span>Email: {email || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[var(--brand-dark)]/60" />
                        <span>
                          Dominio provisional: {selectedPlan === "event" ? `${eventCfg.slug || "tu-evento"}.placenet.app` : `${basicCfg.slug || "tu-espacio"}.placenet.app`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--brand-dark)]/75">Nombre en la tarjeta</label>
                        <input className="input mt-1" placeholder="Laura Martínez" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--brand-dark)]/75">Número de tarjeta</label>
                        <div className="relative">
                          <CreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--brand-dark)]/35" />
                          <input className="input pl-12" placeholder="4242 4242 4242 4242" />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-dark)]/75">Caducidad</label>
                          <input className="input mt-1" placeholder="MM / AA" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-dark)]/75">CVC</label>
                          <input className="input mt-1" placeholder="123" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 text-xs text-[var(--brand-dark)]/50 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                      <span>Pagos con Stripe • PCI DSS • Encriptado extremo a extremo</span>
                      <span>Factura automática cada mes. Cancela cuando quieras.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button className="btn-secondary" onClick={back}>
                      Atrás
                    </button>
                    <button className="btn-primary" onClick={handlePayment} disabled={loading}>
                      {loading ? "Procesando..." : "Confirmar suscripción"}
                    </button>
                  </div>
                </StepWrapper>
              )}

              {step === 5 && (
                <StepWrapper key="step5">
                  <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
                    <ConfettiGlow />
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-3xl">
                      ¡Tu dominio ya está listo! 🎉
                    </h2>
                    <p className="max-w-md text-sm text-[var(--brand-dark)]/70 sm:text-base">
                      Te hemos enviado el acceso al dashboard y la factura inicial. Empieza a personalizar la experiencia placenet desde ahora.
                    </p>
                    <a href="#" className="btn-primary mt-2">
                      Ir al dashboard
                    </a>
                    <a href="https://placenet.app" className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--brand-dark)]/45">
                      Explorar más soluciones en placenet.app
                    </a>
                  </div>
                </StepWrapper>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function Breadcrumb({ step }: { step: number }) {
  const items = [
    "Plan",
    "Cuenta",
    "Config",
    "Pago",
    "Listo",
  ];
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
          <span className={`font-medium ${idx + 1 <= step ? "text-[var(--brand-dark)]" : "text-[var(--brand-dark)]/45"}`}>
            {label}
          </span>
          {idx < items.length - 1 && <span className="text-[var(--brand-dark)]/20">/</span>}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-5 h-2.5 w-full rounded-full bg-[var(--brand-muted)]/60">
      <div
        className="h-2.5 rounded-full bg-[var(--brand-dark)] transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-[var(--brand-dark)]/65 sm:text-base">{subtitle}</p>}
    </div>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: { id: "event" | "basic"; title: string; emoji: string; price: string; bullets: string[] };
  selected: boolean;
  onSelect: () => void;
}) {
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
      <div className={`mt-2 text-sm font-medium ${selected ? "text-[var(--brand-light)]/80" : "text-[var(--brand-dark)]/60"}`}>
        {plan.price}
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {plan.bullets.map((b) => (
          <li key={b} className={`flex items-center gap-2 ${selected ? "text-[var(--brand-light)]/80" : "text-[var(--brand-dark)]/65"}`}>
            <Check className={`h-4 w-4 ${selected ? "text-[var(--brand-light)]" : "text-[var(--brand-dark)]/35"}`} /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5 text-sm font-semibold">
        {selected ? "Seleccionado" : "Elegir plan"}
      </div>
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  icon?: any;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--brand-dark)]/75">{label}</label>
      <div className="relative mt-2">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--brand-dark)]/35" />}
        <input
          type={type}
          className={`input ${Icon ? "pl-12" : ""}`}
          value={value as any}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--brand-dark)]/75">{label}</label>
      <select className="input mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function SlugInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-[var(--brand-dark)]/75">Dominio</label>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-2xl bg-[var(--brand-muted)]/80 px-3 py-2 text-sm font-medium text-[var(--brand-dark)]/65">placenet.app/</span>
        <input
          className="input"
          placeholder="tu-espacio"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
        />
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--brand-dark)]/45">Min 3 caracteres — solo a-z, 0-9 y guiones.</p>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button className="btn-secondary" onClick={onBack}>Atrás</button>
      <button className="btn-primary" onClick={onNext} disabled={nextDisabled}>Continuar</button>
    </div>
  );
}

function ConfettiGlow() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-[var(--brand-muted)]/80 blur-xl" />
      <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--brand-dark)] text-2xl font-bold text-[var(--brand-light)] shadow-[0_25px_45px_-30px_rgba(0,1,34,0.8)]">
        ✓
      </div>
    </div>
  );
}
