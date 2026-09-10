import type { SanitizedContext } from "../context/types";

export type AgentAction =
  | ClickAction
  | TypeAction
  | ScrollAction
  | NavigateAction
  | SelectAction;

export interface ClickAction {
  readonly type: "CLICK";
  readonly targetId: string;
}

export interface TypeAction {
  readonly type: "TYPE";
  readonly targetId: string;
  readonly value: string;
}

export interface ScrollAction {
  readonly type: "SCROLL";
  readonly direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  readonly amount: number;
}

export interface NavigateAction {
  readonly type: "NAVIGATE";
  readonly url: string;
}

export interface SelectAction {
  readonly type: "SELECT";
  readonly targetId: string;
  readonly value: string;
}

export interface AgentTask {
  readonly id: string;
  readonly instruction: string;
}

export interface ReasoningRequest {
  readonly task: AgentTask;
  readonly context: SanitizedContext;
}

export interface ReasoningResponse {
  readonly action: AgentAction;
  readonly explanation?: string;
}

export interface ReasoningProvider {
  reason(request: ReasoningRequest): Promise<ReasoningResponse>;
}

export interface ActionValidationResult {
  readonly valid: boolean;
  readonly reasons: readonly string[];
}

export interface ActionValidator {
  validate(
    action: AgentAction,
    context: SanitizedContext,
  ): Promise<ActionValidationResult>;
}

export interface ActionExecutor {
  execute(action: AgentAction): Promise<void>;
}
