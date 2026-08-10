"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ACIA_API_URL } from "@/lib/config";

type ProspectType = "person" | "company" | "institution" | "strategic_ally";

const TYPE_OPTIONS: Array<{ value: ProspectType; label: string }> = [
  { value: "person", label: "Persona" },
  { value: "company", label: "Empresa" },
  { value: "institution", label: "Institución educativa / gremio" },
  { value: "strategic_ally", label: "Entidad pública / embajada" },
];

const PLAN_OPTIONS: Record<Exclude<ProspectType, "strategic_ally">, Array<{ value: string; label: string }>> = {
  person: [
    { value: "comunidad", label: "Comunidad / Freemium" }, { value: "afiliado", label: "Afiliado" },
    { value: "estudiante", label: "Estudiante" }, { value: "profesional", label: "Profesional" },
  ],
  company: [
    { value: "micro_empresa", label: "Micro empresa" }, { value: "pequena_empresa", label: "Pequeña empresa" },
    { value: "mediana_empresa", label: "Mediana empresa" }, { value: "gran_empresa", label: "Gran empresa" },
  ],
  institution: [{ value: "institucion_educativa", label: "Institución educativa / gremio" }],
};

const PLAN_TYPES = Object.fromEntries(Object.entries(PLAN_OPTIONS).flatMap(([type, plans]) => plans.map((plan) => [plan.value, type]))) as Record<string, ProspectType>;

function validType(value?: string): ProspectType | null {
  return TYPE_OPTIONS.some((option) => option.value === value) ? value as ProspectType : null;
}

export function AffiliationForm({ initialPlan, initialType }: { initialPlan?: string; initialType?: string }) {
  const preselectedType = PLAN_TYPES[initialPlan ?? ""] ?? validType(initialType) ?? "person";
  const preselectedPlan = PLAN_TYPES[initialPlan ?? ""] === preselectedType ? initialPlan ?? "" : "";
  const [prospectType, setProspectType] = useState<ProspectType>(preselectedType);
  const [planCode, setPlanCode] = useState(preselectedPlan);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const showOrganization = prospectType !== "person";
  const plans = useMemo(() => prospectType === "strategic_ally" ? [] : PLAN_OPTIONS[prospectType], [prospectType]);

  const changeType = (type: ProspectType) => { setProspectType(type); setPlanCode(""); setResult(null); };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setResult(null);
    if (!ACIA_API_URL) {
      setResult({ kind: "error", message: "El formulario no está disponible temporalmente. Puedes escribirnos a info@iaencolombia.org." });
      return;
    }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nullable = (name: string) => String(form.get(name) ?? "").trim() || null;
    const payload = {
      prospect_type: prospectType, plan_code: prospectType === "strategic_ally" ? null : planCode || null,
      contact_name: String(form.get("contact_name") ?? "").trim(), email: String(form.get("email") ?? "").trim(),
      phone: nullable("phone"), organization_name: showOrganization ? nullable("organization_name") : null,
      organization_role: showOrganization ? nullable("organization_role") : null, city: nullable("city"),
      message: nullable("message"), privacy_accepted: form.get("privacy_accepted") === "on", website: nullable("website"),
    };
    setSubmitting(true);
    try {
      const response = await fetch(`${ACIA_API_URL}/public/affiliation-prospects`, {
        method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("request_failed");
      setResult({ kind: "success", message: "Hemos recibido tu interés en vincularte a ACIA. Te contactaremos al correo registrado para continuar el proceso." });
      formElement.reset(); setPlanCode("");
    } catch {
      setResult({ kind: "error", message: "No pudimos enviar tu solicitud. Revisa los datos e inténtalo nuevamente. Si el problema continúa, escríbenos a info@iaencolombia.org." });
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-primary/[0.07] sm:p-9">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6"><div><p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">Solicitud de interés</p><h2 className="mt-2 text-xl font-extrabold text-primary">Tus datos de contacto</h2></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">Sin costo</span></div>
      <fieldset className="mt-7"><legend className="text-sm font-bold text-foreground">Tipo de vinculación <Required /></legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{TYPE_OPTIONS.map((option) => <label key={option.value} className={`cursor-pointer rounded-xl border p-4 text-sm font-semibold transition ${prospectType === option.value ? "border-primary bg-secondary text-primary ring-1 ring-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}><input className="sr-only" type="radio" name="prospect_type" value={option.value} checked={prospectType === option.value} onChange={() => changeType(option.value)} />{option.label}</label>)}</div></fieldset>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nombre del contacto" required><input name="contact_name" required maxLength={160} autoComplete="name" className={inputClass} /></Field>
        <Field label="Correo electrónico" required><input name="email" type="email" required maxLength={320} autoComplete="email" className={inputClass} /></Field>
        <Field label="Teléfono / WhatsApp" hint="Opcional, pero recomendado"><input name="phone" type="tel" maxLength={50} autoComplete="tel" className={inputClass} /></Field>
        <Field label="Ciudad"><input name="city" maxLength={120} autoComplete="address-level2" className={inputClass} /></Field>
        {showOrganization && <><Field label="Organización" required><input name="organization_name" required maxLength={200} autoComplete="organization" className={inputClass} /></Field><Field label="Cargo"><input name="organization_role" maxLength={160} autoComplete="organization-title" className={inputClass} /></Field></>}
      </div>
      {prospectType !== "strategic_ally" && <Field label="Plan de interés" className="mt-5"><select value={planCode} onChange={(event) => setPlanCode(event.target.value)} className={inputClass}><option value="">No estoy seguro todavía</option>{plans.map((plan) => <option key={plan.value} value={plan.value}>{plan.label}</option>)}</select></Field>}
      <Field label="Mensaje" className="mt-5"><textarea name="message" maxLength={2000} rows={4} className={inputClass} placeholder="Cuéntanos brevemente qué esperas encontrar en ACIA." /></Field>
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Sitio web</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={500} /></div>
      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-4 text-sm leading-6 text-muted-foreground"><input name="privacy_accepted" type="checkbox" required className="mt-1 size-4 shrink-0 accent-primary" /><span>He leído y acepto la política de tratamiento de datos personales. <Required /></span></label>
      {result && <p className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${result.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`} role={result.kind === "error" ? "alert" : "status"}>{result.message}</p>}
      <button type="submit" disabled={submitting} className="mt-6 flex h-13 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:bg-[#031560] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Enviando solicitud…</> : "Enviar mi solicitud"}</button>
      <p className="mt-4 text-center text-xs text-muted-foreground">Solo usaremos estos datos para atender tu interés de vinculación.</p>
    </form>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10";
function Required() { return <span className="text-red-600" aria-hidden="true">*</span>; }
function Field({ label, hint, required, className = "", children }: { label: string; hint?: string; required?: boolean; className?: string; children: React.ReactNode }) { return <label className={`block text-sm font-bold text-foreground ${className}`}>{label} {required && <Required />}{hint && <span className="ml-1 text-xs font-normal text-muted-foreground">({hint})</span>}{children}</label>; }
