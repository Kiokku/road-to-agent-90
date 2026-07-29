# Road to Agent 90

这是一个面向自用的 Agent 开发教学工作区。短期使命是按顺序完成 12 个 Week，用约 120 小时构建一个可演示、可解释、可部署的 **Web Creation Agent Workbench**，达到前端 AI / Agent 应用岗位的面试要求；长期再转向全栈 Agent 应用开发。

## 从这里开始

1. 阅读 [MISSION.md](./MISSION.md)，确认学习目标和边界。
2. 阅读 [12 个 Week 纵切路线](./docs/12-week-roadmap.md)，只处理最早一个没有 verified Evidence 的 Week。
3. 打开 [Agent Learning Hub](./learning-hub.html)，查看下一步和真实学习证据。
4. 使用 `teach` 开始下一课：

   > 请读取 MISSION.md、NOTES.md、docs/12-week-roadmap.md、docs/ai-engineering-from-scratch-week-map.md 和 learning-records。按照 Week 01–12 的顺序，只生成当前学习进度所需的下一个 Lesson，不要一次生成整个 Week 或后续 Lessons。以映射表为当前 Week 选定的 `fancyboi999/ai-engineering-from-scratch-zh` 课程为主要学习来源；映射表标明资料不足的部分，使用其中列出的一手资料补充。Lesson 必须先用自然、易懂的中文逐步讲清基础概念，再给出具体的 Practice 步骤，并为 projects/web-creation-agent-workbench 增加一个可测试、可演示、可解释的成果。不要按照日期安排学习进度。

5. 只有代码、测试、演示和闭卷解释通过后，才新增 Learning Record 或完成证据。

## 工作区结构

```text
.
├── MISSION.md                 学习使命与边界
├── CONTEXT.md                 统一语言
├── RESOURCES.md               可信知识与社区来源
├── NOTES.md                   教学偏好与节奏
├── lessons/                   teach 生成的单课 HTML（按需创建）
├── learning-records/          已验证的先验与学习记录
├── reference/                 可复用参考页（按需创建）
├── evidence/                  每个 Week 的完成证据（按需创建）
├── projects/
│   └── web-creation-agent-workbench/  主作品（按纵切创建）
└── learning-hub.html          只读学习入口
```

## Hub

Hub 由仓库事实生成，不在浏览器保存学习完成状态：

```bash
npm run hub:build
npm run hub:check
python3 -m http.server 4173
```

访问 `http://localhost:4173/learning-hub.html`；若端口已被占用，可换成 `python3 -m http.server 4174` 并访问对应端口。

公开页面：<https://kiokku.github.io/road-to-agent-90/>

## 核心学习原则

- 每个 Week 只完成一个纵切，不按课程节数验收。
- 每个 Week 可用约 4 小时完成可信资料、检索练习和小实验，再用约 6 小时完成集成、测试和演示。
- 每个 Week 结束进行 5 分钟闭卷讲解；Week 08 开始正式模拟面试。
- React/TypeScript 是已有能力，不重复学习通用前端基础。
- 短期不并行学习 Python、FastAPI、LangGraph、复杂 RAG 或多 Agent。
