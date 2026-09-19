import { describe, expect, it } from "vitest";

import { DefaultActionValidator } from "../../src/core/agent/actions";
import type { SanitizedContext } from "../../src/core/context/types";

const context: SanitizedContext = {
  version: 1,
  timestamp: Date.now(),
  viewport: {
    width: 1280,
    height: 720,
  },
  elements: [
    {
      id: "button-1",
      tagName: "button",
      text: {
        value: "Login",
        source: "dom",
        redacted: false,
      },
      bounds: {
        x: 100,
        y: 100,
        width: 100,
        height: 40,
      },
      visible: true,
      enabled: true,
    },
    {
      id: "input-1",
      tagName: "input",
      text: {
        value: "",
        source: "dom",
        redacted: false,
      },
      visible: true,
      editable: true,
    },
    {
      id: "select-1",
      tagName: "select",
      visible: true,
      enabled: true,
      editable: true,
    },
  ],
  regions: [],
  metadata: {
    privacyRiskScore: 0,
    redactionCount: 0,
  },
};

describe("DefaultActionValidator", () => {
  const validator = new DefaultActionValidator();

  it("accepts a valid CLICK action", async () => {
    const result = await validator.validate(
      {
        type: "CLICK",
        targetId: "button-1",
      },
      context,
    );

    expect(result.valid).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("rejects CLICK when target does not exist", async () => {
    const result = await validator.validate(
      {
        type: "CLICK",
        targetId: "missing-button",
      },
      context,
    );

    expect(result.valid).toBe(false);
    expect(result.reasons).toContain(
      "CLICK target does not exist",
    );
  });

  it("accepts a valid TYPE action", async () => {
    const result = await validator.validate(
      {
        type: "TYPE",
        targetId: "input-1",
        value: "hello",
      },
      context,
    );

    expect(result.valid).toBe(true);
  });

  it("rejects TYPE on a non-editable element", async () => {
    const result = await validator.validate(
      {
        type: "TYPE",
        targetId: "button-1",
        value: "hello",
      },
      context,
    );

    expect(result.valid).toBe(false);
    expect(result.reasons).toContain(
      "TYPE target is not editable",
    );
  });

  it("accepts a valid SCROLL action", async () => {
    const result = await validator.validate(
      {
        type: "SCROLL",
        direction: "DOWN",
        amount: 500,
      },
      context,
    );

    expect(result.valid).toBe(true);
  });

  it("accepts a valid NAVIGATE action", async () => {
    const result = await validator.validate(
      {
        type: "NAVIGATE",
        url: "https://example.com",
      },
      context,
    );

    expect(result.valid).toBe(true);
  });

  it("accepts a valid SELECT action", async () => {
    const result = await validator.validate(
      {
        type: "SELECT",
        targetId: "select-1",
        value: "option-1",
      },
      context,
    );

    expect(result.valid).toBe(true);
  });
});
