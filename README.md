# 环肽 AI 设计路线图谱

核验日期：2026-11-03；本轮补入五份用户全文附件及项目收录评估。

## 打开与内容

用浏览器打开 [index.html](index.html)。主交互无网络依赖；外部引用需要联网。

- 5 条路线、19 个项目/工具；支持选取高亮、两项目比较、SVG 导出及打印。
- 27 条资料：10 篇综述类、17 条研究/报告/评测资料；16 份全文已保存并重点阅读（7 份综述、9 份研究）。
- [全文核验专题](literature/update-review.html)：CP-GFM 报告内部不一致、FlexRibbon 任务边界、CycleDesigner 版本差异及项目收录判断。
- [独立阅读笔记](literature/notes/index.html)、[剩余四项全文需求](literature/fulltext-needed.html)、[CSV](literature/bibliography.csv)、[BibTeX](literature/bibliography.bib)。
- 推荐核心阅读190分钟，加本次专题及一个案例约220–225分钟；不是所有全文逐字阅读时长。

## 本次更新

新增 CP-GFM、Vilya-2、Riptides、AlphaProteo、Chai-2；补齐 Latent-X 第一代来源，更新 FlexRibbon、CycleDesigner 与 Bicycle 的证据描述。

FlexRibbon、AlphaProteo、Chai-2 使用相邻任务/模态的淡色短虚线；Vilya-2 / Riptides 只标结构评估。CP-GFM 的计算轨道与 KRAS SAR 案例分别解释，不以其自定义比较矩阵宣布平台优劣，也暂不加绿色实验确认点。

收到的 CycleDesigner 是2024-12-02预印本（P12），2025 JCIM版（P08）与SI仍待补；R04、R09、P05不再列为缺全文。CP-GFM后续需求是原始实验数据和作者澄清，不是重复索取正文。

## 本地原文与发布

新增五份PDF及抽取文本保存在 `literature/fulltext/`，精确文件路径已加入 `.gitignore`；原文件校验值见 `evidence/attachment-manifest.json`。这些条目带 `localOnly: true`，仅 `file:` 浏览时显示本地全文链接，HTTP/HTTPS页面显示来源和笔记。

历史原文已经受 Git 跟踪，本轮没有删除或改变其跟踪状态。新忽略规则不影响历史已跟踪文件，也不代表已有原文适合公开再分发。公开发布前仍需按原文条款处理历史 `literature/fulltext/` 内容。全文保留原版权，本页未转载论文图。

本轮只更新本地工作树，没有提交、推送或部署，没有实际运行科学模型、复现实验、采购或联系作者。

## 维护与证据

`data.js` 为主数据；`app.js` 控制交互；`styles.css` 为显示与打印样式。更新条目时同步独立笔记、全文清单、书目及 `evidence/research-snapshot.json`。`evidence/verification.json` 记录本轮检查；旧下载日志和原始文件清单保持历史快照，新附件独立记录。

绿色标记只代表本版已读资料中的对应实验终点，不代表独立复现。图示是编辑性映射；相邻任务、公司自述、计算证据与实验终点不可互换。价格、交付、权属及依赖许可未做交易级尽调。
