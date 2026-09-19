import type {
  AgentAction,
  AgentTask,
  ReasoningProvider,
} from "../types";

import type { SanitizedContext } from "../../context/types";

export class AgentPlanner {
  constructor(
    private readonly reasoningProvider: ReasoningProvider,
  ) {}

  async plan(
    task: AgentTask,
    context: SanitizedContext,
  ): Promise<AgentAction> {
    const response = await this.reasoningProvider.reason({
      task,
      context,
    });

    return response.action;
  }
}
