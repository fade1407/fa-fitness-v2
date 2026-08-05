/**
 * Anonymous accounts keep each device's data private without requiring a password.
 * Set NEXT_PUBLIC_AUTH_REQUIRED=false only for a public, read-only preview.
 */
export const authenticationRequired = process.env.NEXT_PUBLIC_AUTH_REQUIRED !== "false";
