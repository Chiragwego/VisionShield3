import type {
  PerceptionElement,
  PerceptionSnapshot,
} from "../types";

export class DomPerception {
  perceive(): PerceptionSnapshot {
    const elements: PerceptionElement[] = [];

    document.querySelectorAll<HTMLElement>(
      "button, a, input, textarea, select, [role]"
    ).forEach((element, index) => {
      const rect = element.getBoundingClientRect();

      elements.push({
        id: `dom-${index}`,
        tagName: element.tagName.toLowerCase(),
        role: element.getAttribute("role") ?? undefined,
        text: element.textContent?.trim() || undefined,
        ariaLabel: element.getAttribute("aria-label") ?? undefined,
        bounds: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        visible: rect.width > 0 && rect.height > 0,
        enabled:
          !("disabled" in element) ||
          !(element as HTMLButtonElement).disabled,
        editable:
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement,
      });
    });

    return {
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      elements,
      texts: [],
      objects: [],
    };
  }
}
