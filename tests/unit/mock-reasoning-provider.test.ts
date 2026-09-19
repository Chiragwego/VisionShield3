import { describe, expect, it } from "vitest";

import { MockReasoningProvider } from "../../src/core/agent/reasoning";

describe("MockReasoningProvider", () => {
  it("selects a visible button", async () => {
    const provider = new MockReasoningProvider();

    const result = await provider.reason({
      task: {
        id: "task-1",
        instruction: "Click the login button",
      },
      context: {
        version: 1,
        timestamp: Date.now(),
        viewport: {
          width: 1280,
          height: 720,
        },
        elements: [
          {
            id: "button-1",
            tagName: "button",
            text: {
              value: "Login",
              source: "dom",
              redacted: false,
            },
            visible: true,
            enabled: true,
          },
        ],
        regions: [],
        metadata: {
          privacyRiskScore: 0,
          redactionCount: 0,
        },
      },
    });

    expect(result.action).toEqual({
      type: "CLICK",
      targetId: "button-1",
    });
  });

  it("scrolls when no button is available", async () => {
    const provider = new MockReasoningProvider();

    const result = await provider.reason({
      task: {
        id: "task-2",
        instruction: "Find something below",
      },
      context: {
        version: 1,
        timestamp: Date.now(),
        viewport: {
          width: 1280,
          height: 720,
        },
        elements: [],
        regions: [],
        metadata: {
          privacyRiskScore: 0,
          redactionCount: 0,
        },
      },
    });

    expect(result.action).toEqual({
      type: "SCROLL",
      direction: "DOWN",
      amount: 500,
    });
  });
});
