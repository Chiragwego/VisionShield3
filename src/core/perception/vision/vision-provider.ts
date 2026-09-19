import type {
  PerceptionProvider,
  PerceptionSnapshot,
  VisualObject,
} from "../types";

export interface VisionResult {
  readonly label: string;
  readonly confidence: number;
  readonly bounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

export interface VisionEngine {
  detect(image: ImageData): Promise<readonly VisionResult[]>;
}

export class VisionPerceptionProvider implements PerceptionProvider {
  readonly source = "vision" as const;

  constructor(private readonly engine: VisionEngine) {}

  async perceive(): Promise<PerceptionSnapshot> {
    const results = await this.engine.detect(
      await this.captureViewport(),
    );

    const objects: VisualObject[] = results.map((result, index) => ({
      id: `vision-${index}`,
      label: result.label,
      confidence: result.confidence,
      bounds: result.bounds,
    }));

    return {
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      elements: [],
      texts: [],
      objects,
    };
  }

  private async captureViewport(): Promise<ImageData> {
    const canvas = document.createElement("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create canvas context");
    }

    return context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }
}
