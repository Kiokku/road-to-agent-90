import { describe, expect, it } from "vitest";
import { AgentLoop } from "../src/agent-loop.js";
import { ScriptedModel } from "../src/scripted-model.js";
import { buildToolRegistry } from "../src/tools.js";
import type { ModelResponse } from "../src/protocol.js";

const toolCall = (
  callId: string,
  argumentsJson = '{"briefId":"demo-landing-page"}',
) => ({
  output: [
    {
      type: "function_call" as const,
      call_id: callId,
      name: "read_project_brief",
      arguments: argumentsJson,
    },
  ],
  output_text: "",
});

function createLoop(
  script: ModelResponse[],
  maxTurns = 4,
): { loop: AgentLoop; model: ScriptedModel } {
  const model = new ScriptedModel(script);
  const loop = new AgentLoop(
    model,
    buildToolRegistry(),
    maxTurns,
  );

  return { loop, model };
}

describe("AgentLoop", () => {
  it("执行工具并把结果交回同一次调用", async () => {
    const { loop, model } = createLoop([
      toolCall("call_001"),
      {
        output: [],
        output_text: "服务于独立开发者，目标是收集候补名单。",
      },
    ]);

    const answer = await loop.run("读取项目说明并总结");

    expect(answer).toContain("独立开发者");
    expect(model.requests).toHaveLength(2);
    expect(loop.history.map((entry) => entry.kind)).toEqual([
      "user",
      "function_call",
      "function_call_output",
      "final",
    ]);

    const result = model.requests[1].input.find(
      (item) =>
        "type" in item &&
        item.type === "function_call_output",
    );

    expect(result).toMatchObject({
      type: "function_call_output",
      call_id: "call_001",
    });
  });

  it("参数错误时把错误结果交回模型", async () => {
    const { loop } = createLoop([
      toolCall("call_bad_args", "{}"),
      {
        output: [],
        output_text: "缺少 briefId，无法读取项目说明。",
      },
    ]);

    await loop.run("读取项目说明");

    const entry = loop.history.find(
      (item) => item.kind === "function_call_output",
    );

    if (entry?.kind !== "function_call_output") {
      throw new Error("history 缺少工具结果");
    }

    expect(JSON.parse(entry.result.output)).toMatchObject({
      ok: false,
      error: { code: "INVALID_ARGUMENTS" },
    });
  });

  it("模型不请求工具时直接结束", async () => {
    const { loop, model } = createLoop([
      {
        output: [],
        output_text: "你好，现在不需要读取项目说明。",
      },
    ]);

    const answer = await loop.run("你好");

    expect(answer).toBe("你好，现在不需要读取项目说明。");
    expect(model.requests).toHaveLength(1);
    expect(loop.history.map((entry) => entry.kind)).toEqual([
      "user",
      "final",
    ]);
  });

  it("达到最大轮次后结束", async () => {
    const { loop, model } = createLoop([
      toolCall("call_001"),
      toolCall("call_002"),
    ], 2);

    await expect(
      loop.run("一直读取项目说明"),
    ).rejects.toThrow("超过最大轮次 2");

    expect(model.requests).toHaveLength(2);
    expect(loop.history.at(-1)).toEqual({
      kind: "stopped",
      content: "超过最大轮次 2，运行已结束",
    });
  });
});
