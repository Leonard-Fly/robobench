import type { RobotCategory, SpecField } from '../types';

// ============ 规格字段注册表 ============
// 对比表、详情页、筛选器均由此驱动。
// 新增参数维度时：在对应分类数组中追加字段，再在 JSON 数据中补充该键即可，UI 自动生效。

/** 人形机器人（双足） */
export const HUMANOID_SPEC_FIELDS: SpecField[] = [
  { key: 'height_cm', label: '身高', unit: 'cm', group: '基础参数', better: 'none', keySpec: true },
  { key: 'weight_kg', label: '体重', unit: 'kg', group: '基础参数', better: 'lower', keySpec: true },
  { key: 'dof_total', label: '全身自由度', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'dof_hand', label: '单手自由度', group: '运动能力', better: 'higher' },
  { key: 'walk_speed_ms', label: '行走速度', unit: 'm/s', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'max_speed_ms', label: '最高移动速度', unit: 'm/s', group: '运动能力', better: 'higher' },
  { key: 'payload_kg', label: '负载能力', unit: 'kg', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'arm_payload_kg', label: '单臂负载', unit: 'kg', group: '运动能力', better: 'higher' },
  { key: 'joint_torque_nm', label: '最大关节扭矩', unit: 'N·m', group: '运动能力', better: 'higher' },
  { key: 'battery_wh', label: '电池容量', unit: 'Wh', group: '续航与供电', better: 'higher' },
  { key: 'runtime_h', label: '续航时间', unit: 'h', group: '续航与供电', better: 'higher', keySpec: true },
  { key: 'swappable_battery', label: '可换电', group: '续航与供电', better: 'none' },
  { key: 'compute_tops', label: '算力', unit: 'TOPS', group: '感知与计算', better: 'higher' },
  { key: 'compute_platform', label: '计算平台', group: '感知与计算', better: 'none' },
  { key: 'sensors', label: '传感器配置', group: '感知与计算', better: 'none' },
  { key: 'sdk', label: '二次开发支持', group: '生态与开发', better: 'none' },
];

/** 轮式机器人（轮式双足/轮式人形） */
export const WHEELED_SPEC_FIELDS: SpecField[] = [
  { key: 'height_cm', label: '身高', unit: 'cm', group: '基础参数', better: 'none', keySpec: true },
  { key: 'weight_kg', label: '整机重量', unit: 'kg', group: '基础参数', better: 'lower', keySpec: true },
  { key: 'dof_total', label: '全身自由度', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'dof_hand', label: '单手自由度', group: '运动能力', better: 'higher' },
  { key: 'max_speed_ms', label: '最高移动速度', unit: 'm/s', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'payload_kg', label: '负载能力', unit: 'kg', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'arm_reach_cm', label: '手臂臂展/作业半径', unit: 'cm', group: '运动能力', better: 'higher' },
  { key: 'lift_range_cm', label: '升降行程', unit: 'cm', group: '运动能力', better: 'higher' },
  { key: 'battery_wh', label: '电池容量', unit: 'Wh', group: '续航与供电', better: 'higher' },
  { key: 'runtime_h', label: '续航时间', unit: 'h', group: '续航与供电', better: 'higher', keySpec: true },
  { key: 'compute_tops', label: '算力', unit: 'TOPS', group: '感知与计算', better: 'higher' },
  { key: 'compute_platform', label: '计算平台', group: '感知与计算', better: 'none' },
  { key: 'sensors', label: '传感器配置', group: '感知与计算', better: 'none' },
  { key: 'sdk', label: '二次开发支持', group: '生态与开发', better: 'none' },
];

/** 四足机器狗 */
export const QUADRUPED_SPEC_FIELDS: SpecField[] = [
  { key: 'length_cm', label: '站立长度', unit: 'cm', group: '基础参数', better: 'none' },
  { key: 'weight_kg', label: '整机重量', unit: 'kg', group: '基础参数', better: 'lower', keySpec: true },
  { key: 'dof_total', label: '自由度', group: '运动能力', better: 'higher' },
  { key: 'max_speed_ms', label: '最高速度', unit: 'm/s', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'payload_kg', label: '持续负载', unit: 'kg', group: '运动能力', better: 'higher', keySpec: true },
  { key: 'max_payload_kg', label: '最大负载', unit: 'kg', group: '运动能力', better: 'higher' },
  { key: 'climb_deg', label: '最大爬坡角度', unit: '°', group: '运动能力', better: 'higher' },
  { key: 'stair_cm', label: '最大越障/台阶高度', unit: 'cm', group: '运动能力', better: 'higher' },
  { key: 'ip_rating', label: '防护等级', group: '环境适应', better: 'none' },
  { key: 'battery_wh', label: '电池容量', unit: 'Wh', group: '续航与供电', better: 'higher' },
  { key: 'runtime_h', label: '续航时间', unit: 'h', group: '续航与供电', better: 'higher', keySpec: true },
  { key: 'compute_tops', label: '算力', unit: 'TOPS', group: '感知与计算', better: 'higher' },
  { key: 'sensors', label: '传感器配置', group: '感知与计算', better: 'none' },
  { key: 'sdk', label: '二次开发支持', group: '生态与开发', better: 'none' },
];

/** 灵巧手 */
export const HAND_SPEC_FIELDS: SpecField[] = [
  { key: 'dof_total', label: '自由度 (DOF)', group: '核心参数', better: 'higher', keySpec: true },
  { key: 'doa', label: '主动自由度 (DOA)', group: '核心参数', better: 'higher', keySpec: true },
  { key: 'fingers', label: '手指数量', group: '核心参数', better: 'none', keySpec: true },
  { key: 'weight_g', label: '重量', unit: 'g', group: '核心参数', better: 'lower', keySpec: true },
  { key: 'payload_kg', label: '抓取负载', unit: 'kg', group: '性能', better: 'higher', keySpec: true },
  { key: 'fingertip_force_n', label: '指尖力', unit: 'N', group: '性能', better: 'higher' },
  { key: 'grip_force_n', label: '握力', unit: 'N', group: '性能', better: 'higher' },
  { key: 'speed_note', label: '开合/弯曲速度', group: '性能', better: 'none' },
  { key: 'drive_type', label: '驱动方式', group: '结构', better: 'none' },
  { key: 'tactile', label: '触觉传感', group: '感知', better: 'none', keySpec: true },
  { key: 'tactile_points', label: '触觉点数量', group: '感知', better: 'higher' },
  { key: 'interface', label: '通信接口', group: '集成', better: 'none' },
  { key: 'sdk', label: '二次开发支持', group: '集成', better: 'none' },
];

/** 核心零部件（通用字段，不同子类可留空不适用项） */
export const COMPONENT_SPEC_FIELDS: SpecField[] = [
  { key: 'component_type', label: '零部件类型', group: '基础信息', better: 'none', keySpec: true },
  { key: 'model_series', label: '型号/系列', group: '基础信息', better: 'none' },
  { key: 'weight_g', label: '重量', unit: 'g', group: '基础信息', better: 'lower', keySpec: true },
  { key: 'rated_torque_nm', label: '额定扭矩', unit: 'N·m', group: '性能参数', better: 'higher', keySpec: true },
  { key: 'peak_torque_nm', label: '峰值扭矩', unit: 'N·m', group: '性能参数', better: 'higher', keySpec: true },
  { key: 'rated_speed_rpm', label: '额定转速', unit: 'rpm', group: '性能参数', better: 'higher' },
  { key: 'torque_density', label: '扭矩密度', unit: 'N·m/kg', group: '性能参数', better: 'higher' },
  { key: 'gear_ratio', label: '减速比', group: '性能参数', better: 'none' },
  { key: 'precision', label: '精度/分辨率', group: '性能参数', better: 'none' },
  { key: 'range_note', label: '量程/测量范围', group: '性能参数', better: 'none' },
  { key: 'voltage_v', label: '工作电压', unit: 'V', group: '电气参数', better: 'none' },
  { key: 'interface', label: '通信接口', group: '集成', better: 'none' },
  { key: 'key_params', label: '其他关键参数', group: '性能参数', better: 'none' },
];

/** VLA 模型 */
export const VLA_SPEC_FIELDS: SpecField[] = [
  { key: 'params_b', label: '参数量', unit: 'B', group: '模型规格', better: 'none', keySpec: true },
  { key: 'architecture', label: '架构', group: '模型规格', better: 'none', keySpec: true },
  { key: 'backbone', label: '基座模型', group: '模型规格', better: 'none' },
  { key: 'action_head', label: '动作生成方式', group: '模型规格', better: 'none', keySpec: true },
  { key: 'control_freq_hz', label: '控制频率', unit: 'Hz', group: '性能', better: 'higher', keySpec: true },
  { key: 'training_data', label: '训练数据', group: '训练', better: 'none' },
  { key: 'embodiments', label: '支持本体', group: '适配性', better: 'none', keySpec: true },
  { key: 'cross_embodiment', label: '跨本体能力', group: '适配性', better: 'none' },
  { key: 'benchmark_note', label: '基准表现', group: '评测', better: 'none' },
  { key: 'deploy_note', label: '部署要求', group: '部署', better: 'none' },
];

/** 具身世界模型 */
export const WORLD_MODEL_SPEC_FIELDS: SpecField[] = [
  { key: 'params_b', label: '参数量', unit: 'B', group: '模型规格', better: 'none', keySpec: true },
  { key: 'architecture', label: '架构', group: '模型规格', better: 'none', keySpec: true },
  { key: 'modality', label: '生成模态', group: '模型规格', better: 'none', keySpec: true },
  { key: 'resolution', label: '生成分辨率', group: '性能', better: 'none' },
  { key: 'horizon', label: '预测时长/帧数', group: '性能', better: 'none' },
  { key: 'action_conditioned', label: '动作可控性', group: '能力', better: 'none', keySpec: true },
  { key: 'training_data', label: '训练数据', group: '训练', better: 'none' },
  { key: 'use_case', label: '典型用途', group: '应用', better: 'none', keySpec: true },
  { key: 'benchmark_note', label: '基准表现', group: '评测', better: 'none' },
];

/** 分类 → 字段注册表映射 */
export const SPEC_FIELDS_BY_CATEGORY: Record<RobotCategory, SpecField[]> = {
  humanoid: HUMANOID_SPEC_FIELDS,
  wheeled: WHEELED_SPEC_FIELDS,
  quadruped: QUADRUPED_SPEC_FIELDS,
  hand: HAND_SPEC_FIELDS,
  component: COMPONENT_SPEC_FIELDS,
};

/** 分类中文名 */
export const CATEGORY_LABELS: Record<RobotCategory, string> = {
  humanoid: '人形机器人',
  wheeled: '轮式机器人',
  quadruped: '四足机器狗',
  hand: '灵巧手',
  component: '核心零部件',
};

/** 分类图标（emoji，后续可替换为 SVG） */
export const CATEGORY_ICONS: Record<RobotCategory, string> = {
  humanoid: '🤖',
  wheeled: '🛞',
  quadruped: '🐕',
  hand: '🖐️',
  component: '⚙️',
};

/** 零部件子分类中文名 */
export const COMPONENT_SUBCATEGORY_LABELS: Record<string, string> = {
  actuator: '关节模组',
  motor: '电机',
  reducer: '减速器',
  screw: '行星滚柱丝杠',
  'sensor-force': '力/力矩传感器',
  'sensor-tactile': '触觉传感器',
  lidar: '激光雷达',
  camera: '深度相机',
  imu: 'IMU',
  battery: '电池',
  controller: '控制器',
};

/** 产品状态中文名 */
export const STATUS_LABELS: Record<string, string> = {
  available: '量产发售',
  preorder: '可预订',
  limited: '定向交付',
  research: '研究原型',
  announced: '已发布',
  discontinued: '已停产',
};
