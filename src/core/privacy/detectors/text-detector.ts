import type { PrivacyDetector, PrivacyFinding } from "../types";
import type { PerceptionSnapshot } from "../../perception/types";

export class TextPrivacyDetector implements PrivacyDetector {
  readonly id = "text-privacy-detector";

  async detect(
    snapshot: PerceptionSnapshot,
  ): Promise<readonly PrivacyFinding[]> {
    const findings: PrivacyFinding[] = [];

    for (const item of snapshot.texts) {
      const text = item.text;

      if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) {
        findings.push({
          id: `email-${findings.length}`,
          type: "email",
          source: item.source,
          confidence: item.confidence,
          bounds: item.bounds,
          text,
          severity: "high",
          recommendedStrategy: "mask",
        });
      }

      if (/\b(?:\+?\d[\d\s().-]{8,}\d)\b/.test(text)) {
        findings.push({
          id: `phone-${findings.length}`,
          type: "phone",
          source: item.source,
          confidence: item.confidence,
          bounds: item.bounds,
          text,
          severity: "high",
          recommendedStrategy: "mask",
        });
      }
    }

    return findings;
  }
}
