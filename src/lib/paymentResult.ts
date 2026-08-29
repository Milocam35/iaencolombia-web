import type { MembershipPaymentStatus } from "@/lib/affiliationPayments";

export function getPaymentStatusPresentation(status: MembershipPaymentStatus) {
  if (status === "approved") {
    return {
      title: "Pago confirmado",
      description:
        "Recibimos la confirmación del pago. La vinculación continuará con la revisión de ACIA.",
      icon: "success" as const,
      iconClass: "bg-emerald-50 text-emerald-700",
    };
  }
  if (status === "rejected") {
    return {
      title: "El pago no fue aprobado",
      description:
        "La solicitud permanece registrada. Puedes comunicarte con ACIA para revisar las opciones disponibles.",
      icon: "error" as const,
      iconClass: "bg-red-50 text-red-700",
    };
  }
  if (status === "cancelled") {
    return {
      title: "El pago fue anulado",
      description:
        "La orden fue anulada. Tu solicitud de vinculación permanece registrada.",
      icon: "cancelled" as const,
      iconClass: "bg-amber-50 text-amber-800",
    };
  }
  if (status === "expired") {
    return {
      title: "El pago no fue aprobado",
      description:
        "La orden venció antes de recibir una confirmación. Tu solicitud permanece registrada.",
      icon: "cancelled" as const,
      iconClass: "bg-amber-50 text-amber-800",
    };
  }
  return {
    title: "Estamos verificando tu pago",
    description:
      "La confirmación definitiva aún no ha llegado. Puedes consultar nuevamente dentro de unos minutos.",
    icon: "pending" as const,
    iconClass: "bg-secondary text-primary",
  };
}
