# 使用 Cloudflare Pages Direct Upload 发布生成站点

Web Creation Agent Workbench 在用户批准后，通过 Wrangler 将预构建的静态资源上传到 Cloudflare Pages，并回填部署 URL 与运行记录；短期不支持 Git integration、Workers 或多云适配。Direct Upload 符合 Agent 自有构建流程，但 Cloudflare 当前不允许该项目原地切换为 Git integration，未来若改变发布模型需要新建 Pages 项目。
