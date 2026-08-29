const PAYMENT_TOKEN_SESSION_KEY = "acia.membership-payment.public-token.v1";
const PUBLIC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;

export function storePaymentToken(publicToken: string) {
  if (!PUBLIC_TOKEN_PATTERN.test(publicToken)) {
    throw new Error("invalid_public_payment_token");
  }
  window.sessionStorage.setItem(PAYMENT_TOKEN_SESSION_KEY, publicToken);
}

export function takePaymentToken() {
  let publicToken: string | null = null;
  try {
    publicToken = window.sessionStorage.getItem(PAYMENT_TOKEN_SESSION_KEY);
  } finally {
    window.sessionStorage.removeItem(PAYMENT_TOKEN_SESSION_KEY);
  }

  return publicToken && PUBLIC_TOKEN_PATTERN.test(publicToken)
    ? publicToken
    : null;
}

export function clearPaymentToken() {
  window.sessionStorage.removeItem(PAYMENT_TOKEN_SESSION_KEY);
}
