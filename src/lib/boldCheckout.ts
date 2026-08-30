import type { BoldCheckoutResponse } from "@/lib/affiliationPayments";

export const BOLD_CHECKOUT_SCRIPT_URL =
  "https://checkout.bold.co/library/boldPaymentButton.js";

interface BoldCheckoutConfig {
  apiKey: string;
  orderId: string;
  amount: string;
  currency: string;
  integritySignature: string;
  description: string;
  redirectionUrl: string;
  originUrl?: string;
}

interface BoldCheckoutInstance {
  open(): void;
}

type BoldCheckoutConstructor = new (
  config: BoldCheckoutConfig,
) => BoldCheckoutInstance;

declare global {
  interface Window {
    BoldCheckout?: BoldCheckoutConstructor;
  }
}

let boldScriptPromise: Promise<BoldCheckoutConstructor> | null = null;

export function loadBoldCheckoutScript(): Promise<BoldCheckoutConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("bold_checkout_requires_browser"));
  }

  if (window.BoldCheckout) return Promise.resolve(window.BoldCheckout);
  if (boldScriptPromise) return boldScriptPromise;

  boldScriptPromise = new Promise<BoldCheckoutConstructor>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${BOLD_CHECKOUT_SCRIPT_URL}"]`,
    );
    const script = existing ?? document.createElement("script");

    const loaded = () => {
      if (window.BoldCheckout) {
        resolve(window.BoldCheckout);
      } else {
        boldScriptPromise = null;
        reject(new Error("bold_checkout_constructor_unavailable"));
      }
    };
    const failed = () => {
      boldScriptPromise = null;
      reject(new Error("bold_checkout_script_failed"));
    };

    script.addEventListener("load", loaded, { once: true });
    script.addEventListener("error", failed, { once: true });

    if (!existing) {
      script.src = BOLD_CHECKOUT_SCRIPT_URL;
      script.async = true;
      script.dataset.aciaBoldCheckout = "true";
      document.head.appendChild(script);
    }
  });

  return boldScriptPromise;
}

export async function openBoldCheckout(response: BoldCheckoutResponse) {
  const BoldCheckout = await loadBoldCheckoutScript();
  const config: BoldCheckoutConfig = {
    apiKey: response.apiKey,
    orderId: response.orderId,
    amount: String(response.amount),
    currency: response.currency,
    integritySignature: response.integritySignature,
    description: response.description,
    redirectionUrl: response.redirectionUrl,
    ...(response.originUrl ? { originUrl: response.originUrl } : {}),
  };
  const checkout = new BoldCheckout(config);
  checkout.open();
}
