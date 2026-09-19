import type {
  PerceptionProvider,
  PerceptionSnapshot,
} from "../types";

export interface OcrResult {
  readonly text: string;
  readonly confidence: number;
  readonly bounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

export interface OcrEngine {
  recognize(image: ImageData): Promise<readonly OcrResult[]>;
}

export class OcrPerceptionProvider implements PerceptionProvider {
  readonly source = "ocr" as const;

  constructor(private readonly engine: OcrEngine) {}

  async perceive(): Promise<PerceptionSnapshot> {
    const results = await this.engine.recognize(
      await this.captureViewport(),
    );

    return {
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      elements: [],
      texts: results.map((result) => ({
        text: result.text,
        confidence: result.confidence,
        source: "ocr" as const,
        bounds: result.bounds,
      })),
      objects: [],
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
