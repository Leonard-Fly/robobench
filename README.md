# RoboBench · 具身智能机器人数据库

第三方中立的具身智能参数对比平台：人形机器人、轮式机器人、四足机器狗、灵巧手、核心零部件，以及 VLA 模型 / 具身世界模型的参数、价格、核心优势与应用场景横向对比（类似 GSMArena 之于手机）。

## 本地开发

```bash
npm install
npm run dev     # 开发服务器 http://localhost:5173
npm run build   # 产出静态站点到 dist/
npm run lint
```

## 每月更新数据库（无需改代码）

全站内容完全由两个 JSON 文件驱动：

| 文件 | 内容 |
|---|---|
| `src/data/robots.json` | 机器人与零部件条目（32 条） |
| `src/data/aiModels.json` | VLA 模型与世界模型条目（16 条） |

更新流程：

1. **新增/修改条目**：直接编辑 JSON。字段结构见 `src/types.ts`（`Robot` / `AiModel` 接口）。
   - `specs` 对象的键必须使用 `src/data/specFields.ts` 中对应分类注册过的 key；
   - 数值型参数写纯数字（不带单位），未公开写 `null`，不要编造；
   - 修改条目时同步更新它的 `dataUpdated`（格式 `"YYYY-MM"`）。页脚显示的"数据库版本"自动取全部条目中最新的 `dataUpdated`。
2. **新增参数维度**：在 `specFields.ts` 对应分类数组中追加一个字段定义（key、中文名、单位、分组、对比方向 `better`），再在 JSON 中补该键 —— 列表卡片、详情页、对比表、最优值高亮全部自动生效。
3. **新增分类**：在 `types.ts` 的 `RobotCategory` 加枚举值，在 `specFields.ts` 加字段注册表与中文名/图标映射即可。
4. 重新 `npm run build`，部署 `dist/`。

## 部署

纯静态站（HashRouter，无需服务端路由配置），`dist/` 可直接部署到 Vercel / Netlify / Cloudflare Pages / GitHub Pages / 任意静态托管或对象存储。

## 联系方式

厂商参数提交/更正：站内「厂商合作」页，联系邮箱配置在 `src/data/index.ts` 的 `CONTACT_EMAIL`。

## 数据免责

参数来自公开资料整理，仅供参考，具体以厂商官方发布为准。把握较低的数值在整理时已标记为 `null` 或"约"。
