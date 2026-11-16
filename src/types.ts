// ============ 核心数据类型定义 ============
// 本文件是全站数据契约：src/data/*.json 必须符合这些类型。
// 每月更新数据时，只需修改 JSON 文件，无需改动代码。

/** 机器人/零部件分类 */
export type RobotCategory =
  | 'humanoid' // 人形机器人（双足）
  | 'wheeled' // 轮式机器人（轮式双足/轮式人形）
  | 'quadruped' // 四足机器狗
  | 'hand' // 灵巧手
  | 'component'; // 核心零部件

/** 零部件子分类 */
export type ComponentSubcategory =
  | 'actuator' // 关节模组/一体化执行器
  | 'motor' // 电机
  | 'reducer' // 减速器
  | 'screw' // 行星滚柱丝杠
  | 'sensor-force' // 力/力矩传感器
  | 'sensor-tactile' // 触觉传感器
  | 'lidar' // 激光雷达
  | 'camera' // 深度/视觉相机
  | 'imu' // IMU
  | 'battery' // 电池
  | 'controller'; // 控制器/计算单元

/** 产品状态 */
export type ProductStatus =
  | 'available' // 量产发售
  | 'preorder' // 可预订
  | 'limited' // 限量/定向交付
  | 'research' // 研究原型
  | 'announced' // 已发布未交付
  | 'discontinued'; // 已停产

/** 价格信息（金额单位：元/美元，null 表示未公开） */
export interface PriceInfo {
  cny: number | null;
  usd: number | null;
  note?: string; // 如 "教育版起售价" / "需询价"
}

/** 规格值：数字（用于排序/对比高亮）、字符串（描述型）、null（未公开） */
export type SpecValue = number | string | null;

/** 购买渠道类型 */
export type PurchaseChannelType =
  | 'official' // 官方商城/官网直售
  | 'marketplace' // 电商平台旗舰店（京东/天猫/Amazon 等）
  | 'distributor' // 授权经销商/代理商
  | 'inquiry'; // 商务询价/联系销售

/** 销售区域（UI 按语言环境翻译显示） */
export type PurchaseRegion = 'cn' | 'global' | 'us' | 'eu' | 'jp' | 'kr';

/** 购买渠道条目。name 用渠道原名（店铺名不翻译），不要放自由文本描述 */
export interface PurchaseChannel {
  type: PurchaseChannelType;
  name: string; // 如 "Unitree 官方商城"、"宇树京东自营旗舰店"、"Unitree Online Store"
  url: string;
  regions: PurchaseRegion[];
}

/** 机器人 / 零部件条目 */
export interface Robot {
  id: string; // 唯一 slug，如 "unitree-g1"
  name: string; // 英文/官方型号名，如 "Unitree G1"
  nameZh: string; // 中文名，如 "宇树 G1"
  manufacturer: string; // 厂商英文名
  manufacturerZh: string; // 厂商中文名
  country: string; // 国家/地区，如 "中国"
  category: RobotCategory;
  subcategory?: ComponentSubcategory; // 仅 category === 'component' 时使用
  releaseYear: number | null;
  status: ProductStatus;
  price: PriceInfo;
  /** 规格参数，键必须来自 specFields.ts 中对应分类的字段注册表 */
  specs: Record<string, SpecValue>;
  /** 购买渠道（可空；无公开渠道时 UI 引导通过官网联系厂商） */
  purchaseChannels?: PurchaseChannel[];
  highlights: string[]; // 核心优势，3-5 条
  applications: string[]; // 主要应用场景
  description: string; // 一段简介（中文，80-150字）
  imageUrl?: string; // 预留图片地址
  officialUrl?: string; // 官网链接
  dataUpdated: string; // 数据更新日期 "YYYY-MM"
}

/** AI 模型类型 */
export type AiModelKind = 'vla' | 'world-model';

/** VLA 模型 / 具身世界模型条目 */
export interface AiModel {
  id: string; // 唯一 slug，如 "pi0"
  name: string; // 模型名，如 "π0 (pi-zero)"
  kind: AiModelKind;
  org: string; // 机构英文名
  orgZh: string; // 机构中文名
  country: string;
  releaseDate: string; // "YYYY-MM"
  openSource: boolean | null; // null = 部分开源/未明确
  license: string | null; // 如 "Apache-2.0"、"仅研究"
  /** 规格参数，键必须来自 specFields.ts 中 AI_MODEL_SPEC_FIELDS / WORLD_MODEL_SPEC_FIELDS */
  specs: Record<string, SpecValue>;
  highlights: string[];
  applications: string[]; // 适配机器人/应用场景
  description: string;
  paperUrl?: string;
  codeUrl?: string;
  dataUpdated: string;
}

/** 规格字段定义（用于渲染对比表与筛选） */
export interface SpecField {
  key: string; // specs 对象中的键
  label: string; // 中文标签
  unit?: string; // 单位，如 "kg"、"m/s"
  group: string; // 分组标题，如 "基础参数"
  /** 数值型字段的对比方向：higher = 越大越好，lower = 越小越好，none = 不比较 */
  better: 'higher' | 'lower' | 'none';
  /** 是否在卡片上展示为关键参数 */
  keySpec?: boolean;
}

/** 开源具身数据集条目 */
export interface EmbodiedDataset {
  id: string;
  name: string;
  nameZh?: string;
  org: string;
  orgZh: string;
  country: string;
  releaseDate: string; // "YYYY-MM"
  openSource: boolean | null;
  license: string | null;
  specs: Record<string, SpecValue>;
  highlights: string[];
  applications: string[];
  description: string;
  paperUrl?: string;
  datasetUrl?: string;
  dataUpdated: string;
}

/** 数采设备路线分类 */
export type CollectionDeviceKind = 'umi' | 'egocentric' | 'teleop';

/** 具身数据采集设备条目 */
export interface CollectionDevice {
  id: string;
  name: string;
  nameZh?: string;
  org: string;
  orgZh: string;
  country: string;
  deviceKind: CollectionDeviceKind;
  releaseDate: string; // "YYYY-MM"
  openSource: boolean | null;
  license: string | null;
  specs: Record<string, SpecValue>;
  highlights: string[];
  applications: string[];
  description: string;
  paperUrl?: string;
  codeUrl?: string;
  dataUpdated: string;
}

/** 新闻分类：商业落地 / 技术发布 / 投融资与并购 / 行业政策 */
export type NewsCategory = 'commercial' | 'technical' | 'funding' | 'policy';

/** 机器人厂商新闻条目（预计每日更新） */
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  company: string;
  companyZh?: string;
  country: string;
  category: NewsCategory;
  publishedAt: string; // "YYYY-MM-DD"
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  relatedRobotIds?: string[];
  dataUpdated: string; // "YYYY-MM"
}

/** 落地案例行业分类 */
export type DeploymentSector = 'automotive' | 'logistics' | 'retail' | 'inspection';

/** 落地成熟度阶段 */
export type DeploymentStage = 'commercial' | 'pilot' | 'poc';

/** 机器人 PoC 与商业落地案例条目 */
export interface DeploymentCase {
  id: string;
  title: string;
  summary: string;
  client: string;
  clientZh?: string;
  robotName: string;
  relatedRobotId?: string;
  country: string;
  sector: DeploymentSector;
  stage: DeploymentStage;
  date: string; // "YYYY-MM"
  metrics: string[];
  sourceName: string;
  sourceUrl: string;
  dataUpdated: string;
}
