---
name: platform-access
description: 复用已有登录环境，在后台核验招聘平台真实读取能力。
---

# platform-access

读取 docs/platforms.md。先查已有工具与账号入口，再在自有 hidden 页读取一个真实详情；不迁 Cookie、不启前台、不更改用户页。记录身份是否匹配、完整 JD 是否可见、平台限频/登录墙/验证码。使用 scripts/capture-page.mjs 时仅本机 CDP，失败不能自动前台兜底。独立记录列表/详情/聊天/附件能力，不能一个成功外推全部。原页面只读；联系按钮可能外发，不用于接入测试。
