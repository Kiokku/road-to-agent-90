# 12 周纵切路线：Web Creation Agent Workbench

周期：2026-07-20 至 2026-10-11
预算：每周约 10 小时，共约 120 小时
完成定义：经过测试、能够演示，并能在 5 分钟内闭卷解释机制、失败路径和技术取舍。

每周只交付一个纵切。工作日完成资料获取、检索练习和小实验，周末接入 `projects/web-creation-agent-workbench/`，运行测试并留下演示证据。

## Week 01 · 最小 Agent Loop

- Dates: 2026-07-20 — 2026-07-26
- Outcome: 能解释并实现 `request → function call → execute → function_call_output → final response`。
- Build: 用 TypeScript 和 Responses-compatible API 写最小 CLI Agent Loop，只开放一个无副作用工具并设置明确终止条件。
- Verify: 测试工具被正确调用、参数校验失败、模型不调用工具和超过最大轮次四条路径。
- Explain: 不看代码画出循环，说明 `call_id`、工具结果回填和无限循环风险。
- Interview: 回答“Agent 与一次普通 LLM 请求的本质区别是什么？”

## Week 02 · Model Profile 与 Packy 能力检查

- Dates: 2026-07-27 — 2026-08-02
- Outcome: 受控选择服务端 Model Profile，并知道“OpenAI-compatible”不等于 Responses-compatible。
- Build: 实现 Profile loader；配置 Packy Terra Profile，Base URL 为 `https://www.packyapi.com/v1`，Model ID 为 `gpt-5.6-terra`。
- Verify: 用真实 Token 检查 `/responses`、typed streaming event、function calling、错误结构和取消行为；不通过的 Profile 不出现在选择器中。
- Explain: 说明 Base URL、Model ID、Key 环境变量和 capability gate 分别解决什么问题。
- Interview: 回答“如何安全支持自定义模型而不把 API Key 暴露给浏览器？”

## Week 03 · Node API、Session 与事件契约

- Dates: 2026-08-03 — 2026-08-09
- Outcome: 浏览器不直接调用模型，Node 服务持有 Agent Loop、凭据和运行状态。
- Build: 建立最小 Node/TypeScript API，定义 run/session 以及 `planning`、`tool_call`、`observation`、`artifact`、`approval_required`、`error`、`completed` 事件。
- Verify: 事件 schema 有运行时校验；非法状态转换和未知事件会失败；API Key 不进入客户端 bundle。
- Explain: 说明浏览器、API、Agent Loop 与工具之间的状态所有权。
- Interview: 回答“为什么 Agent UI 需要自己的领域事件，而不是透传模型事件？”

## Week 04 · SSE Streaming、取消与重试

- Dates: 2026-08-10 — 2026-08-16
- Outcome: UI 能把不完整、失败和取消中的 Agent 运行变成一致状态。
- Build: React UI 消费 SSE，增量显示事件时间线；支持 `AbortController` 取消和显式重试。
- Verify: 覆盖正常完成、中途取消、连接断开、重复事件和服务端错误；每次运行只有一个终态。
- Explain: 说明 SSE 与 WebSocket 的取舍、断线后为何不能盲目重放副作用工具。
- Interview: 回答“流式 Agent UI 最难处理的状态是什么？”

## Week 05 · 文件工具与生成站点工作区

- Dates: 2026-08-17 — 2026-08-23
- Outcome: Agent 只能在隔离的生成站点目录中读取和修改允许的文件。
- Build: 添加列目录、读文件、写文件和检查工作区工具；从固定 React/Vite scaffold 创建单页站点。
- Verify: 路径穿越、工作区外写入、非法文件类型和超大写入被拒绝；工具调用全部进入 trace。
- Explain: 说明工具 schema、文件边界和模型输出为何不能直接写入任意路径。
- Interview: 回答“Coding Agent 的主要风险来自模型文本还是工具执行？”

## Week 06 · Étiquette Style Profile 与首个风格化站点

- Dates: 2026-08-24 — 2026-08-30
- Outcome: Agent 每次生成前读取唯一一个已批准、带版本号的 Style Profile。
- Build: 将 Étiquette Shared Brand Core 与一个 Project Style 固化为 V1 Style Profile，并生成首个符合契约的响应式单页站点。
- Verify: 检查必需 token、字体角色、浅深主题、WCAG AA、390px/1440px 布局和禁止项；记录不满足项而非伪造通过。
- Explain: 区分 Style Source、Style Study、Style Profile 与生成站点的职责。
- Interview: 回答“如何评估模型是否真正遵守设计规范？”

## Week 07 · 构建、预览与一次自动修复

- Dates: 2026-08-31 — 2026-09-06
- Outcome: 用户能看到真实构建结果；构建失败时 Agent 能基于错误进行一次受限修复。
- Build: 运行依赖安装、构建和本地预览；将结构化 build error 回填 Agent，最多允许一次修复循环。
- Verify: 成功构建、语法错误、依赖错误、修复成功和修复后仍失败均有确定终态与日志。
- Explain: 说明自动修复的重试上限、幂等性和何时必须停止并交给用户。
- Interview: 回答“为什么不能让 Agent 无限自我修复？”

## Week 08 · 多轮修改、Diff 与版本记录

- Dates: 2026-09-07 — 2026-09-13
- Outcome: 用户可以基于当前预览提出修改，并在接受前审查具体变更。
- Build: 保存生成版本；支持对话式修改、文件 diff、版本切换和拒绝本轮变更。
- Verify: 修改只作用于当前生成站点；拒绝后恢复上一版本；上下文没有丢失 Style Profile 版本。
- Explain: 说明版本、session、模型上下文与磁盘状态为何不能混为一体。
- Interview: 完成第一次 30 分钟模拟面试，围绕前 8 周作品追问。

## Week 09 · 工具权限、部署批准与 Trace

- Dates: 2026-09-14 — 2026-09-20
- Outcome: 本地安全动作可自动执行，公开部署必须等待明确批准。
- Build: 为工具定义风险级别；实现 `approval_required → approved/rejected`；按 run 展示输入、工具、耗时、错误和结果。
- Verify: 无批准无法部署；拒绝不会改变外部状态；过期批准不能用于新版本；敏感值不会进入 trace。
- Explain: 说明 capability、authorization、approval 和 audit 的区别。
- Interview: 演示一次被拒绝的高风险工具调用。

## Week 10 · Cloudflare Pages 自动部署

- Dates: 2026-09-21 — 2026-09-27
- Outcome: 用户批准后，Agent 自动构建并通过 Cloudflare Pages Direct Upload 发布当前版本。
- Build: 封装 `wrangler pages deploy` 部署工具，回填 deployment ID、公开 URL、构建版本和失败信息。
- Verify: 覆盖成功、鉴权失败、构建目录缺失、网络失败和重复部署；同一批准只对应一个版本。
- Explain: 说明 Direct Upload 与 Git integration 的取舍，以及为什么部署属于外部写操作。
- Interview: 演示从需求到公开 URL 的完整链路。

## Week 11 · Evals、失败注入与关键测试

- Dates: 2026-09-28 — 2026-10-04
- Outcome: 能用固定任务和失败分类判断改动是否提高产品质量。
- Build: 建立 10–20 条 eval case，覆盖生成质量、Style Profile 遵守、工具成功率、取消、修复和部署批准。
- Verify: 输出成功率、失败分类、延迟、工具调用次数和人工确认记录；至少根据一次失败改进实现并复跑。
- Explain: 区分单元测试、集成测试、eval 和人工视觉验收。
- Interview: 回答“你如何知道 Agent 改版后真的变好了？”

## Week 12 · 交付与面试叙事

- Dates: 2026-10-05 — 2026-10-11
- Outcome: 主作品可一键启动并在 5–10 分钟内完整演示，材料可以直接用于投递。
- Build: 完成 README、架构图、演示脚本、失败案例、技术取舍、简历项目描述和本地一键启动。
- Verify: 在干净环境按 README 启动；演示生成、修改、拒绝、批准、失败恢复和 Cloudflare URL；完成两次模拟面试。
- Explain: 用前端背景说明自己为什么能处理 Agent 的不确定状态、信任与工具可见性。
- Interview: 开始投递前端 AI / Agent 应用岗位并根据反馈更新问题库。

## 每周固定节奏

- 工作日短时段合计约 4 小时：读一手资料、闭卷检索、小实验、准备周末实现。
- 周末长时段约 6 小时：接入主作品、运行测试、录制或保存演示证据。
- 周末结束前：5 分钟闭卷讲解；不能解释清楚则该纵切仍为进行中。

## 12 周总验收

- 一个 Web Creation Agent Workbench，而不是多个教程 Demo。
- Packy Terra Profile 完成 Responses API、streaming、function calling 能力验证。
- Agent Loop、Node API、SSE UI、文件工具、Style Profile、预览修复、diff、批准、trace 和 Cloudflare 部署形成一条真实链路。
- 至少 10 条 eval case、两类失败演示、一次根据 eval 驱动的改进。
- README、架构图、演示脚本、简历描述和模拟面试记录完整。
