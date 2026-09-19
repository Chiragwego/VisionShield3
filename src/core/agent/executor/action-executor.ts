import type {
  ActionExecutor,
  AgentAction,
} from "../types";

export class BrowserActionExecutor implements ActionExecutor {
  async execute(action: AgentAction): Promise<void> {
    switch (action.type) {
      case "CLICK":
        this.click(action.targetId);
        break;

      case "TYPE":
        this.type(action.targetId, action.value);
        break;

      case "SCROLL":
        this.scroll(action.direction, action.amount);
        break;

      case "NAVIGATE":
        this.navigate(action.url);
        break;

      case "SELECT":
        this.select(action.targetId, action.value);
        break;
    }
  }

  private click(targetId: string): void {
    const element = this.getElement(targetId);

    if (!(element instanceof HTMLElement)) {
      throw new Error(`CLICK target is not an HTMLElement: ${targetId}`);
    }

    element.click();
  }

  private type(targetId: string, value: string): void {
    const element = this.getElement(targetId);

    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLTextAreaElement)
    ) {
      throw new Error(`TYPE target is not editable: ${targetId}`);
    }

    element.focus();
    element.value = value;

    element.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    element.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  }

  private scroll(
    direction: "UP" | "DOWN" | "LEFT" | "RIGHT",
    amount: number,
  ): void {
    const x =
      direction === "LEFT"
        ? -amount
        : direction === "RIGHT"
          ? amount
          : 0;

    const y =
      direction === "UP"
        ? -amount
        : direction === "DOWN"
          ? amount
          : 0;

    window.scrollBy({
      left: x,
      top: y,
      behavior: "smooth",
    });
  }

  private navigate(url: string): void {
    window.location.assign(url);
  }

  private select(targetId: string, value: string): void {
    const element = this.getElement(targetId);

    if (!(element instanceof HTMLSelectElement)) {
      throw new Error(`SELECT target is not a select element: ${targetId}`);
    }

    element.value = value;

    element.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  }

  private getElement(targetId: string): Element {
    const element = document.getElementById(targetId);

    if (!element) {
      throw new Error(`Target element not found: ${targetId}`);
    }

    return element;
  }
}
