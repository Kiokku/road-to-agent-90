import type {
  FunctionCall,
  FunctionToolDefinition,
} from "./protocol.js";

type Tool = {
  definition: FunctionToolDefinition;
  execute: (argumentsJson: string) => string;
};

export class ToolRegistry {
  private readonly tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.definition.name, tool);
  }

  names(): string[] {
    return [...this.tools.keys()].sort();
  }

  definitions(): FunctionToolDefinition[] {
    return [...this.tools.values()].map(
      (tool) => tool.definition,
    );
  }

  dispatch(call: FunctionCall): string {
    const tool = this.tools.get(call.name);

    if (!tool) {
      return JSON.stringify({
        ok: false,
        error: {
          code: "UNKNOWN_TOOL",
          message: `未开放工具：${call.name}`,
        },
      });
    }

    try {
      return tool.execute(call.arguments);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "未知工具错误";

      return JSON.stringify({
        ok: false,
        error: {
          code: "TOOL_EXECUTION_FAILED",
          message,
        },
      });
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const readProjectBrief: Tool = {
  definition: {
    type: "function",
    name: "read_project_brief",
    description: "读取一份已存在的项目说明；不会修改任何文件。",
    parameters: {
      type: "object",
      properties: {
        briefId: { type: "string" },
      },
      required: ["briefId"],
      additionalProperties: false,
    },
    strict: true,
  },
  execute(argumentsJson) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(argumentsJson);
    } catch {
      return JSON.stringify({
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "工具参数不是合法 JSON",
        },
      });
    }

    if (!isRecord(parsed) || typeof parsed.briefId !== "string") {
      return JSON.stringify({
        ok: false,
        error: {
          code: "INVALID_ARGUMENTS",
          message: "briefId 必须是字符串",
        },
      });
    }

    if (parsed.briefId !== "demo-landing-page") {
      return JSON.stringify({
        ok: false,
        error: {
          code: "BRIEF_NOT_FOUND",
          message: `找不到项目说明：${parsed.briefId}`,
        },
      });
    }

    return JSON.stringify({
      ok: true,
      data: {
        version: "v1",
        audience: "独立开发者",
        goal: "收集候补名单",
      },
    });
  },
};

export function buildToolRegistry(): ToolRegistry {
  const tools = new ToolRegistry();
  tools.register(readProjectBrief);
  return tools;
}
