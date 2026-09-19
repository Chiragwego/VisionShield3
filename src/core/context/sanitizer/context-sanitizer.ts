import type {
  ContextSanitizer,
  SanitizedContext,
  SanitizedElement,
  SanitizedRegion,
  SanitizedText,
} from "../types";

import type { PerceptionSnapshot } from "../../perception/types";
import type { PrivacyFinding } from "../../privacy/types";

export class DefaultContextSanitizer implements ContextSanitizer {
  async sanitize(
    snapshot: PerceptionSnapshot,
    findings: readonly PrivacyFinding[],
  ): Promise<SanitizedContext> {
    const sanitizedElements: SanitizedElement[] = snapshot.elements.map(
      (element) => {
        const matchingFinding = findings.find(
          (finding) => finding.bounds === undefined &&
            finding.text !== undefined &&
            element.text?.includes(finding.text),
        );

        let sanitizedText: SanitizedText | undefined;

        if (element.text !== undefined) {
          sanitizedText = {
            value: matchingFinding
              ? `[${matchingFinding.type.toUpperCase()}_REDACTED]`
              : element.text,
            source: "dom",
            redacted: matchingFinding !== undefined,
          };
        }

        return {
          id: element.id,
          tagName: element.tagName,
          role: element.role,
          text: sanitizedText,
          bounds: element.bounds,
          visible: element.visible,
          enabled: element.enabled,
          editable: element.editable,
        };
      },
    );

    const regions: SanitizedRegion[] = findings
      .filter(
        (finding): finding is PrivacyFinding & {
          bounds: NonNullable<PrivacyFinding["bounds"]>;
        } => finding.bounds !== undefined,
      )
      .map((finding) => ({
        bounds: finding.bounds,
        replacement: `[${finding.type.toUpperCase()}_REDACTED]`,
        reason: finding.type,
      }));

    const riskScore =
      findings.length === 0
        ? 0
        : Math.min(
            1,
            Math.max(...findings.map((finding) => finding.confidence)),
          );

    return {
      version: 1,
      timestamp: snapshot.timestamp,
      viewport: snapshot.viewport,
      elements: sanitizedElements,
      regions,
      metadata: {
        privacyRiskScore: riskScore,
        redactionCount: findings.length,
      },
    };
  }
}
