import { UnifyApiResponse, UnifyEndpoint } from '@/types/unify'

const UNIFY_BASE_URL = 'https://api.unify.autostoresystem.com/v1'

export class UnifyApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'UnifyApiError'
  }
}

export async function makeUnifyRequest<T>(
  endpoint: string,
  apiToken: string,
  params: Record<string, string> = {}
): Promise<UnifyApiResponse<T>> {
  const url = new URL(`${UNIFY_BASE_URL}${endpoint}`)
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value)
  })

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'API-Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new UnifyApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof UnifyApiError) {
      throw error
    }
    throw new Error(`Failed to fetch from Unify API: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const UNIFY_ENDPOINTS: Record<string, UnifyEndpoint> = {
  // Core endpoints
  installations: {
    path: '/installations',
    version: '1.0.0',
    category: 'core',
    description: 'Lists all installations the user has access to'
  },
  installationStatus: {
    path: '/installations/{installationId}/status',
    version: '1.0.0',
    category: 'core',
    description: 'Shows current grid status (updated every 5 minutes)'
  },
  
  // Operational data
  accessPointLoad: {
    path: '/installations/{installationId}/access-point-load',
    version: '2.1.0',
    category: 'operational',
    description: 'Hourly access point load data with channel information'
  },
  binsContentCode: {
    path: '/installations/{installationId}/bins-content-code',
    version: '2.0.0',
    category: 'operational',
    description: 'Bin counts by content code and location'
  },
  binQuality: {
    path: '/installations/{installationId}/bin-quality',
    version: '1.2.1',
    category: 'operational',
    description: 'Links robot errors to specific bins for quality analysis'
  },
  binsAbove: {
    path: '/installations/{installationId}/bins-above',
    version: '1.0.4',
    category: 'operational',
    description: 'Digging depth distribution and task statistics'
  },
  gridInfo: {
    path: '/installations/{installationId}/grid-info',
    version: '1.0.3',
    category: 'operational',
    description: 'Grid capacity information and cell types'
  },
  gridLayout: {
    path: '/installations/{installationId}/grid-layout',
    version: '2.0.1',
    category: 'operational',
    description: 'Complete grid structure and cell types'
  },
  
  // Robot data
  robotErrors: {
    path: '/installations/{installationId}/robot-errors',
    version: '1.1.7',
    category: 'robot',
    description: 'All historical robot errors with location and impact data'
  },
  robotMtbf: {
    path: '/installations/{installationId}/robot-mtbf',
    version: '1.4.7',
    category: 'robot',
    description: 'Robot reliability metrics and active times'
  },
  robotMovement: {
    path: '/installations/{installationId}/robot-movement',
    version: '1.2.0',
    category: 'robot',
    description: 'Distance traveled in X, Y, Z directions'
  },
  robotState: {
    path: '/installations/{installationId}/robot-state',
    version: '2.1.6',
    category: 'robot',
    description: 'Hourly aggregated robot states'
  },
  
  // Port data
  portBinWaitTime: {
    path: '/installations/{installationId}/port-bin-wait-time',
    version: '4.0.1',
    category: 'port',
    description: 'Detailed wait time statistics by category and content code'
  },
  portMbbf: {
    path: '/installations/{installationId}/port-mbbf',
    version: '1.5.6',
    category: 'port',
    description: 'Port error statistics and bins processed between failures'
  },
  portState: {
    path: '/installations/{installationId}/port-state',
    version: '1.0.5',
    category: 'port',
    description: 'Hourly port state duration (OPEN, CLOSED, DOWN, STOPPED)'
  },
  portUptime: {
    path: '/installations/{installationId}/port-uptime',
    version: '3.1.0',
    category: 'port',
    description: 'Port availability metrics and bin throughput'
  },
  portPickSpeedDistribution: {
    path: '/installations/{installationId}/port-pick-speed-distribution',
    version: '1.0.1',
    category: 'port',
    description: 'Time distribution frequencies for bin and user wait times'
  },
  
  // System performance
  uptime: {
    path: '/installations/{installationId}/uptime',
    version: '1.4.2',
    category: 'performance',
    description: 'System availability and uptime calculations'
  },
  incidents: {
    path: '/installations/{installationId}/incidents',
    version: '1.1.3',
    category: 'performance',
    description: 'Historical incident data with severity levels'
  },
  eventLog: {
    path: '/installations/{installationId}/event-log',
    version: '1.0.1',
    category: 'performance',
    description: 'Console-like event log data'
  },
  installationData: {
    path: '/installations/{installationId}/installation-data',
    version: '1.3.1',
    category: 'performance',
    description: 'Module inventory (bins, robots, ports, chargers)'
  },
  moduleVersions: {
    path: '/installations/{installationId}/module-versions',
    version: '3.0.4',
    category: 'performance',
    description: 'Software versions for all modules'
  },
  
  // Battery and charging
  r5Battery: {
    path: '/installations/{installationId}/R5-battery',
    version: '2.3.3',
    category: 'battery',
    description: 'R5 robot charging statistics and battery health flags'
  },
  r5BatteryEstimation: {
    path: '/installations/{installationId}/r5-battery-estimation',
    version: '1.0.9',
    category: 'battery',
    description: 'Battery capacity score (0-5 scale) based on 7-day data'
  },
  r5Chargers: {
    path: '/installations/{installationId}/R5-chargers',
    version: '2.4.1',
    category: 'battery',
    description: 'Charger usage statistics and blocked charger indicators'
  },
  r51Battery: {
    path: '/installations/{installationId}/r5-1-battery',
    version: '1.0.3',
    category: 'battery',
    description: 'R5.1 and R5.1 Pro charging data'
  },
  r51Charger: {
    path: '/installations/{installationId}/r5-1-charger',
    version: '1.2.0',
    category: 'battery',
    description: 'Charger temperature monitoring and usage statistics'
  },
  b1Battery: {
    path: '/installations/{installationId}/B1-battery',
    version: '1.0.1',
    category: 'battery',
    description: 'B1 battery charging frequency'
  },
  b1Chargers: {
    path: '/installations/{installationId}/B1-chargers',
    version: '1.0.1',
    category: 'battery',
    description: 'B1 charger group information'
  },
  
  // Analytics
  binPresentations: {
    path: '/installations/{installationId}/bin-presentations',
    version: '2.1.2',
    category: 'analytics',
    description: 'Daily bin presentation counts by category'
  },
  binPresentationsTrend: {
    path: '/installations/{installationId}/bin-presentations/trend',
    version: '1.0.0',
    category: 'analytics',
    description: 'Weekly aggregated trends with indicators'
  },
  uptimeTrend: {
    path: '/installations/{installationId}/uptime/trend',
    version: '1.0.1',
    category: 'analytics',
    description: 'Weekly uptime trends with outlier detection'
  },
  liveEvents: {
    path: '/installations/{installationId}/live-events',
    version: '1.0.0',
    category: 'analytics',
    description: 'Historical live events with various query methods'
  }
}

export function getEndpointsByCategory(category: string) {
  return Object.entries(UNIFY_ENDPOINTS)
    .filter(([, endpoint]) => endpoint.category === category)
    .reduce((acc, [key, endpoint]) => ({ ...acc, [key]: endpoint }), {})
}