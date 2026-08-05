/**
 * Keeps the launch mode explicit and easy to reverse without changing routes.
 * Set NEXT_PUBLIC_AUTH_REQUIRED=true when the login gate should be restored.
 */
export const authenticationRequired = process.env.NEXT_PUBLIC_AUTH_REQUIRED === "true";
