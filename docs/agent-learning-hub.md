# Agent Learning Hub

## Goal

为前端到全栈 Agent 应用开发学习提供一个只读入口，展示当前学习焦点、12 个 Week 路线以及围绕 Web Creation Agent Workbench 累积的完成证据。

## Source of truth

Hub 读取仓库中的 Mission、Lesson、Learning Record、Glossary 与完成证据。当前 Week 是最早一个没有 verified Evidence 的 Week，不由日期决定。学习完成状态不保存在 localStorage；localStorage 只保存主题等界面偏好。详见 [ADR-0001](./adr/0001-repository-evidence-is-the-learning-source-of-truth.md)。

## Information hierarchy

1. 首屏：Mission、当前 Week 与下一步。
2. 主体：可展开的 12 个 Week 纵切路线。
3. 学习成果：Lessons 与完成证据。
4. 学习状态：Learning Records 与 Glossary。
5. 支撑材料：精选 Resources。
6. 长期路线：折叠展示全栈 Agent 应用开发方向。

## Product boundary

- Hub 是学习证据入口，不是 Kanban 任务管理器。
- Hub 借鉴 AI Engineering from Scratch 的 Curriculum、Roadmap、Glossary 与进度结构，但围绕一个主作品的证据链组织内容。
- `learning-hub.html` 是唯一的正式学习入口。

## Generation

运行 `npm run hub:build` 后，`scripts/build-learning-hub.mjs` 会读取：

- `MISSION.md`
- `docs/12-week-roadmap.md`
- `CONTEXT.md`
- `RESOURCES.md`
- `lessons/*.html`
- `learning-records/*.md`
- `evidence/*.md`

生成结果为根目录的 `learning-hub.html`。运行 `npm run hub:check` 校验 12 个 Week、Evidence 驱动的当前 Week、实际 Learning Record 数量、必要页面区域以及浏览器状态边界。
