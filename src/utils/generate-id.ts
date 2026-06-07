// Shared UUID generation used across the background, content, and popup bundles.

/**
 * Generates an RFC 4122 v4 UUID.
 *
 * Prefers the native `crypto.randomUUID()`, which is available in the service
 * worker and on HTTPS pages. Content scripts inherit the host page's context,
 * so on plain `http://` pages `randomUUID` is undefined (it requires a secure
 * context); there we fall back to `crypto.getRandomValues()`, which is allowed
 * in insecure contexts and works everywhere.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // Set the version (4) and variant (10xx) bits per RFC 4122.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}
