# 使用服务端管理的 Responses-compatible Model Profile

Web Creation Agent Workbench 通过模型选择器使用服务端预先配置的 Model Profile；每个 Profile 声明显示名称、Responses-compatible Base URL、Model ID、密钥环境变量和 streaming/function calling 能力。浏览器不能提交 API Key、任意 URL 或任意模型名称，服务启动时验证必要能力；这增加了一个受控适配边界，但允许官方 OpenAI 与兼容 Responses API 的自定义模型共用同一 Agent Loop，而不泄露凭据或虚假承诺兼容所有 OpenAI-compatible 服务。V1 的首个实际 Profile 使用 PackyAPI 中转：Base URL 为 `https://www.packyapi.com/v1`，Model ID 计划使用 `gpt-5.6-terra`，其完整能力必须通过真实 Token 的 conformance check 后才能标记可用。
