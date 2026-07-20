# 第 13 周以后：全栈 Agent 应用路线

长期路线在短期主作品完成后启动，不与前 12 周并行。

## 4–6 个月 · 补齐服务端与 RAG

- 用 Python/FastAPI 重写或补充 Agent API，对比 Node 事件模型。
- 学习 LangGraph 的 state、node、edge、checkpoint 和 human-in-the-loop。
- 为 Web Creation Agent 增加真实文档检索：chunk、embedding、retrieval、rerank、citation。
- 把 eval、trace、latency、token/cost 和 tool error 接入持续回归。
- 使用 Docker Compose 提供前端、API 与存储的一键启动。

验收：能独立解释并实现 React 前端、FastAPI/LangGraph orchestration、RAG、eval 和部署的端到端链路。

## 6–12 个月 · 工程化与差异化

- 比较自建 Responses Loop 与 Agents SDK 的适用边界。
- 长任务队列、checkpoint resume、历史回放和幂等工具。
- 多模型质量/成本路由，但必须由 eval 驱动。
- 企业知识权限、审计、数据隔离和 secret management。
- 自动 eval 回归、发布门禁和可观测平台。
- IDE、CLI、MCP 与 Web Workbench 的组合交付。
- 只有出现可被独立拆分且有实际收益的任务后，才学习多 Agent。

验收：不只会“做 Agent Demo”，而能负责生产级 Agent 应用的状态、权限、质量、成本和运维。

## 长期路线原则

- 用短期主作品继续演进，不另起一批聊天机器人。
- 每引入一个框架，都要能说明它替代了哪段自建机制及代价。
- 先有 eval 与失败样本，再做复杂优化和模型路由。
- 长期方向根据真实投递反馈调整，不把路线图当作必须全部学完的课程表。
