# 使用 Responses API 并自行实现 Agent Loop

Web Creation Agent Workbench 直接使用 OpenAI Responses API 的 function calling 与 streaming，由应用接收工具调用、执行本地工具、回填结果并决定继续或终止；短期不使用 Agents SDK 封装 orchestration。这样会增加少量状态与错误处理代码，但能形成对 Agent Loop、工具权限、流式事件和失败恢复的直接能力证据，Agents SDK 延后到长期路线再用于比较。
