import { describe, expect, it, vi } from "vitest";

import { BrowserActionExecutor } from "../../src/core/agent/executor";

describe("BrowserActionExecutor", () => {
  it("executes CLICK", async () => {
    document.body.innerHTML = `
      <button id="button-1">Click</button>
    `;

    const button = document.getElementById(
      "button-1",
    ) as HTMLButtonElement;

    const clickSpy = vi.spyOn(button, "click");

    const executor = new BrowserActionExecutor();

    await executor.execute({
      type: "CLICK",
      targetId: "button-1",
    });

    expect(clickSpy).toHaveBeenCalled();
  });

  it("executes TYPE", async () => {
    document.body.innerHTML = `
      <input id="input-1" />
    `;

    const input = document.getElementById(
      "input-1",
    ) as HTMLInputElement;

    const executor = new BrowserActionExecutor();

    await executor.execute({
      type: "TYPE",
      targetId: "input-1",
      value: "hello",
    });

    expect(input.value).toBe("hello");
  });

  it("executes SELECT", async () => {
    document.body.innerHTML = `
      <select id="select-1">
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
    `;

    const select = document.getElementById(
      "select-1",
    ) as HTMLSelectElement;

    const executor = new BrowserActionExecutor();

    await executor.execute({
      type: "SELECT",
      targetId: "select-1",
      value: "two",
    });

    expect(select.value).toBe("two");
  });

  it("rejects missing CLICK target", async () => {
    const executor = new BrowserActionExecutor();

    await expect(
      executor.execute({
        type: "CLICK",
        targetId: "missing",
      }),
    ).rejects.toThrow("Target element not found");
  });

  it("executes SCROLL", async () => {
    const scrollSpy = vi
      .spyOn(window, "scrollBy")
      .mockImplementation(() => {});

    const executor = new BrowserActionExecutor();

    await executor.execute({
      type: "SCROLL",
      direction: "DOWN",
      amount: 500,
    });

    expect(scrollSpy).toHaveBeenCalledWith({
      left: 0,
      top: 500,
      behavior: "smooth",
    });

    scrollSpy.mockRestore();
  });
});
