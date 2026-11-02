---
name: greeting
description: 用完整简历和JD生成有事实约束的定制招呼语，不发送。
---

# greeting

读取 docs/workflow.md 第4节与 prompts/greeting-system-v6.txt。必须用完整原system prompt，不另造简略替代。核简历版本与完整JD，用户明确事实写入 private/lessons.json。scripts/greeting.mjs 默认离线；调用模型需配置本人服务。生成后逐句核公司/项目/年限/数字/工具来源；JD不可倒灌履历，未写不等于没有。段间两个换行；默认495–630中文字符软偏好，事实优先，平台硬限单独处理。保留 prompt/resume/JD 哈希、输出与版本；锁定文案不擅改；此 Skill 不外发。
