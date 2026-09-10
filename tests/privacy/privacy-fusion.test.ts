import { describe, expect, it } from "vitest";
import { DefaultPrivacyFusionEngine } from "../../src/core/privacy/fusion/privacy-fusion";
import { TextPrivacyDetector } from "../../src/core/privacy/detectors/text-detector";

describe("Privacy Fusion", () => {
  it("detects sensitive information and blocks transmission", async () => {
    const snapshot = {
      timestamp: Date.now(),
      viewport: {
        width: 1280,
        height: 720,
      },
      elements: [],
      texts: [
        {
          text: "Contact: test@example.com",
          confidence: 1,
          source: "dom" as const,
        },
      ],
      objects: [],
    };

    const engine = new DefaultPrivacyFusionEngine([
      new TextPrivacyDetector(),
    ]);

    const result = await engine.analyze(snapshot);

    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.shouldBlockTransmission).toBe(true);
  });
});
