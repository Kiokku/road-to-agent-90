# 已实现最小 Agent Loop

学习者已在 Web Creation Agent Workbench 中用 TypeScript 实现可解释、可测试的最小 Agent Loop：模型可以请求一个只读工具，应用负责校验参数、执行工具，并用相同的 `call_id` 回填 `function_call_output`。循环在模型返回最终回答时正常结束，在超过最大轮次时明确停止。

验证证据见 [Week 01 · 最小 Agent Loop](../evidence/week-01.md)：类型检查通过，规定的四条测试路径全部通过，CLI Demo 展示了完整调用轨迹，闭卷讲解覆盖了状态所有权、结果回填和无限循环风险。
