import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Battery, 
  BatteryLow, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Clock,
  Activity,
  Thermometer,
  BarChart3,
  CheckCircle
} from 'lucide-react'

interface BatteryPageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getBatteryData(installationId: string) {
  return {
    overview: {
      totalRobots: 24,
      avgBatteryLevel: 76.3,
      chargingRobots: 3,
      lowBatteryWarnings: 2,
      chargingStations: 8,
      activeStations: 6,
    },
    batteryTypes: {
      R5: {
        count: 16,
        avgLevel: 78.2,
        avgCycles: 1247,
        avgHealth: 94.5,
        lowBattery: 1,
      },
      R5_1: {
        count: 6,
        avgLevel: 72.8,
        avgCycles: 1156,
        avgHealth: 96.2,
        lowBattery: 1,
      },
      B1: {
        count: 2,
        avgLevel: 81.4,
        avgCycles: 892,
        avgHealth: 98.1,
        lowBattery: 0,
      }
    },
    robots: [
      {
        id: 'R001',
        batteryType: 'R5',
        level: 87,
        status: 'normal',
        cycles: 1324,
        health: 93.2,
        temperature: 24.5,
        voltage: 25.2,
        chargingStation: null,
        lastCharged: '2024-08-30T08:30:00Z'
      },
      {
        id: 'R002',
        batteryType: 'R5',
        level: 23,
        status: 'charging',
        cycles: 1189,
        health: 95.1,
        temperature: 28.3,
        voltage: 26.1,
        chargingStation: 'CS-02',
        lastCharged: '2024-08-30T15:20:00Z'
      },
      {
        id: 'R003',
        batteryType: 'R5.1',
        level: 19,
        status: 'low',
        cycles: 1445,
        health: 89.7,
        temperature: 26.1,
        voltage: 23.8,
        chargingStation: null,
        lastCharged: '2024-08-30T06:15:00Z'
      },
      {
        id: 'R004',
        batteryType: 'B1',
        level: 91,
        status: 'normal',
        cycles: 756,
        health: 97.8,
        temperature: 22.1,
        voltage: 48.7,
        chargingStation: null,
        lastCharged: '2024-08-30T12:45:00Z'
      },
      {
        id: 'R005',
        batteryType: 'R5.1',
        level: 34,
        status: 'charging',
        cycles: 1287,
        health: 94.3,
        temperature: 29.8,
        voltage: 25.6,
        chargingStation: 'CS-05',
        lastCharged: '2024-08-30T15:35:00Z'
      },
      {
        id: 'R006',
        batteryType: 'R5',
        level: 68,
        status: 'normal',
        cycles: 1098,
        health: 96.4,
        temperature: 25.2,
        voltage: 25.1,
        chargingStation: null,
        lastCharged: '2024-08-30T10:20:00Z'
      },
    ],
    chargingStations: [
      {
        id: 'CS-01',
        status: 'available',
        power: 0,
        robotId: null,
        utilizationToday: 67.3,
        totalSessions: 12,
        avgChargingTime: 45
      },
      {
        id: 'CS-02',
        status: 'charging',
        power: 2.4,
        robotId: 'R002',
        utilizationToday: 89.1,
        totalSessions: 15,
        avgChargingTime: 52
      },
      {
        id: 'CS-03',
        status: 'available',
        power: 0,
        robotId: null,
        utilizationToday: 54.2,
        totalSessions: 9,
        avgChargingTime: 48
      },
      {
        id: 'CS-04',
        status: 'maintenance',
        power: 0,
        robotId: null,
        utilizationToday: 0,
        totalSessions: 0,
        avgChargingTime: 0
      },
      {
        id: 'CS-05',
        status: 'charging',
        power: 2.1,
        robotId: 'R005',
        utilizationToday: 78.4,
        totalSessions: 13,
        avgChargingTime: 49
      },
      {
        id: 'CS-06',
        status: 'available',
        power: 0,
        robotId: null,
        utilizationToday: 72.8,
        totalSessions: 11,
        avgChargingTime: 43
      },
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        robotId: 'R003',
        message: 'Battery level critically low (19%)',
        time: '2024-08-30T15:10:00Z',
        severity: 'high'
      },
      {
        id: 2,
        type: 'info',
        robotId: 'R002',
        message: 'Started charging at station CS-02',
        time: '2024-08-30T15:20:00Z',
        severity: 'low'
      },
      {
        id: 3,
        type: 'warning',
        robotId: 'R007',
        message: 'Battery health degraded below 90%',
        time: '2024-08-30T13:45:00Z',
        severity: 'medium'
      },
    ],
    trends: {
      hourlyChargingSessions: [2, 1, 0, 1, 3, 4, 6, 5, 4, 7, 6, 8],
      batteryLevels: {
        high: 15, // >75%
        medium: 7, // 25-75%
        low: 2, // <25%
      }
    }
  }
}

export default async function BatteryPage({ params }: BatteryPageProps) {
  const data = await getBatteryData(params.installation)

  const getBatteryIcon = (level: number, status: string) => {
    if (status === 'charging') {
      return <Zap className="h-4 w-4 text-orange-500" />
    }
    if (level < 25) {
      return <BatteryLow className="h-4 w-4 text-red-500" />
    }
    return <Battery className="h-4 w-4 text-green-500" />
  }

  const getBatteryColor = (level: number) => {
    if (level > 75) return 'text-green-600'
    if (level > 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100'
      case 'charging':
        return 'text-orange-600 bg-orange-100'
      case 'low':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStationColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100'
      case 'charging':
        return 'text-blue-600 bg-blue-100'
      case 'maintenance':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Battery Monitoring</h2>
          <p className="text-gray-600">Monitor R5, R5.1, and B1 battery data and charger statistics</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Average</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.avgBatteryLevel}%</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.totalRobots} robots total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.chargingRobots}</div>
            <p className="text-xs text-muted-foreground">
              robots currently charging
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Battery</CardTitle>
            <BatteryLow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.overview.lowBatteryWarnings}</div>
            <p className="text-xs text-muted-foreground">
              warnings active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging Stations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.activeStations}/{data.overview.chargingStations}</div>
            <p className="text-xs text-muted-foreground">
              stations operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Battery Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Battery className="h-5 w-5 mr-2" />
            Battery Types Overview
          </CardTitle>
          <CardDescription>Performance metrics by battery type (R5, R5.1, B1)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(data.batteryTypes).map(([type, info]) => (
              <div key={type} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{type.replace('_', '.')}</h3>
                  <Badge variant="outline">{info.count} robots</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Level:</span>
                    <span className={`font-medium ${getBatteryColor(info.avgLevel)}`}>
                      {info.avgLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Cycles:</span>
                    <span className="font-medium">{info.avgCycles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Health:</span>
                    <span className="font-medium text-green-600">{info.avgHealth}%</span>
                  </div>
                  {info.lowBattery > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Low Battery:</span>
                      <span className="font-medium text-red-600">{info.lowBattery}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Battery Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Battery Level Distribution
            </CardTitle>
            <CardDescription>Fleet battery levels categorized by charge ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-sm">High (>75%)</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{data.trends.batteryLevels.high}</span>
                  <p className="text-xs text-muted-foreground">robots</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-sm">Medium (25-75%)</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-600">{data.trends.batteryLevels.medium}</span>
                  <p className="text-xs text-muted-foreground">robots</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-sm">Low (<25%)</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">{data.trends.batteryLevels.low}</span>
                  <p className="text-xs text-muted-foreground">robots</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Battery Alerts
            </CardTitle>
            <CardDescription>Recent battery-related warnings and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{alert.robotId}</p>
                      <Badge variant="outline" className={
                        alert.severity === 'high' ? 'text-red-600 bg-red-100' :
                        alert.severity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                        'text-blue-600 bg-blue-100'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot Battery Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Battery className="h-5 w-5 mr-2" />
            Robot Battery Details
          </CardTitle>
          <CardDescription>Individual robot battery status and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Robot ID</th>
                  <th className="text-left p-2 text-sm font-medium">Type</th>
                  <th className="text-left p-2 text-sm font-medium">Level</th>
                  <th className="text-left p-2 text-sm font-medium">Status</th>
                  <th className="text-left p-2 text-sm font-medium">Health</th>
                  <th className="text-left p-2 text-sm font-medium">Cycles</th>
                  <th className="text-left p-2 text-sm font-medium">Temperature</th>
                  <th className="text-left p-2 text-sm font-medium">Voltage</th>
                  <th className="text-left p-2 text-sm font-medium">Charging Station</th>
                </tr>
              </thead>
              <tbody>
                {data.robots.map((robot) => (
                  <tr key={robot.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <span className="font-medium">{robot.id}</span>
                    </td>
                    <td className="p-2 text-sm">{robot.batteryType.replace('_', '.')}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {getBatteryIcon(robot.level, robot.status)}
                        <span className={`text-sm font-medium ${getBatteryColor(robot.level)}`}>
                          {robot.level}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline" className={getStatusColor(robot.status)}>
                        {robot.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{robot.health}%</td>
                    <td className="p-2 text-sm">{robot.cycles.toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="h-3 w-3 text-blue-500" />
                        <span className="text-sm">{robot.temperature}°C</span>
                      </div>
                    </td>
                    <td className="p-2 text-sm">{robot.voltage}V</td>
                    <td className="p-2 text-sm">
                      {robot.chargingStation || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charging Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Charging Stations
          </CardTitle>
          <CardDescription>Status and utilization of charging infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.chargingStations.map((station) => (
              <div key={station.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{station.id}</h3>
                  <Badge variant="outline" className={getStationColor(station.status)}>
                    {station.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {station.robotId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Robot:</span>
                      <span className="font-medium">{station.robotId}</span>
                    </div>
                  )}
                  {station.power > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Power:</span>
                      <span className="font-medium text-orange-600">{station.power}kW</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className="font-medium">{station.utilizationToday}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sessions:</span>
                    <span className="font-medium">{station.totalSessions}</span>
                  </div>
                  {station.avgChargingTime > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Time:</span>
                      <span className="font-medium">{station.avgChargingTime}min</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charging Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Charging Trends
          </CardTitle>
          <CardDescription>Historical charging patterns and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Charging trends visualization would be rendered here</p>
              <p className="text-sm">Hourly charging sessions, battery level trends, and utilization patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}