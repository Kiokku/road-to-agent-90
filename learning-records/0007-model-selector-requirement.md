# 主作品需要受控模型选择器

主作品不再限定官方 OpenAI 模型，而是通过服务端管理的 Model Profile 接入官方 OpenAI 与 Responses-compatible 自定义模型。该要求保留模型选择能力，同时把密钥、Base URL 和能力验证留在服务端，避免浏览器接收敏感配置。
