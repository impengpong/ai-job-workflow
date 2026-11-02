---
name: job-workflow
description: 协调多平台求职：接入、筛选、公司背调、定制介绍和已授权投递。
---

# job-workflow

读取根 AGENTS.md 和 docs/workflow.md。先核本人输入与平台范围，按 platform-access → job-screening → company-research → greeting → application 顺序推进。用户只找岗位时不执行发送。每步复用已有结果，仅补缺项。主 Agent 保留唯一任务清单与账本；并行采集按平台分工，独占浏览器/设备仅一位 owner。交付岗位页、来源与未知项；已授权投递继续到独立回读完成或真实外部等待，不将子 Agent 完成视为业务完成。
