import type { BoundingBox, PerceptionSource } from "../perception/types";

export type SensitiveDataType =
  | "email"
  | "phone"
  | "name"
  | "password"
  | "credit-card"
  | "government-id"
  | "api-key"
  | "access-token"
  | "private-key"
  | "cookie"
  | "financial-data"
  | "face"
  | "identity-document"
  | "confidential-content"
  | "unknown-sensitive";

export type RedactionStrategy =
  | "mask"
  | "blur"
  | "replace"
  | "semantic";

export interface PrivacyFinding {
  readonly id: string;
  readonly type: SensitiveDataType;
  readonly source: PerceptionSource;
  readonly confidence: number;
  readonly bounds?: BoundingBox;
  readonly text?: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly recommendedStrategy: RedactionStrategy;
}

export interface PrivacyAnalysis {
  readonly findings: readonly PrivacyFinding[];
  readonly riskScore: number;
  readonly shouldBlockTransmission: boolean;
}

export interface PrivacyDetector {
  readonly id: string;

  detect(
    snapshot: import("../perception/types").PerceptionSnapshot,
  ): Promise<readonly PrivacyFinding[]>;
}

export interface PrivacyFusionEngine {
  analyze(
    snapshot: import("../perception/types").PerceptionSnapshot,
  ): Promise<PrivacyAnalysis>;
}
