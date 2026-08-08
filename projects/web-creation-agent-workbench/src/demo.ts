import {
  AgentLoop,
  formatTrace,
} from "./agent-loop.js";
import { ScriptedModel } from "./scripted-model.js";
import { buildToolRegistry } from "./tools.js";

const model = new ScriptedModel([
  {
    output: [
      {
        type: "function_call",
        call_id: "call_demo_001",
        name: "read_project_brief",
        arguments: '{"briefId":"demo-landing-page"}',
      },
    ],
    output_text: "",
  },
  {
    output: [],
    output_text:
      "这个落地页服务于独立开发者，目标是收集候补名单。",
  },
]);

const agent = new AgentLoop(
  model,
  buildToolRegistry(),
  4,
);

const final = await agent.run(
  "读取 demo-landing-page 的项目说明并总结",
);

console.log(formatTrace(agent.history));
console.log(`final answer: ${final}`);
console.log(`model turns: ${model.requests.length}`);
console.log(`tools used: ${JSON.stringify(agent.toolNames())}`);
