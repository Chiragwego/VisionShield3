import type {
  ActionValidationResult,
  AgentAction,
  ActionValidator,
} from "../types";

import type { SanitizedContext } from "../../context/types";

export class DefaultActionValidator implements ActionValidator {
  async validate(
    action: AgentAction,
    context: SanitizedContext,
  ): Promise<ActionValidationResult> {
    const reasons: string[] = [];

    switch (action.type) {
      case "CLICK": {
        const target = context.elements.find(
          (element) => element.id === action.targetId,
        );

        if (!target) {
          reasons.push("CLICK target does not exist");
        } else if (!target.visible) {
          reasons.push("CLICK target is not visible");
        } else if (target.enabled === false) {
          reasons.push("CLICK target is disabled");
        }

        break;
      }

      case "TYPE": {
        const target = context.elements.find(
          (element) => element.id === action.targetId,
        );

        if (!target) {
          reasons.push("TYPE target does not exist");
        } else if (!target.visible) {
          reasons.push("TYPE target is not visible");
        } else if (!target.editable) {
          reasons.push("TYPE target is not editable");
        }

        break;
      }

      case "SCROLL": {
        if (!Number.isFinite(action.amount) || action.amount <= 0) {
          reasons.push("SCROLL amount must be greater than zero");
        }

        break;
      }

      case "NAVIGATE": {
        try {
          const url = new URL(action.url);

          if (!["http:", "https:"].includes(url.protocol)) {
            reasons.push("NAVIGATE only supports HTTP and HTTPS URLs");
          }
        } catch {
          reasons.push("NAVIGATE URL is invalid");
        }

        break;
      }

      case "SELECT": {
        const target = context.elements.find(
          (element) => element.id === action.targetId,
        );

        if (!target) {
          reasons.push("SELECT target does not exist");
        } else if (!target.visible) {
          reasons.push("SELECT target is not visible");
        } else if (target.tagName !== "select") {
          reasons.push("SELECT target is not a select element");
        }

        break;
      }
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }
}
