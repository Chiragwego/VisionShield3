import type { PrivacyFinding } from "../types";

export class TextRedactor {
  redact(text: string, findings: readonly PrivacyFinding[]): string {
    let result = text;

    for (const finding of findings) {
      if (!finding.text) {
        continue;
      }

      result = result.replace(
        finding.text,
        `[${finding.type.toUpperCase()}_REDACTED]`,
      );
    }

    return result;
  }
}
