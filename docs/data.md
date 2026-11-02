# 最小数据结构

`examples/` 全为虚构示例，不能用于真实投递。

- `jobs.json`：`jobs` 数组；每岗稳定 `key`、`platform`、`company`、`title`、`url`、`location`、`salary`、`description`、`match_reason`、`unknowns`、`checked_at`。
- `companies.json`：`companies` 字典，以确认主体为 key；每家公司 `what`、`why`、`progress`、`unknowns`、`sources`、`checked_at`。来源含 URL/title/checked_at，数字附口径。
- `lessons.json`：`version` 与 `lessons`；每条 `id`、`observed_error`、`rule`。只写使用者已确认事实；模型推测不是事实。
- `applications.json`：`jobs` 数组，每岗 `key`、`platform`、`job_url`、`application`、`message`、`attachment`。各状态结构见投递文档。

岗位页 localStorage 只作本地选择缓存；用导出 JSON 交给 Agent。换浏览器或域名不会自动同步。稳定 key 保护原选择，未知字段明确空值，不造示例回执。示例页面的外链使用 example.com 并标为虚构。
