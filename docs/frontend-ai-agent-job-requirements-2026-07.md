# 前端 AI / Agent 应用工程师岗位要求调研

> 调研日期：2026-07-19
> 目标：校准本项目 12 周短期路线，使学习产出能够支持前端 Agent / AI 应用岗位面试。

## 结论

当前岗位没有形成统一的“Agent 前端工程师”职称，但要求已经收敛为一种明确的 **frontend-leaning product/full-stack engineer**：以 React/TypeScript 为基础，能够把模型和 Agent 的流式、不确定、长任务状态做成可信的产品体验，并能越过浏览器边界完成 API、工具调用和最小生产质量闭环。

对本项目而言，短期优先级应是：

1. 保留 React/TypeScript 作为已具备的入场能力，不再重复学习普通前端基础。
2. 把 SSE/stream、取消、重试、恢复、乱序/失败状态和工具执行卡片列为第一差异化能力。
3. 亲手实现最小 Agent Loop、tool schema、tool call/observation 回填和权限边界；不能只会调用聊天接口。
4. 至少完成一条 Node.js/TypeScript API 到 React UI 的端到端链路。
5. 给作品加入最小 eval/trace：固定任务集、失败分类、延迟、工具错误与人工确认记录。
6. MCP 和基础 RAG 值得做成一条可演示切片，但不应先于 streaming、Agent Loop 和 API 闭环。

## 方法与边界

- 只使用雇主官网或其官方 ATS（Ashby、Greenhouse、Lever）中仍可访问的职位；未采用培训机构文章或招聘趋势博客。
- 样本包含一个中国大陆校招岗位、亚洲远程、香港/新加坡邻近岗位，以及具有代表性的全球远程/欧美岗位。它适合判断能力趋势，但不是中国大陆职位数量或薪资统计。
- “必需”表示岗位把能力写在职责、Requirements、About You 或成功条件中；“加分”表示明确写为 bonus、preferred、plus 或 especially fit。
- 岗位可能随时下线；以下链接与判断以调研日期为准。

## 反复出现的要求

| 能力 | 市场判断 | 一手证据 | 对 12 周路线的含义 |
| --- | --- | --- | --- |
| React / TypeScript 与复杂前端工程 | **必需** | OKX、Terzo、Eloquent、CRA、Close、Archy、Hercules、LangChain、OpenAI 和 Assembled 均直接要求或使用 React/TypeScript；岗位同时强调状态管理、性能、测试和组件体系。 | 不刷 React 入门；用 Agent Workbench 证明复杂状态、性能、测试和产品完成度。 |
| Streaming / 实时 Agent UX | **细分岗位必需，普通 AI 前端加分** | CRA 明确要求 SSE、重试、取消、stop/resume、错误恢复；Close 和 Directive 要求 streamed responses、uncertain/partial states、agent-driven UI；Eloquent 和 Terzo 把实时系统列为加分。 | 必须做一次生产级 SSE/stream 闭环；这是当前能力缺口，也是最强前端差异化证据。 |
| Tool calling / Agent Loop / MCP | **Agent 岗位必需；MCP 本身仍多为加分** | CRA 和 Directive 要求 function/tool calling；Binance Applied AI 要求 retrieval、tool-use logic 与 orchestration；Sanity 的职责包含 Agent Loop 与 MCP；OKX 把 MCP、custom skills/tools 列为 strong plus。 | 先实现协议无关的 Agent Loop 与工具调用，再加一个 MCP 工具；不要把“会 MCP 名词”当核心能力。 |
| Backend / API / 数据层 | **高频必需** | Binance 的 AI Web Fullstack 要求 Node.js API/SSR/BFF；CRA、Directive、Sanity、Assembled、Archy、Hercules、LangChain 和 OpenAI 都要求跨前后端或 API 所有权；Terzo 要求能设计 API contract。 | 短期不必成为通用后端专家，但必须能独立完成 TypeScript API、鉴权/错误处理、事件协议和数据持久化的最小纵切。 |
| RAG / eval / observability | **Agent 工程岗位重要；纯前端岗位不普遍** | 百度和 Binance Applied AI 直接出现 RAG/retrieval 与 Eval；Sanity 要求 eval/experiment；CRA 要求 logging、tracing、metrics、tests；Close 要做 Agent observability surfaces；LangChain 岗位直接围绕 observability/evals。 | 做基础 RAG 引用即可；把更多时间放在可见 trace、固定 eval case 和失败分析，避免深挖向量检索算法。 |
| AI coding tools | **正在从加分项变成工作方式要求** | OKX、Directive、Close、Assembled、Archy、Hercules 和 Binance Applied AI 均明确要求日常使用 Claude Code、Cursor、Codex 或同类 Agent，并对结果负责。 | 作品要保留 AI 协作证据：任务拆解、验证、review、测试和人工判断；不能只说“用 AI 提效”。 |
| 产品交付与作品证据 | **必需** | Close 要求已向真实用户交付 LLM 功能；Terzo、Assembled、Hercules 强调从模糊问题到上线和客户结果；Binance 早期岗位把个人 LLM/Agent 项目列为加分。 | 一个完整、可运行、可解释的主作品胜过多个教程 Demo；README、演示脚本、失败案例和设计取舍都属于面试证据。 |

中国大陆样本也验证了方向，但应注意证据层级：百度的岗位列表公开的是工作职责，没有在同一列表中展示独立任职资格。因此 Planning–Acting–Reflection、Tool/API、Memory、RAG、Eval 等可视为国内团队正在建设的能力面，不能据此断言每一项都是所有前端候选人的硬门槛。

## 必会与加分项

### 短期面试前必须形成证据

- React/TypeScript：复杂状态、组件设计、性能与测试；现有复杂表格经验可以作为基础证据。
- Agent streaming UI：增量事件解析、`AbortController`、断线重试、取消、恢复和完整终态。
- Agent 可解释性：plan、tool call、observation、文件变更、成本/延迟、错误和人工确认。
- 最小 Agent runtime：结构化工具调用、执行、结果回填、终止条件、失败与权限边界。
- Node.js/TypeScript API：清晰事件契约、错误模型、基本持久化或 session 状态。
- 产品质量：关键路径测试、固定 eval 任务、trace/日志、可运行部署、README 和 5–10 分钟演示。
- AI-native 开发方式：能展示如何用 AI 编码工具加速，同时由自己完成架构判断、验证和安全审查。

### 有价值，但可作为单一切片完成

- 一个 MCP server/client 集成，重点解释 schema、权限、失败与 UI 呈现。
- 一个带引用的基础 RAG 流程，重点解释来源、空召回和错误答案，而非复杂召回优化。
- Python 基本读写、Docker、Postgres/Redis、云部署和可观测平台接入。
- WebSocket、WebRTC、沙箱容器、多模型适配、上下文压缩和成本路由。

### 12 周内不应抢占主线

- 模型训练、微调和深度 ML 理论。
- 同时深学多个 Agent framework 或向量数据库。
- 为了“覆盖 JD”做多个互不连贯的聊天机器人 Demo。
- 在没有 Agent Loop、streaming 和失败闭环之前先做复杂多 Agent 编排。

## 面试官最可能要求你证明什么

1. **你交付过什么。** 展示一次从任务输入到可审查输出的完整流程，而不是罗列 SDK。
2. **失败时发生什么。** 演示流中断、工具失败、用户取消、重试或恢复中的至少两种。
3. **用户为何能信任 Agent。** 展示来源、工具参数、权限确认、文件 diff、trace 或人工接管。
4. **你是否能跨过 API 边界。** 解释浏览器、API、Agent runtime 和工具之间的事件与状态所有权。
5. **你如何评价质量。** 给出固定任务、通过标准、失败分类，以及一次根据 eval 改进实现的记录。
6. **AI 写了代码后你负责什么。** 说明架构约束、review、测试、安全边界和最终判断。

## 样本岗位与原始证据

### 亚洲 / 中文求职者邻近样本

- [百度 — 2027 AIDU Agent 应用全栈工程师 J99974（北京校招）](https://talent.baidu.com/jobs/list?projectType=3&recruitType=GRADUATE)：岗位职责覆盖 Autonomous Agent、Planning–Acting–Reflection、Tool/API、Memory、多轮推理与状态、Multi-Agent、RAG，以及成功率/稳定性/成本/延迟/UX 的 Eval。列表页未同时展示独立任职资格，故只作为国内能力方向信号。
- [OKX — Staff/Senior Staff Frontend Engineer, Customer Genius & BOSS（新加坡）](https://job-boards.greenhouse.io/okx/jobs/7712938003)：要求 React/TypeScript 和 AI coding agents；职责包括 custom skills、MCP servers、tool integrations；MCP/Agent extensibility 明确为 strong plus。
- [Binance — AI Web Fullstack Developer（亚洲远程）](https://jobs.lever.co/binance/3f4cc8a9-5e05-4d93-a5b1-be277cf3f3a3)：要求 React、Node.js 服务、API integration、SSR/BFF、状态管理和高质量 UI 交付记录。
- [Binance — Applied AI Agent Engineer（亚洲远程、早期人才）](https://jobs.lever.co/binance/303def79-701c-4b29-aceb-e07877a22d1d)：职责包含 Agent workflow、retrieval、tool-use、orchestration、backend integration、eval、benchmark、failure analysis 和 AI coding tools；个人 LLM/Agent 项目为加分项。
- [Binance — AI Agent Engineer（亚洲/香港/台北、早期人才）](https://jobs.lever.co/binance/439d6f0a-bf27-45b5-8cd2-0783d105bb7b)：要求 Agent framework 基础，职责包含生产 Agent、benchmark dataset、prompt、tool integration、workflow 与全栈 tooling；ML 知识仅为加分项。

### 全球岗位能力基准

- [Charles River Associates — Full Stack Agentic Developer](https://job-boards.greenhouse.io/charlesriverassociates/jobs/7983777)：最完整的目标能力描述；明确覆盖 React/TypeScript、Node/Express、SSE、stop/resume、tool call、Agent Loop、权限、评测、trace 和可恢复工作流。
- [Directive — AI Web Developer（加拿大远程）](https://jobs.ashbyhq.com/directive/6a64a3c2-61c0-49bf-94f1-23184ca9107a)：要求 React/TypeScript、API/auth/database/background job 全栈范围；LLM 集成须覆盖 streaming、tool/function calling、structured output、timeout、retry 与 guardrail，并要求 daily AI coding 和 telemetry。
- [Close — Senior Software Engineer, Frontend/React（美国远程）](https://jobs.ashbyhq.com/close/8b67d1fa-5852-4f7d-b8c2-cedc20b16da7)：要求已交付 LLM 功能，并能设计 streamed responses、uncertain states、agent-driven UI 和客户可见的 Agent observability；日常使用 Claude Code/Codex。
- [Terzo — Senior/Staff Frontend Engineer（美国远程）](https://job-boards.greenhouse.io/terzo/jobs/4267135009)：React/TypeScript、架构/状态/性能和 API contract 为核心；AI-driven、data-dense、real-time UI 为加分。
- [Eloquent AI — Software Engineer, Front-End（远程）](https://jobs.ashbyhq.com/eloquentai/9889bccd-79a9-4590-be64-0fe640ea8b3c)：要求 React/TypeScript 和产品/设计能力；AI/data-intensive UI、streaming data、CUI/chat UX、跨栈 API 为加分。
- [Assembled — Software Engineer, Product, Frontend-leaning（美国远程）](https://jobs.ashbyhq.com/assembledhq/c3df088b-7a30-4e1a-b9c6-def05c140c07)：要求跨 frontend/backend/API/data/AI workflow 交付，并要求日常使用 AI coding agents。
- [Archy — Staff Frontend Software Engineer（美国远程）](https://jobs.ashbyhq.com/Archy/6ccab302-5c12-47f5-bb69-277b500959d3)：要求 React/TypeScript、后端集成、生产稳定性、测试和性能；使用 AI 时仍需对逻辑、安全和架构负责。
- [Hercules — Frontend Engineer](https://jobs.ashbyhq.com/hercules/ca4bc69a-cde4-4a9f-8269-a81be1f75668)：要求 TypeScript/React、system/API design、独立交付和 AI-native 编码；栈同时包含 AI SDK、数据库、容器与 OpenTelemetry。
- [Sanity — Senior Software Engineer, Content Agent](https://www.sanity.io/careers/senior-software-engineer-content-agent)：要求 TypeScript/React 并能跨 frontend/API/backend，已交付生产 LLM 系统；职责直接包括 MCP、Agent Loop、human escalation、system prompt、eval 和 experiment。
- [LangChain — FullStack Engineer, AI Observability & Evals Platform](https://jobs.ashbyhq.com/langchain/ddf92275-1cc3-49c0-9f25-e8ded43b07f6)：要求 React/TypeScript、Go/Python、Postgres/Redis 和 API scaling；说明 eval/observability 产品本身也需要强全栈能力。
- [OpenAI — Software Engineer, Codex User Activation](https://openai.com/careers/software-engineer-codex-user-activation-san-francisco/)：要求从 polished frontend 到 backend service、experimentation、analytics 和 production operations 的端到端所有权；React/TypeScript/Python/Go 为代表技术。

## 对当前路线的直接校准

当前主作品 `Agent Workbench` 与岗位方向一致，但完成标准不应只是“有聊天界面和工具卡片”。它至少要证明：

- React UI 能消费一个有明确 schema 的 SSE 事件流；
- 用户可以取消，失败后可以重试或恢复，并能看到最终一致状态；
- 至少一个真实工具经过 schema 校验和人工确认后执行；
- Node/TypeScript 服务持有 session 与 Agent Loop，而不是只返回 mock 文本；
- trace 页面能按一次 run 展示延迟、工具调用、错误和结果；
- 固定 eval case 能复现成功与失败，并留下迭代记录；
- README 能解释事件协议、状态所有权、权限模型和 SSE/WebSocket 取舍。

达到这些标准后，再加一个 MCP 工具和一个带引用的 RAG 切片，即足以覆盖本次样本中最常见的前端 Agent 面试能力；无需在 12 周内扩展成通用多 Agent 平台。
