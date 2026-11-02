---
name: job-screening
description: 按用户偏好宽搜、核验JD、去重并交付可选择的岗位页。
---

# job-screening

读取 docs/workflow.md 第2节与 docs/data.md。提取已确认硬条件，搜索标题及职责变体；完整 JD 核匹配依据。列表与分页记录实际覆盖，没有读到不能当没有岗位。已知冲突排除、未知待核，不编薪资和活跃时间。平台 ID 稳定；跨平台同岗需证据才合并。生成 jobs.json 后用 scripts/review.py；保留 key 和反馈。卡片展示原始链接、推荐依据与未知项。用户 apply 只是选择，只有已授外发权限才进入投递。
