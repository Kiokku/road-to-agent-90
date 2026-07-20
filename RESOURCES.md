# Agent Application Engineering Resources

## Knowledge

- [OpenAI: Function calling](https://developers.openai.com/api/docs/guides/function-calling)
  Responses API 工具调用的权威流程。用于 Week 01 的 Agent Loop、工具结果回填和终止条件。
- [OpenAI: Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses)
  Typed streaming event 与 SSE 官方说明。用于 Week 02–04 的能力检查和流式 UI。
- [OpenAI: Agents SDK vs. Responses API](https://developers.openai.com/api/docs/guides/agents#agents-sdk-vs-responses-api)
  用于解释为何短期直接控制 orchestration，并在长期比较 Agents SDK。
- [OpenAI: Using latest models](https://developers.openai.com/api/docs/guides/latest-model)
  官方 Responses 模型选择与能力参考。Packy 的 `gpt-5.6-terra` 是独立 Profile，不能借此推定等价能力。
- [PackyAPI: CLI 配置](https://docs.packyapi.com/docs/cli/)
  PackyAPI Responses wire 与 Base URL 的第一方说明。实际 streaming/function calling 仍需真实 Token 验证。
- [MDN: Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
  SSE 浏览器行为与事件格式。用于 Week 04 的传输层实现。
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
  浏览器取消异步操作的标准接口。用于取消与重试边界。
- [Node.js: Web Streams API](https://nodejs.org/api/webstreams.html)
  Node 流与 Web Streams 的官方参考。用于 Node API 的流式桥接。
- [React: Managing State](https://react.dev/learn/managing-state)
  用于把 Agent 领域事件归约成一致 UI 状态，不复习通用 React 入门。
- [Vite: Backend Integration](https://vite.dev/guide/backend-integration)
  生成站点构建与服务端集成参考。
- [Cloudflare Pages: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
  预构建静态资源经 Wrangler 发布到 Pages 的权威流程。用于 Week 10。
- [Kimi: 网页功能概览](https://www.kimi.com/zh-sg/help/websites/websites-overview)
  主作品的产品参照；只复刻对话生成、预览修改与部署核心闭环。
- [本地：Étiquette V1 规格](reference/etiquette-v1-style-source.md)
  Style Profile、Shared Brand Core、证据分级和人工批准的本地事实来源。
- [Vitest](https://vitest.dev/guide/)
  用于主作品的单元与集成验证。
- [Playwright](https://playwright.dev/docs/intro)
  用于主作品和 Hub 的真实浏览器验收。

## Wisdom (Communities)

- [OpenAI Developer Community](https://community.openai.com/)
  用于核对 Responses API 实践问题和真实故障案例；采用答案前回到官方文档验证。
- [Cloudflare Developers Discord](https://discord.cloudflare.com/)
  用于 Pages Direct Upload、Wrangler 与部署故障的实践反馈。

## Gaps

- Packy Terra Profile 的 `gpt-5.6-terra` 可用模型名、typed streaming event 和 function calling 行为只能在获得真实 Token 后验证。
- V1 Étiquette Style Profile 尚未创建和批准；Week 06 前必须完成版本化快照与人工验收。
