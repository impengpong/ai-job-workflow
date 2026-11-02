# AI 求职工作流

把找岗位、公司背调、定制招呼语和投递核验交给自己的 AI Agent。

这是从实际多平台求职流程整理的 **Skills、方法文档和小工具**，不是安装后即可全平台自动海投的标准化产品。网站可能变化，登录由本人完成，Agent 需要按当前页面适配。仓库没有作者简历、个人记录或登录凭据。

## 三步开始

1. 安装 Python 3.10+、Node.js 22+，克隆仓库；把本地简历和偏好放入 `private/`（已忽略）。
2. 让自己的 Agent 读 `AGENTS.md` 和 `skills/job-workflow/SKILL.md`，告诉它目标方向、城市、薪资、经验及可用浏览器工具。
3. 先取得岗位清单并选择，再授权投递。找岗授权不自动变成发消息授权；已经授权的范围无需逐条重复确认。

可以直接对 Agent 说：

> 阅读这个仓库的 AGENTS.md 和 skills/job-workflow/SKILL.md。先根据我放在 private/ 的简历和偏好找岗位、核对公司并生成可筛选的岗位页，保留来源及未知项。投递只处理我选中的岗位，复用已有登录态，完成后回读回执，不重复发送。

## 本地先试，不访问招聘平台

```sh
python3 scripts/review.py examples/jobs.json --out output/review.html
python3 scripts/check_package.py
```

打开 `output/review.html` 即可筛选虚构示例岗位、标记投/不投、导出选择。这里的“投”仅是本地选择，不会发消息。

## 包含什么

| 模块 | 本仓库交付 | 能力边界 |
|---|---|---|
| 多平台接入 | 后台 CDP 读取器、五平台选择器、接入方法 | 只读样本；不是全平台采集 SDK，登录和页面需现场核验 |
| 岗位筛选 | JSON 格式、交互 HTML 生成器、筛选 Skill | 已知冲突排除，未知待核；不把首屏当全站 |
| 公司背调 | 三段研究模板、来源等级与复用方法 | 每家公司实际查证，不能由模型补事实 |
| 招呼语 | 完整 V6 prompt、DeepSeek 调用器、事实边界模板 | 默认只构造请求；显式调用才发送简历给模型服务 |
| 自动投递 | 五平台执行 Skill、去重与送达核验协议、账本校验器 | 由具备浏览器/设备工具的 Agent 执行；未提供一键跨平台发送器 |

详细兼容与历史边界见 [平台说明](docs/platforms.md)。

## 招呼语

将自己的完整已确认简历保存为 `private/resume.txt`，JD 格式参考 `examples/job.json`：

```sh
node scripts/greeting.mjs --resume private/resume.txt --job examples/job.json --out private/greeting
# 检查 private/greeting/request.json；确认使用模型服务后再显式执行：
# DEEPSEEK_API_KEY 通过环境注入；可设置 DEEPSEEK_MODEL、DEEPSEEK_BASE_URL
node scripts/greeting.mjs --resume private/resume.txt --job examples/job.json --out private/greeting --execute
```

默认不联网，不内置密钥；模型调用可能收费。完整原始 prompt 保留，通用运行约束追加在后。个人纠错边界请用 `--lessons private/lessons.json`，不要将真实简历或请求日志提交 Git。

## 真实页面读取

仅连接你自己管理、已登录且启用 CDP 的浏览器；调试端口只绑定本机，不向公网开放：

```sh
node scripts/capture-page.mjs --endpoint http://127.0.0.1:9222 --platform boss --url '你的真实岗位HTTPS地址' --out private/evidence
```

工具只新建自己拥有的隐藏页；浏览器不支持隐藏页则失败，不回退到抢焦点。不会启动/关闭浏览器，不导出 Cookie，不点击联系或投递。读出的 JD、账户相关内容与截图只保存在忽略目录中。请先查看平台说明，不将 HTTP 200 当登录成功。

## 文档

- [完整流程](docs/workflow.md)
- [平台与边界](docs/platforms.md)
- [投递及回执](docs/applications.md)
- [数据结构](docs/data.md)
- [来源、许可与脱敏](PROVENANCE.md)

软件和文档免费复用；招聘平台、模型服务及第三方工具的条款和费用独立适用。
