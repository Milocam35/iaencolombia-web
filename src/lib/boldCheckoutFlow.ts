import type { BoldCheckoutResponse } from "@/lib/affiliationPayments";
import type { PlanCode } from "@/lib/membershipPlans";

type PrepareCheckout = (request: {
  payment_context: string;
  plan_code: PlanCode;
}) => Promise<BoldCheckoutResponse>;

type OpenCheckout = (
  preparedCheckout: BoldCheckoutResponse,
) => Promise<void> | void;

export type PreparedCheckoutOpenResult =
  | {
      kind: "opened";
      preparedCheckout: BoldCheckoutResponse;
    }
  | {
      kind: "opening_failed";
      preparedCheckout: BoldCheckoutResponse;
      error: unknown;
    };

export type CheckoutPreparationResult =
  | PreparedCheckoutOpenResult
  | {
      kind: "preparation_failed";
      error: unknown;
    };

export async function prepareAndOpenBoldCheckout({
  paymentContext,
  planCode,
  prepareCheckout,
  openCheckout,
  onPrepared,
}: {
  paymentContext: string;
  planCode: PlanCode;
  prepareCheckout: PrepareCheckout;
  openCheckout: OpenCheckout;
  onPrepared: (preparedCheckout: BoldCheckoutResponse) => void;
}): Promise<CheckoutPreparationResult> {
  let preparedCheckout: BoldCheckoutResponse;

  try {
    preparedCheckout = await prepareCheckout({
      payment_context: paymentContext,
      plan_code: planCode,
    });
  } catch (error) {
    return { kind: "preparation_failed", error };
  }

  try {
    onPrepared(preparedCheckout);
  } catch (error) {
    return { kind: "opening_failed", preparedCheckout, error };
  }

  return attemptPreparedBoldCheckoutOpen(preparedCheckout, openCheckout);
}

export async function attemptPreparedBoldCheckoutOpen(
  preparedCheckout: BoldCheckoutResponse,
  openCheckout: OpenCheckout,
): Promise<PreparedCheckoutOpenResult> {
  try {
    await openCheckout(preparedCheckout);
    return { kind: "opened", preparedCheckout };
  } catch (error) {
    return { kind: "opening_failed", preparedCheckout, error };
  }
}
