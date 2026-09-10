---

# 5. `src/core/perception/types.ts`

```typescript
export type PerceptionSource = "dom" | "ocr" | "vision";

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PerceptionText {
  readonly text: string;
  readonly confidence: number;
  readonly source: PerceptionSource;
  readonly bounds?: BoundingBox;
}

export interface PerceptionElement {
  readonly id: string;
  readonly tagName: string;
  readonly role?: string;
  readonly text?: string;
  readonly ariaLabel?: string;
  readonly bounds?: BoundingBox;
  readonly visible: boolean;
  readonly enabled?: boolean;
  readonly editable?: boolean;
}

export interface VisualObject {
  readonly id: string;
  readonly label: string;
  readonly confidence: number;
  readonly bounds: BoundingBox;
}

export interface PerceptionSnapshot {
  readonly timestamp: number;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly elements: readonly PerceptionElement[];
  readonly texts: readonly PerceptionText[];
  readonly objects: readonly VisualObject[];
}

export interface PerceptionProvider {
  readonly source: PerceptionSource;

  perceive(): Promise<PerceptionSnapshot>;
}
