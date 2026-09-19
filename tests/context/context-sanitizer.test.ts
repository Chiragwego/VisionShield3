import { describe, expect, it } from "vitest";

import { DefaultContextSanitizer } from "../../src/core/context/sanitizer";
import type { PerceptionSnapshot } from "../../src/core/perception/types";
import type { PrivacyFinding } from "../../src/core/privacy/types";

describe("DefaultContextSanitizer", () => {
  it("redacts sensitive information from element text", async () => {
    const snapshot: PerceptionSnapshot = {
      timestamp: Date.now(),
      viewport: {
        width: 1280,
        height: 720,
      },
      elements: [
        {
          id: "email-input",
          tagName: "input",
          text: "test@example.com",
          visible: true,
          editable: true,
        },
      ],
      texts: [],
      objects: [],
    };

    const findings: PrivacyFinding[] = [
      {
        id: "email-0",
        type: "email",
        source: "dom",
        confidence: 1,
        text: "test@example.com",
        severity: "high",
        recommendedStrategy: "mask",
      },
    ];

    const sanitizer = new DefaultContextSanitizer();

    const result = await sanitizer.sanitize(snapshot, findings);

    expect(result.elements[0]?.text?.value).toBe(
      "[EMAIL_REDACTED]",
    );

    expect(result.elements[0]?.text?.redacted).toBe(true);
  });

  it("keeps non-sensitive information unchanged", async () => {
    const snapshot: PerceptionSnapshot = {
      timestamp: Date.now(),
      viewport: {
        width: 1280,
        height: 720,
      },
      elements: [
        {
          id: "button-1",
          tagName: "button",
          text: "Login",
          visible: true,
          enabled: true,
        },
      ],
      texts: [],
      objects: [],
    };

    const sanitizer = new DefaultContextSanitizer();

    const result = await sanitizer.sanitize(snapshot, []);

    expect(result.elements[0]?.text?.value).toBe("Login");

    expect(result.elements[0]?.text?.redacted).toBe(false);
  });

  it("reports the correct redaction count", async () => {
    const snapshot: PerceptionSnapshot = {
      timestamp: Date.now(),
      viewport: {
        width: 1280,
        height: 720,
      },
      elements: [],
      texts: [],
      objects: [],
    };

    const findings: PrivacyFinding[] = [
      {
        id: "email-0",
        type: "email",
        source: "dom",
        confidence: 1,
        text: "test@example.com",
        severity: "high",
        recommendedStrategy: "mask",
      },
      {
        id: "phone-0",
        type: "phone",
        source: "dom",
        confidence: 0.95,
        text: "+919876543210",
        severity: "high",
        recommendedStrategy: "mask",
      },
    ];

    const sanitizer = new DefaultContextSanitizer();

    const result = await sanitizer.sanitize(snapshot, findings);

    expect(result.metadata.redactionCount).toBe(2);
  });
});
