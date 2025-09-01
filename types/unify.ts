export interface UnifyApiResponse<T> {
  next: string | null
  previous: string | null
  results: UnifyDataResult<T>[]
}

export interface UnifyDataResult<T> {
  version: string
  date: string
  result: T
}

export interface UnifyEndpoint {
  path: string
  version: string
  category: 'core' | 'operational' | 'robot' | 'port' | 'performance' | 'battery' | 'analytics'
  description: string
}

export interface Installation {
  id: string
  name: string
  status: 'active' | 'inactive'
  region?: string
}

export interface InstallationStatus {
  system_mode: 'RUNNING' | 'STOPPED' | 'SERVICE' | 'RECOVERY'
  system_mode_time: string
  alive_time: string
}

export interface RobotState {
  robot_id: string
  state: 'AVAILABLE' | 'UNAVAILABLE' | 'WORKING' | 'CHARGING_AVAILABLE' | 'CHARGING_UNAVAILABLE' | 'SERVICE_ON_GRID' | 'SERVICE_OFF_GRID' | 'RECOVERY'
  duration: number
  x_position?: number
  y_position?: number
}

export interface RobotError {
  robot_id: string
  error_code: string
  error_message: string
  timestamp: string
  x_position?: number
  y_position?: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'ACTIVE' | 'CLEARED'
}

export interface PortState {
  port_id: string
  state: 'OPEN' | 'CLOSED' | 'DOWN' | 'STOPPED'
  duration: number
}

export interface BinPresentation {
  date: string
  picks: number
  goods_in: number
  inspection_or_adhoc: number
  total: number
}

export interface GridInfo {
  total_cells: number
  occupied_cells: number
  empty_cells: number
  blocked_cells: number
  capacity_percentage: number
}

export interface UptimeData {
  date: string
  total_uptime: number
  scheduled_downtime: number
  unscheduled_downtime: number
  availability_percentage: number
}

export interface BatteryData {
  robot_id: string
  battery_level: number
  charging_cycles: number
  health_score: number
  last_charge_time: string
}

export interface LiveEvent {
  event_type: string
  timestamp: string
  data: Record<string, any>
  session_id?: string
  sequence_number?: number
}

// Database types
export interface DbInstallation {
  id: string
  user_id: string
  installation_id: string
  installation_name: string
  unify_api_token: string
  created_at: string
  updated_at: string
}

export interface DbApiRequest {
  id: string
  user_id: string | null
  installation_id: string | null
  endpoint: string
  method: string
  response_status: number | null
  response_time_ms: number | null
  error_message: string | null
  created_at: string
}

export interface DbDashboard {
  id: string
  user_id: string
  installation_id: string
  name: string
  config: Record<string, any>
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface DbLiveConnection {
  id: string
  user_id: string
  installation_id: string
  connection_url: string | null
  status: 'active' | 'inactive' | 'error'
  last_activity: string
  created_at: string
}