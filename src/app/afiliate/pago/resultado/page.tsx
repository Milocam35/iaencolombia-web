import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PaymentResult } from "@/components/payments/PaymentResult";

export const metadata: Metadata = {
  title: "Estado del pago | Afiliación ACIA",
  description: "Consulta segura del estado de pago de tu afiliación a ACIA.",
  robots: { index: false, follow: false },
};

export default function AffiliationPaymentResultPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-surface px-6 pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 gradient-mesh" />
        <div className="pointer-events-none absolute top-20 -right-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <Link
            href="/afiliate"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">←</span> Volver a afiliación
          </Link>
          <PaymentResult />
          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-muted-foreground">
            ACIA nunca confirma un pago solo porque la ventana de la pasarela se
            cierre o redirija. El estado mostrado proviene de nuestro backend.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
