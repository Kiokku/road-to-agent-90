# 主作品规格：Web Creation Agent Workbench

## 产品定位

复刻 Kimi 网页的核心建站闭环，但不追求功能对等。用户用自然语言描述网站需求，Agent 读取固定 Étiquette Style Profile，生成并预览单页 React 网站；用户可以对话修改、审查 diff，并在明确批准后自动部署到 Cloudflare Pages。

## 核心流程

```text
需求 → Model Profile → 计划 → 文件工具 → 构建 → 预览
    → 对话修改 → Diff → 部署批准 → Cloudflare URL → Trace
```

## V1 必须具备

- 服务端管理的模型选择器；只验收 Packy Terra Profile。
- 自行实现的 Responses-compatible function-calling loop。
- Node/TypeScript API、run/session 和领域事件。
- React SSE 时间线、取消、重试和一致终态。
- 隔离生成目录中的文件读取与写入工具。
- 一个内置、批准且带版本号的 Étiquette Style Profile。
- 单页 React/Vite 站点生成、真实构建和本地预览。
- 一次受限自动修复、多轮修改、diff 与版本回退。
- 工具风险级别、部署批准和敏感信息过滤。
- Cloudflare Pages Direct Upload、URL 回填和部署失败记录。
- 固定 eval case、trace、关键测试、README 和演示脚本。

## 明确不做

- 视频输入、可视化批注、模板市场和任意技术栈。
- 数据库、认证等完整全栈网站生成。
- Étiquette 的 Style Source 分析、Style Study、refinement 与发布流程。
- Agents SDK、多 Agent、自主无限修复、无批准公开部署。
- Git integration、Workers、多云发布和所有模型供应商兼容。

## 产品成功标准

用户可以从一句需求开始，看到 Agent 规划与工具调用，获得符合 Style Profile 的真实预览，提出一次修改，审查 diff，明确批准部署，并得到可访问的 Cloudflare Pages URL。任一步失败都能被看见、解释并留下 trace。

## 面试证据

- 为什么使用自建 Agent Loop 而非 Agents SDK。
- 为什么将模型原始事件映射为产品领域事件。
- 如何处理 streaming、取消、重试和副作用幂等性。
- 如何限制文件工具和保护 API Key。
- 如何验证设计契约遵守，而非只凭“看起来不错”。
- 为什么公开部署需要批准，以及如何防止批准作用于错误版本。
- 如何用 eval 和失败分类证明改进有效。
