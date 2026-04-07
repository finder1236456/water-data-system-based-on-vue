CREATE DATABASE IF NOT EXISTS water_data_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE water_data_system;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS repair_logs;
DROP TABLE IF EXISTS repair_images;
DROP TABLE IF EXISTS role_menus;
DROP TABLE IF EXISTS ai_prompt_examples;
DROP TABLE IF EXISTS ai_examples;
DROP TABLE IF EXISTS repair_reports;
DROP TABLE IF EXISTS repair_channels;
DROP TABLE IF EXISTS dashboard_alarms;
DROP TABLE IF EXISTS saving_suggestions;
DROP TABLE IF EXISTS quota_records;
DROP TABLE IF EXISTS monthly_comparison;
DROP TABLE IF EXISTS monthly_usage_trend;
DROP TABLE IF EXISTS annual_usage_stats;
DROP TABLE IF EXISTS usage_share_stats;
DROP TABLE IF EXISTS dashboard_water_stats;
DROP TABLE IF EXISTS usage_records;
DROP TABLE IF EXISTS meters;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS system_config;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) DEFAULT NULL
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE menus (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT DEFAULT NULL,
  name VARCHAR(50) NOT NULL,
  path VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_menus_parent FOREIGN KEY (parent_id) REFERENCES menus (id)
);

CREATE TABLE role_menus (
  role_id INT NOT NULL,
  menu_id INT NOT NULL,
  PRIMARY KEY (role_id, menu_id),
  CONSTRAINT fk_role_menus_role FOREIGN KEY (role_id) REFERENCES roles (id),
  CONSTRAINT fk_role_menus_menu FOREIGN KEY (menu_id) REFERENCES menus (id)
);

CREATE TABLE regions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  region_type VARCHAR(30) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  CONSTRAINT fk_regions_parent FOREIGN KEY (parent_id) REFERENCES regions (id)
);

CREATE TABLE system_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  water_price DECIMAL(10, 2) NOT NULL,
  base_quota INT NOT NULL,
  warning_threshold INT NOT NULL,
  push_strategy VARCHAR(255) NOT NULL,
  monthly_baseline DECIMAL(10, 2) NOT NULL,
  last_month_usage DECIMAL(10, 2) NOT NULL,
  last_month_saving DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_code VARCHAR(50) NOT NULL UNIQUE,
  device_type VARCHAR(30) NOT NULL,
  manufacturer VARCHAR(100) DEFAULT NULL,
  location VARCHAR(100) NOT NULL,
  install_time DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL,
  region_id INT NOT NULL,
  CONSTRAINT fk_devices_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE meters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  region_id INT NOT NULL,
  current_flow DECIMAL(10, 2) NOT NULL,
  total_usage DECIMAL(12, 2) NOT NULL,
  water_quality DECIMAL(5, 2) NOT NULL,
  last_update_time DATETIME NOT NULL,
  CONSTRAINT fk_meters_device FOREIGN KEY (device_id) REFERENCES devices (id),
  CONSTRAINT fk_meters_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE usage_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  meter_id INT NOT NULL,
  region_id INT NOT NULL,
  usage_amount DECIMAL(10, 2) NOT NULL,
  record_time DATETIME NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  CONSTRAINT fk_usage_records_meter FOREIGN KEY (meter_id) REFERENCES meters (id),
  CONSTRAINT fk_usage_records_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE dashboard_water_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  stat_label VARCHAR(50) NOT NULL,
  stat_value VARCHAR(30) NOT NULL,
  stat_unit VARCHAR(30) NOT NULL,
  percent_value INT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE usage_share_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL,
  percent_value DECIMAL(5, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  color VARCHAR(20) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE annual_usage_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  year_label VARCHAR(20) NOT NULL,
  usage_amount DECIMAL(10, 2) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE monthly_usage_trend (
  id INT PRIMARY KEY AUTO_INCREMENT,
  month_no INT NOT NULL,
  month_label VARCHAR(20) NOT NULL,
  usage_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE monthly_comparison (
  id INT PRIMARY KEY AUTO_INCREMENT,
  month_no INT NOT NULL,
  month_label VARCHAR(20) NOT NULL,
  last_year_value DECIMAL(10, 2) NOT NULL,
  current_value DECIMAL(10, 2) NOT NULL
);

CREATE TABLE quota_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  owner_user_id INT DEFAULT NULL,
  current_usage DECIMAL(10, 2) NOT NULL,
  quota_amount DECIMAL(10, 2) NOT NULL,
  status_label VARCHAR(50) NOT NULL,
  period_type VARCHAR(20) NOT NULL DEFAULT 'month',
  warning_threshold DECIMAL(5, 2) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_quota_records_region FOREIGN KEY (region_id) REFERENCES regions (id),
  CONSTRAINT fk_quota_records_user FOREIGN KEY (owner_user_id) REFERENCES users (id)
);

CREATE TABLE saving_suggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT DEFAULT NULL,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(255) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_saving_suggestions_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE dashboard_alarms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alarm_type VARCHAR(50) NOT NULL,
  region_id INT NOT NULL,
  alarm_time DATETIME NOT NULL,
  content VARCHAR(255) NOT NULL,
  reporter_name VARCHAR(50) NOT NULL,
  status_label VARCHAR(50) NOT NULL,
  repairer_name VARCHAR(50) DEFAULT NULL,
  CONSTRAINT fk_dashboard_alarms_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE repair_channels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE repair_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  repair_code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  region_id INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  channel VARCHAR(30) NOT NULL,
  status_label VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  reporter_user_id INT DEFAULT NULL,
  maintainer_user_id INT DEFAULT NULL,
  report_time DATETIME NOT NULL,
  complete_time DATETIME DEFAULT NULL,
  CONSTRAINT fk_repair_reports_region FOREIGN KEY (region_id) REFERENCES regions (id),
  CONSTRAINT fk_repair_reports_reporter FOREIGN KEY (reporter_user_id) REFERENCES users (id),
  CONSTRAINT fk_repair_reports_maintainer FOREIGN KEY (maintainer_user_id) REFERENCES users (id)
);

CREATE TABLE repair_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  repair_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_type VARCHAR(20) NOT NULL DEFAULT 'report',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_repair_images_report FOREIGN KEY (repair_id) REFERENCES repair_reports (id)
);

CREATE TABLE repair_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  repair_id INT NOT NULL,
  operator_user_id INT DEFAULT NULL,
  action_type VARCHAR(30) NOT NULL,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_repair_logs_report FOREIGN KEY (repair_id) REFERENCES repair_reports (id),
  CONSTRAINT fk_repair_logs_user FOREIGN KEY (operator_user_id) REFERENCES users (id)
);

CREATE TABLE ai_examples (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE ai_prompt_examples (
  id INT PRIMARY KEY AUTO_INCREMENT,
  prompt_text VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO roles (code, name, description) VALUES
('user', '普通用户', '小区住户和物业值班人员'),
('admin', '系统管理员', '负责账号管理、系统参数和数据维护'),
('repair', '维修人员', '负责工单处理、现场巡检和设备维修');

INSERT INTO users (role_id, username, password, name, email, phone, status) VALUES
(1, 'user001', '123456', '张晓梅', 'user001@example.com', '13800000001', 1),
(2, 'admin001', '123456', '王建国', 'admin001@example.com', '13800000002', 1),
(3, 'repair001', '123456', '李师傅', 'repair001@example.com', '13800000003', 1),
(1, 'user002', '123456', '刘志强', 'user002@example.com', '13800000004', 1),
(1, 'user003', '123456', '周丽萍', 'user003@example.com', '13800000005', 1),
(3, 'repair002', '123456', '陈师傅', 'repair002@example.com', '13800000006', 1);

INSERT INTO menus (parent_id, name, path, icon, sort_order) VALUES
(NULL, '大屏总览', '/screen/user', 'Monitor', 1),
(NULL, '定额管理', '/screen/user?module=quota', 'DataAnalysis', 2),
(NULL, '故障报修', '/screen/user?module=repair', 'Tools', 3),
(NULL, 'AI智能咨询', '/screen/user?module=ai', 'ChatDotRound', 4),
(NULL, '后台管理', '/admin', 'Setting', 5);

INSERT INTO role_menus (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(3, 1), (3, 3), (3, 4);

INSERT INTO regions (id, parent_id, name, level, region_type, description) VALUES
(1, NULL, '幸福水岸小区', 1, 'community', '水务管理示范小区'),
(2, 1, '1栋', 2, 'building', '高层住宅楼'),
(3, 1, '2栋', 2, 'building', '高层住宅楼'),
(4, 1, '3栋', 2, 'building', '高层住宅楼'),
(5, 1, '5栋', 2, 'building', '高层住宅楼'),
(6, 1, '6栋', 2, 'building', '高层住宅楼'),
(7, 2, '1栋1单元', 3, 'unit', '重点监测单元'),
(8, 2, '1栋2单元', 3, 'unit', '高峰波动单元'),
(9, 3, '2栋1单元', 3, 'unit', '用水平稳单元'),
(10, 3, '2栋2单元', 3, 'unit', '住户密集单元'),
(11, 4, '3栋1单元', 3, 'unit', '夜间用水偏高单元'),
(12, 4, '3栋2单元', 3, 'unit', '设备巡检单元'),
(13, 5, '5栋1单元', 3, 'unit', '压力异常监测单元'),
(14, 6, '6栋2单元', 3, 'unit', '节水示范单元');

INSERT INTO system_config (
  water_price,
  base_quota,
  warning_threshold,
  push_strategy,
  monthly_baseline,
  last_month_usage,
  last_month_saving
) VALUES
(3.58, 1200, 85, '每日 09:00 自动推送小区节水建议', 4000, 3900, 100);

INSERT INTO devices (device_code, device_type, manufacturer, location, install_time, status, region_id) VALUES
('WM-101', 'water_meter', '海川仪表', '1栋1单元地下水表井', '2025-01-12 09:00:00', 'online', 7),
('WM-102', 'water_meter', '海川仪表', '1栋2单元地下水表井', '2025-01-12 09:30:00', 'online', 8),
('WM-201', 'water_meter', '海川仪表', '2栋1单元地下水表井', '2025-01-13 09:00:00', 'online', 9),
('WM-202', 'water_meter', '海川仪表', '2栋2单元地下水表井', '2025-01-13 09:30:00', 'online', 10),
('WM-301', 'water_meter', '海川仪表', '3栋1单元地下水表井', '2025-01-14 09:00:00', 'fault', 11),
('WM-302', 'water_meter', '海川仪表', '3栋2单元地下水表井', '2025-01-14 09:30:00', 'online', 12),
('PM-501', 'pressure_meter', '天衡设备', '5栋1单元泵房入口', '2025-01-15 09:00:00', 'online', 13),
('WM-602', 'water_meter', '海川仪表', '6栋2单元地下水表井', '2025-01-15 09:30:00', 'online', 14);

INSERT INTO meters (device_id, region_id, current_flow, total_usage, water_quality, last_update_time) VALUES
(1, 7, 13.20, 1120.00, 98.60, '2026-04-05 10:00:00'),
(2, 8, 11.80, 1045.00, 98.40, '2026-04-05 10:00:00'),
(3, 9, 9.60, 760.00, 99.10, '2026-04-05 10:00:00'),
(4, 10, 10.10, 845.00, 98.90, '2026-04-05 10:00:00'),
(5, 11, 14.60, 980.00, 98.30, '2026-04-05 10:00:00'),
(6, 12, 8.40, 910.00, 99.00, '2026-04-05 10:00:00'),
(7, 13, 12.10, 1085.00, 98.50, '2026-04-05 10:00:00'),
(8, 14, 7.80, 690.00, 99.20, '2026-04-05 10:00:00');

INSERT INTO usage_records (meter_id, region_id, usage_amount, record_time, category_name) VALUES
(1, 7, 92.50, '2026-02-01 08:00:00', '居民生活用水'),
(2, 8, 84.30, '2026-02-01 08:00:00', '居民生活用水'),
(3, 9, 61.80, '2026-02-01 08:00:00', '住户厨房用水'),
(4, 10, 67.40, '2026-03-01 08:00:00', '住户厨房用水'),
(5, 11, 95.60, '2026-03-01 08:00:00', '公共保洁用水'),
(6, 12, 72.10, '2026-03-01 08:00:00', '居民生活用水'),
(7, 13, 88.90, '2026-04-01 08:00:00', '其他公共用水'),
(8, 14, 58.20, '2026-04-01 08:00:00', '居民生活用水');

INSERT INTO dashboard_water_stats (stat_label, stat_value, stat_unit, percent_value, sort_order) VALUES
('今日水量', '130', 'm³', 13, 1),
('本月水量', '39', '百万 m³', 3, 2),
('本年水量', '46.8', '千 m³', 46, 3),
('上月水量', '40', '百万 m³', 4, 4);

INSERT INTO usage_share_stats (category_name, percent_value, total_amount, color, sort_order) VALUES
('居民生活用水', 74.67, 1500, '#6488ff', 1),
('住户厨房用水', 68.20, 1000, '#88d56d', 2),
('公共保洁用水', 53.60, 900, '#ffca4b', 3),
('其他公共用水', 60.83, 600, '#ff6868', 4);

INSERT INTO annual_usage_stats (year_label, usage_amount, sort_order) VALUES
('2020年', 192, 1),
('2021年', 196, 2),
('2022年', 208, 3);

INSERT INTO monthly_usage_trend (month_no, month_label, usage_amount) VALUES
(1, '1月', 28),
(2, '2月', 22),
(3, '3月', 31),
(4, '4月', 44),
(5, '5月', 52),
(6, '6月', 29),
(7, '7月', 46),
(8, '8月', 33),
(9, '9月', 54),
(10, '10月', 71),
(11, '11月', 61),
(12, '12月', 58);

INSERT INTO monthly_comparison (month_no, month_label, last_year_value, current_value) VALUES
(2, '2月', 38, 22),
(3, '3月', 46, 32),
(4, '4月', 58, 44),
(5, '5月', 74, 52),
(6, '6月', 50, 26),
(7, '7月', 68, 46),
(8, '8月', 70, 33),
(9, '9月', 52, 55),
(10, '10月', 79, 68);

INSERT INTO quota_records (
  region_id,
  owner_user_id,
  current_usage,
  quota_amount,
  status_label,
  period_type,
  warning_threshold,
  sort_order
) VALUES
(7, 1, 1280, 1200, '超额 6.7%', 'month', 85, 1),
(8, 1, 1045, 1100, '正常', 'month', 85, 2),
(9, 4, 760, 800, '正常', 'month', 85, 3),
(10, 4, 845, 860, '接近阈值', 'month', 85, 4),
(11, 5, 980, 950, '预警', 'month', 85, 5),
(12, 5, 910, 930, '正常', 'month', 85, 6),
(13, 1, 1085, 1000, '超额 8.5%', 'month', 85, 7),
(14, 4, 690, 820, '节水优秀', 'month', 85, 8);

INSERT INTO saving_suggestions (region_id, title, content, priority, sort_order) VALUES
(7, '夜间基流排查', '建议优先排查 1栋1单元夜间基流偏高问题。', 'high', 1),
(11, '错峰供水策略', '3栋1单元可启用分时段供水策略，降低峰值波动。', 'medium', 2),
(13, '阀件更新建议', '5栋1单元建议更换高耗水阀件，并推送节水提醒。', 'high', 3),
(14, '节水经验推广', '6栋2单元可作为节水示范单元，建议在全小区推广节水经验。', 'low', 4),
(10, '住户用水提醒', '2栋2单元建议在晚高峰时段推送住户节水提示。', 'medium', 5);

INSERT INTO dashboard_alarms (alarm_type, region_id, alarm_time, content, reporter_name, status_label, repairer_name) VALUES
('设备故障', 7, '2026-04-01 08:25:00', '采集设备短时离线', '系统', '待处理', '王工'),
('流量超标', 9, '2026-04-01 10:12:00', '瞬时流量超过阈值', '系统', '待处理', '赵工'),
('设备故障', 11, '2026-04-02 09:16:00', '水表通信异常', '系统', '待处理', '李工'),
('压力异常', 13, '2026-04-02 13:05:00', '泵房入口压力波动异常', '管理员', '处理中', '陈工'),
('漏损预警', 8, '2026-04-03 21:15:00', '夜间基流连续偏高', '系统', '待复核', '李工');

INSERT INTO repair_channels (role_name, description, sort_order) VALUES
('业主 Web 端', '在线填写故障描述、上传现场图片，并自动关联楼栋与单元。', 1),
('维修 UniApp 端', '支持移动端拍照上报、快速定位和工单回传。', 2);

INSERT INTO repair_reports (
  id,
  repair_code,
  title,
  region_id,
  location,
  channel,
  status_label,
  description,
  reporter_user_id,
  maintainer_user_id,
  report_time,
  complete_time
) VALUES
(1, 'BX-202604-01', '阀门漏水', 8, '1栋2单元 601 室水表井旁', 'Web', '待派单', '住户反映阀门接口持续滴漏，地面积水明显。', 1, 3, '2026-04-02 09:20:00', NULL),
(2, 'BX-202604-02', '水压异常', 9, '2栋1单元 1002 室入户管', 'UniApp', '处理中', '早高峰时段水压不稳，影响住户正常用水。', 4, 6, '2026-04-02 11:40:00', NULL),
(3, 'BX-202604-03', '流量计离线', 11, '3栋1单元 地下水表井', 'Web', '待复核', '流量计离线超过 20 分钟，需要现场核查。', 5, 3, '2026-04-03 14:10:00', NULL),
(4, 'BX-202604-04', '泵房压力波动', 13, '5栋1单元 泵房入口', 'UniApp', '已完成', '维修人员已更换压力传感器，恢复正常。', 2, 6, '2026-04-04 08:45:00', '2026-04-04 16:30:00');

INSERT INTO repair_logs (repair_id, operator_user_id, action_type, content) VALUES
(1, 1, 'report', '用户通过 Web 端提交了阀门漏水报修。'),
(2, 6, 'receive', '陈师傅已接单并开始现场排查。'),
(4, 6, 'complete', '已更换压力传感器并恢复供水稳定。');

INSERT INTO ai_examples (question, answer, sort_order) VALUES
('最近 1栋1单元夜间用水偏高怎么办？', '建议先排查夜间基流、卫生间长流水点位，并对近 7 天分时数据做异常对比。', 1),
('设备离线后如何快速定位故障？', '优先检查供电、网络链路和采集终端状态，再结合最近告警记录判断是否为批量故障。', 2),
('5栋1单元压力波动应该先看哪里？', '建议先查看泵房入口压力表、稳压设备运行状态，再检查阀门是否存在卡滞。', 3);

INSERT INTO ai_prompt_examples (prompt_text, sort_order) VALUES
('3栋1单元夜间用水为什么偏高？', 1),
('如何快速排查设备离线？', 2),
('小区还有哪些更合适的节水措施？', 3),
('5栋1单元压力异常应该如何处理？', 4);

SET FOREIGN_KEY_CHECKS = 1;
