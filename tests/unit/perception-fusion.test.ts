import { describe, expect, it } from "vitest";

import { PerceptionFusionEngine } from "../../src/core/perception/fusion";
import type { PerceptionProvider } from "../../src/core/perception/types";

describe("PerceptionFusionEngine", () => {
  it("combines DOM, OCR, and vision perception", async () => {
    const providers: PerceptionProvider[] = [
      {
        source: "dom",
        perceive: async () => ({
          timestamp: Date.now(),
          viewport: {
            width: 1280,
            height: 720,
          },
          elements: [
            {
              id: "dom-0",
              tagName: "button",
              text: "Login",
              visible: true,
            },
          ],
          texts: [],
          objects: [],
        }),
      },
      {
        source: "ocr",
        perceive: async () => ({
          timestamp: Date.now(),
          viewport: {
            width: 1280,
            height: 720,
          },
          elements: [],
          texts: [
            {
              text: "Welcome",
              confidence: 0.95,
              source: "ocr",
            },
          ],
          objects: [],
        }),
      },
      {
        source: "vision",
        perceive: async () => ({
          timestamp: Date.now(),
          viewport: {
            width: 1280,
            height: 720,
          },
          elements: [],
          texts: [],
          objects: [
            {
              id: "vision-0",
              label: "button",
              confidence: 0.9,
              bounds: {
                x: 100,
                y: 100,
                width: 100,
                height: 40,
              },
            },
          ],
        }),
      },
    ];

    const engine = new PerceptionFusionEngine(providers);

    const result = await engine.perceive();

    expect(result.elements).toHaveLength(1);
    expect(result.texts).toHaveLength(1);
    expect(result.objects).toHaveLength(1);
  });
});
