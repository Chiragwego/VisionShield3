import type {
  PrivacyAnalysis,
  PrivacyFinding,
  PrivacyFusionEngine,
} from "../types";
import type { PerceptionSnapshot } from "../../perception/types";

export class DefaultPrivacyFusionEngine implements PrivacyFusionEngine {
  constructor(
    private readonly detectors: readonly {
      detect(
        snapshot: PerceptionSnapshot,
      ): Promise<readonly PrivacyFinding[]>;
    }[],
  ) {}

  async analyze(snapshot: PerceptionSnapshot): Promise<PrivacyAnalysis> {
    const results = await Promise.all(
      this.detectors.map((detector) => detector.detect(snapshot)),
    );

    const findings = results.flat();

    const riskScore = findings.length === 0
      ? 0
      : Math.min(
          1,
          Math.max(...findings.map((finding) => finding.confidence)),
        );

    const shouldBlockTransmission = findings.some(
      (finding) =>
        finding.severity === "critical" ||
        finding.severity === "high",
    );

    return {
      findings,
      riskScore,
      shouldBlockTransmission,
    };
  }
}
