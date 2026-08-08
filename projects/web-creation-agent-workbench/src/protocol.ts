export type UserInput = {
  role: "user";
  content: string;
}

export type FunctionCall = {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
}

export type FunctionCallOutput = {
  type: "function_call_output";
  call_id: string;
  output: string;
}

export type InputItem =
  | UserInput
  | FunctionCall
  | FunctionCallOutput;

export type FunctionToolDefinition = {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  strict: true;
}

export type ModelResponse = {
  output: FunctionCall[];
  output_text: string;
}

export type TraceEntry =
  | { kind: "user"; content: string }
  | { kind: "function_call"; call: FunctionCall }
  | { kind: "function_call_output"; result: FunctionCallOutput }
  | { kind: "final"; content: string }
  | { kind: "stopped"; content: string };

export interface ModelClient {
  respond(
    input: readonly InputItem[],
    tools: readonly FunctionToolDefinition[]
  ): Promise<ModelResponse>
}
