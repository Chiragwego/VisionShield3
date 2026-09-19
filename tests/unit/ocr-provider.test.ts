import { describe, expect, it, vi } from "vitest";

import {
  OcrPerceptionProvider,
  type OcrEngine,
} from "../../src/core/perception/ocr";

describe("OcrPerceptionProvider", () => {
  it("converts OCR results into perception text", async () => {
    const engine: OcrEngine = {
      recognize: vi.fn().mockResolvedValue([
        {
          text: "Hello VisionShield",
          confidence: 0.95,
          bounds: {
            x: 10,
            y: 20,
            width: 200,
            height: 30,
          },
        },
      ]),
    };

    const provider = new OcrPerceptionProvider(engine);

    const snapshot = await provider.perceive();

    expect(snapshot.texts).toHaveLength(1);
    expect(snapshot.texts[0]?.text).toBe("Hello VisionShield");
    expect(snapshot.texts[0]?.confidence).toBe(0.95);
    expect(snapshot.texts[0]?.source).toBe("ocr");
  });
});
