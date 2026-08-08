# Week 01 · 最小 Agent Loop

- Build: [Workbench 最小 Agent Loop](../projects/web-creation-agent-workbench/src/agent-loop.ts)，包含一个只读 `read_project_brief` 工具、Responses-compatible 调用协议、脚本模型和最大轮次终止条件
- Test: [`npm run check` 与 `npm test` 输出](./week-01/test-output.txt)，类型检查通过，四条规定路径全部通过
- Demo: [`npm run demo` 终端记录](./week-01/demo-output.txt)，展示 user → function call → function_call_output → final response 完整轨迹
- Explain: [闭卷讲解与追问记录](./week-01/explain.md)；[main.ts Agent Loop 学习笔记](./week-01/agent-loop-main-ts-study-note.png)
- Result: verified
- Reflection: 模型只负责提出工具请求；应用负责参数校验、工具执行、结果回填和终止。使用脚本模型牺牲真实模型的不确定性，换取可重复测试的最小因果链；下一步只增加受控 Model Profile 与 Responses 能力检查。
