import { describe, expect, it } from "vitest";
import { DomPerception } from "../../src/core/perception/dom";

describe("DomPerception", () => {
  it("detects interactive DOM elements", () => {
    document.body.innerHTML = `
      <button id="test-button">Click me</button>
      <input aria-label="Email" />
      <a href="/test">Test link</a>
    `;

    const perception = new DomPerception();
    const snapshot = perception.perceive();

    expect(snapshot.elements.length).toBe(3);
    expect(snapshot.elements.some(
      (element) => element.tagName === "button"
    )).toBe(true);
  });
});
