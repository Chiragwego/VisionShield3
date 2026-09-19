import { describe, expect, it, vi } from "vitest";

import {
  VisionPerceptionProvider,
  type VisionEngine,
} from "../../src/core/perception/vision";

describe("VisionPerceptionProvider", () => {
  it("converts vision results into perception objects", async () => {
    const engine: VisionEngine = {
      detect: vi.fn().mockResolvedValue([
        {
          label: "button",
          confidence: 0.92,
          bounds: {
            x: 100,
            y: 150,
            width: 120,
            height: 40,
          },
        },
      ]),
    };

    const provider = new VisionPerceptionProvider(engine);

    const snapshot = await provider.perceive();

    expect(snapshot.objects).toHaveLength(1);
    expect(snapshot.objects[0]?.label).toBe("button");
    expect(snapshot.objects[0]?.confidence).toBe(0.92);
    expect(snapshot.objects[0]?.id).toBe("vision-0");
  });
});
