import type {
  ReasoningProvider,
  ReasoningRequest,
  ReasoningResponse,
} from "../types";

export class MockReasoningProvider implements ReasoningProvider {
  async reason(
    request: ReasoningRequest,
  ): Promise<ReasoningResponse> {
    const firstButton = request.context.elements.find(
      (element) =>
        element.tagName === "button" &&
        element.visible &&
        element.enabled !== false,
    );

    if (firstButton) {
      return {
        action: {
          type: "CLICK",
          targetId: firstButton.id,
        },
        explanation: "Mock reasoning selected the first visible button.",
      };
    }

    return {
      action: {
        type: "SCROLL",
        direction: "DOWN",
        amount: 500,
      },
      explanation: "No suitable button was found, so the page is scrolled.",
    };
  }
}
