import type {
  FunctionCallOutput,
  InputItem,
  ModelClient,
  TraceEntry,
} from "./protocol.js";
import { ToolRegistry } from "./tools.js";

export class AgentLoop {
  readonly history: TraceEntry[] = [];

  constructor(
    private readonly model: ModelClient,
    private readonly tools: ToolRegistry,
    private readonly maxTurns = 4,
  ) {}

  async run(userText: string): Promise<string> {
    const input: InputItem[] = [
      { role: "user", content: userText },
    ];

    this.history.push({ kind: "user", content: userText });

    for (let turn = 1; turn <= this.maxTurns; turn += 1) {
      const response = await this.model.respond(
        input,
        this.tools.definitions(),
      );

      input.push(...response.output);

      if (response.output.length === 0) {
        if (!response.output_text) {
          throw new Error(
            "模型既没有请求工具，也没有返回最终回答",
          );
        }

        this.history.push({
          kind: "final",
          content: response.output_text,
        });
        return response.output_text;
      }

      if (response.output.length > 1) {
        throw new Error("本课一次只处理一个工具请求");
      }

      const call = response.output[0];
      this.history.push({ kind: "function_call", call });

      const result: FunctionCallOutput = {
        type: "function_call_output",
        call_id: call.call_id,
        output: this.tools.dispatch(call),
      };

      input.push(result);
      this.history.push({
        kind: "function_call_output",
        result,
      });
    }

    const content = `超过最大轮次 ${this.maxTurns}，运行已结束`;
    this.history.push({ kind: "stopped", content });
    throw new Error(content);
  }

  toolNames(): string[] {
    return this.tools.names();
  }
}

export function formatTrace(history: TraceEntry[]): string {
  return history
    .map((entry, index) => {
      const number = String(index).padStart(2, "0");

      switch (entry.kind) {
        case "user":
          return `[${number} user] ${entry.content}`;
        case "function_call":
          return [
            `[${number} tool request]`,
            `${entry.call.name}(${entry.call.arguments})`,
            `call_id=${entry.call.call_id}`,
          ].join(" · ");
        case "function_call_output":
          return [
            `[${number} tool result]`,
            `call_id=${entry.result.call_id}`,
            entry.result.output,
          ].join(" · ");
        case "final":
          return `[${number} final] ${entry.content}`;
        case "stopped":
          return `[${number} stopped] ${entry.content}`;
      }

      const unreachable: never = entry;
      return unreachable;
    })
    .join("\n");
}
