import type {
  AgentAction,
  AgentTask,
  ActionExecutor,
  ActionValidator,
  ReasoningProvider,
} from "./types";

import type { PerceptionFusionEngine } from "../perception/fusion";
import type { PrivacyFusionEngine } from "../privacy/fusion";
import type { ContextSanitizer } from "../context/types";

export interface AgentPipelineResult {
  readonly action: AgentAction;
  readonly executed: boolean;
  readonly blocked: boolean;
  readonly reasons: readonly string[];
}

export class AgentPipeline {
  constructor(
    private readonly perception: PerceptionFusionEngine,
    private readonly privacy: PrivacyFusionEngine,
    private readonly sanitizer: ContextSanitizer,
    private readonly reasoning: ReasoningProvider,
    private readonly validator: ActionValidator,
    private readonly executor: ActionExecutor,
  ) {}

  async run(
    task: AgentTask,
  ): Promise<AgentPipelineResult> {
    // 1. Perceive the current browser state.
    const snapshot = await this.perception.perceive();

    // 2. Detect sensitive information locally.
    const privacyAnalysis = await this.privacy.analyze(snapshot);

    // 3. Sanitize before anything reaches remote reasoning.
    const sanitized = await this.sanitizer.sanitize(
      snapshot,
      privacyAnalysis.findings,
    );

    // 4. Ask the reasoning provider for an action.
    const response = await this.reasoning.reason({
      task,
      context: sanitized,
    });

    const action = response.action;

    // 5. Validate the action against sanitized context.
    const validation = await this.validator.validate(
      action,
      sanitized,
    );

    if (!validation.valid) {
      return {
        action,
        executed: false,
        blocked: true,
        reasons: validation.reasons,
      };
    }

    // 6. Execute only validated actions.
    await this.executor.execute(action);

    return {
      action,
      executed: true,
      blocked: false,
      reasons: [],
    };
  }
}
