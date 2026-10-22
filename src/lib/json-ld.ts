/** Serialize JSON for an HTML script's raw-text context, preserving its data. */
export function serializeJsonLd(data: object | object[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
