# Agent 开发学习路线

本上下文定义项目用于规划学习、验证能力和准备求职时采用的统一语言。

## Language

**短期达标**：
按顺序完成 12 个 Week 并部署主作品，能解释关键取舍、通过相关模拟面试并开始投递目标岗位。
_Avoid_: 学完全部课程、看完路线图

**主作品**：
短期阶段用于集中学习成果、能力证据和面试叙事的唯一核心作品，即 Web Creation Agent Workbench。
_Avoid_: 所有练习项目、多个并列主项目

**Web Creation Agent Workbench**：
消费经批准的 Étiquette 风格契约，从自然语言需求生成单页 React 网站，支持流式构建、预览、对话修改、diff、人工批准和自动部署的网页制作 Agent。
_Avoid_: 通用 Coding Agent、完整 Kimi 克隆、多 Agent 建站平台

**风格契约**：
由 Étiquette 提供并经过批准、供网页制作 Agent 读取的版本化设计规则，例如 `DESIGN.md` 或 Style Profile。
_Avoid_: 自动生成的随机主题、未经批准的 Style Study

**V1 Style Profile**：
仓库内置的唯一一个、经批准且带版本号的 Étiquette 风格契约，Agent 每次生成站点时都必须读取并遵守。
_Avoid_: 风格上传、多风格选择器、自动风格提取

**部署批准**：
用户在检查预览和变更后，授权 Agent 将当前生成站点公开发布的一次明确指令。
_Avoid_: 生成完成、预览成功、默认同意

**部署运行**：
部署批准后由 Agent 自动执行并记录构建、发布、结果 URL 和失败信息的一次工具运行。
_Avoid_: 用户手动执行部署命令、无批准自动发布

**发布目标**：
接收生成站点预构建静态资源的 Cloudflare Pages Direct Upload 项目。
_Avoid_: Git integration、Cloudflare Workers、多云发布层

**Model Profile**：
由服务端预先配置、供前端选择的 Responses-compatible 模型定义，包含显示名称、Base URL、Model ID、密钥环境变量和必要能力声明。
_Avoid_: 浏览器 API Key、任意 URL 输入、任意模型名称

**Responses-compatible 模型**：
通过能力检查、能够提供项目所需 Responses API streaming 与 function calling 语义的模型服务。
_Avoid_: 仅兼容 Chat Completions 的模型、未经验证的 OpenAI-compatible 标签

**Packy Terra Profile**：
V1 计划实际使用的 Model Profile，Base URL 为 `https://www.packyapi.com/v1`，Model ID 为 `gpt-5.6-terra`；通过真实能力检查前状态为待验证。
_Avoid_: 已验证官方等价、仅凭普通文本回复判定可用

**Agent Loop**：
应用通过 Responses API 向模型提供工具，接收并执行 function call，回填工具结果，直到模型产生最终回答或运行失败、取消、超过限制。
_Avoid_: 单次聊天请求、由 Agents SDK 隐藏的编排

**能力切片**：
用于证明一项具体 Agent 应用能力、但不承担独立作品范围的可演示功能或练习成果。
_Avoid_: 副主项目、必做独立项目

**纵切 Lesson**：
一次只建立一项知识与技能，并为主作品增加可运行、可验证成果的教学单元。
_Avoid_: 大章节、课程模块、教程 Demo

**作品证据链**：
由连续纵切 Lesson 累积形成、能够证明能力成长和主作品技术取舍的一组关联成果。
_Avoid_: 完课记录、零散练习集合

**完成证据**：
证明一个纵切已经通过测试、能够演示且学习者可以解释其机制与取舍的可核验成果。
_Avoid_: 阅读时长、课程节数、手动勾选

**学习事实来源**：
决定学习状态与进度的仓库文件和完成证据，包括 Mission、Lesson 与 Learning Record。
_Avoid_: localStorage、页面勾选状态、未关联证据的进度 JSON

**当前 Week**：
Week 01 至 Week 12 中最早一个没有 verified Evidence 的 Week；完成当前 Week 后才进入下一个。
_Avoid_: 按日期自动切换、跳过未验证 Week

**Agent Learning Hub**：
读取学习事实来源并呈现使命、路线、当前 Lesson、完成证据和复习状态的只读入口。
_Avoid_: 任务管理器、独立进度数据库

**教学工作区**：
仓库根目录中保存 Mission、Lesson、Learning Record、Reference、Hub 与其他学习事实的区域。
_Avoid_: 主作品源代码目录

**主作品工作区**：
`projects/web-creation-agent-workbench/` 中持续累积产品代码、测试与每个 Week 完成证据的实现区域。
_Avoid_: 独立教程仓库、零散 Demo 目录
