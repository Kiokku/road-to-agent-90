import type {
  FunctionToolDefinition,
  InputItem,
  ModelClient,
  ModelResponse,
} from "./protocol.js";

export class ScriptedModel implements ModelClient {
  readonly requests: Array<{
    input: InputItem[];
    tools: FunctionToolDefinition[];
  }> = [];

  private cursor = 0;

  constructor(private readonly script: ModelResponse[]) { }

  async respond(
    input: readonly InputItem[],
    tools: readonly FunctionToolDefinition[],
  ): Promise<ModelResponse> {
    this.requests.push({
      input: [...input],
      tools: [...tools],
    })
    const response = this.script[this.cursor++];

    if (!response) {
      throw new Error("脚本模型没有下一条预设响应");
    }

    return response;
  }
}
