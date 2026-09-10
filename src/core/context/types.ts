import type { BoundingBox, PerceptionElement } from "../perception/types";
import type { PrivacyFinding } from "../privacy/types";

export interface SanitizedText {
  readonly value: string;
  readonly source: "dom" | "ocr" | "semantic";
  readonly redacted: boolean;
}

export interface SanitizedRegion {
  readonly bounds: BoundingBox;
  readonly replacement: string;
  readonly reason: PrivacyFinding["type"];
}

export interface SanitizedElement {
  readonly id: string;
  readonly tagName: PerceptionElement["tagName"];
  readonly role?: string;
  readonly text?: SanitizedText;
  readonly bounds?: BoundingBox;
  readonly visible: boolean;
  readonly enabled?: boolean;
  readonly editable?: boolean;
}

export interface SanitizedContext {
  readonly version: 1;
  readonly timestamp: number;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly elements: readonly SanitizedElement[];
  readonly regions: readonly SanitizedRegion[];
  readonly metadata: {
    readonly privacyRiskScore: number;
    readonly redactionCount: number;
  };
}

export interface ContextSanitizer {
  sanitize(
    snapshot: import("../perception/types").PerceptionSnapshot,
    findings: readonly PrivacyFinding[],
  ): Promise<SanitizedContext>;
}

export interface SanitizationResult {
  readonly context: SanitizedContext;
  readonly safeToTransmit: boolean;
  readonly blockedReasons: readonly string[];
}
