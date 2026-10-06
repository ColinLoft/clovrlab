/**
 * Error reporting stub. Previously hooked into Lovable's in-editor error
 * capture; now a no-op. Replace with a real error reporter (e.g. Sentry)
 * if needed.
 */
export function reportLovableError(
  _error: unknown,
  _context: Record<string, unknown> = {},
) {
  // no-op
}
