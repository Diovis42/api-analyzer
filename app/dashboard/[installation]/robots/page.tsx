import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Bot, 
  Activity, 
  AlertTriangle, 
  Battery, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  MapPin,
  Wrench,
  BarChart3
} from 'lucide-react'

interface RobotsPageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getRobotsData(installationId: string) {
  return {
    summary: {
      total: 24,
      active: 22,
      charging: 2,
      idle: 3,
      error: 0,
      maintenance: 0,
    },
    analytics: {
      avgMTBF: 156.7, // Mean Time Between Failures (hours)
      totalDistance: 47832.5, // km
      totalTasks: 18947,
      efficiency: 94.2, // %
    },
    robots: [
      { 
        id: 'R001', 
        state: 'picking', 
        position: { x: 45, y: 23 }, 
        battery: 87, 
        task: 'Pick from C23-45-12',
        uptime: 99.1,
        mtbf: 167.2,
        errors: 0
      },
      { 
        id: 'R002', 
        state: 'charging', 
        position: { x: 12, y: 8 }, 
        battery: 34, 
        task: 'Charging at station 2',
        uptime: 98.7,
        mtbf: 142.8,
        errors: 1
      },
      { 
        id: 'R003', 
        state: 'dropping', 
        position: { x: 67, y: 89 }, 
        battery: 73, 
        task: 'Drop at P005',
        uptime: 99.5,
        mtbf: 189.3,
        errors: 0
      },
      { 
        id: 'R004', 
        state: 'idle', 
        position: { x: 23, y: 56 }, 
        battery: 92, 
        task: 'Waiting for task',
        uptime: 97.8,
        mtbf: 134.6,
        errors: 2
      },
      { 
        id: 'R005', 
        state: 'moving', 
        position: { x: 34, y: 12 }, 
        battery: 68, 
        task: 'Moving to C45-67-23',
        uptime: 98.9,
        mtbf: 156.7,
        errors: 0
      },
      { 
        id: 'R006', 
        state: 'picking', 
        position: { x: 78, y: 45 }, 
        battery: 81, 
        task: 'Pick from C78-45-67',
        uptime: 99.3,
        mtbf: 171.4,
        errors: 1
      },
    ],
    states: [
      { state: 'picking', count: 8, color: 'bg-blue-500' },
      { state: 'dropping', count: 6, color: 'bg-green-500' },
      { state: 'moving', count: 5, color: 'bg-yellow-500' },
      { state: 'idle', count: 3, color: 'bg-gray-500' },
      { state: 'charging', count: 2, color: 'bg-orange-500' },
      { state: 'error', count: 0, color: 'bg-red-500' },
    ],
    errors: [
      {
        robotId: 'R002',
        type: 'navigation',
        message: 'Path blocked by obstacle',
        time: '2024-08-30T14:23:00Z',
        resolved: true
      },
      {
        robotId: 'R004',
        type: 'communication',
        message: 'Lost connection to controller',
        time: '2024-08-30T10:15:00Z',
        resolved: true
      },
    ],
    performance: {
      hourlyTasks: [12, 15, 18, 22, 19, 25, 28, 24, 26, 23, 21, 18],
      batteryTrends: {
        average: 76.3,
        lowest: 12.4,
        chargingCycles: 847
      }
    }
  }
}

export default async function RobotsPage({ params }: RobotsPageProps) {
  const data = await getRobotsData(params.installation)

  const getStateColor = (state: string) => {
    switch (state) {
      case 'picking':
      case 'dropping':
        return 'text-blue-600 bg-blue-100'
      case 'moving':
        return 'text-yellow-600 bg-yellow-100'
      case 'charging':
        return 'text-orange-600 bg-orange-100'
      case 'idle':
        return 'text-gray-600 bg-gray-100'
      case 'error':
      case 'maintenance':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600'
    if (level > 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Robot Analytics</h2>
          <p className="text-gray-600">Monitor robot performance, states, and maintenance metrics</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Robots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.summary.active} active, {data.summary.charging} charging
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg MTBF</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.avgMTBF}h</div>
            <p className="text-xs text-muted-foreground">
              Mean Time Between Failures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.totalTasks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.analytics.efficiency}% efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.totalDistance.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">
              Cumulative travel distance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Robot States Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Robot States
            </CardTitle>
            <CardDescription>Current distribution of robot operational states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.states.map((stateInfo) => (
                <div key={stateInfo.state} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${stateInfo.color}`} />
                    <span className="text-sm font-medium capitalize">{stateInfo.state}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stateInfo.count}</span>
                    <p className="text-xs text-muted-foreground">
                      {((stateInfo.count / data.summary.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Battery Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="h-5 w-5 mr-2" />
              Battery Overview
            </CardTitle>
            <CardDescription>Fleet battery levels and charging statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {data.performance.batteryTrends.average}%
                  </div>
                  <p className="text-xs text-muted-foreground">Average Level</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {data.performance.batteryTrends.lowest}%
                  </div>
                  <p className="text-xs text-muted-foreground">Lowest Level</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {data.performance.batteryTrends.chargingCycles}
                  </div>
                  <p className="text-xs text-muted-foreground">Charging Cycles</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Battery Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>High (>75%)</span>
                    <span className="text-green-600 font-medium">15 robots</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium (25-75%)</span>
                    <span className="text-yellow-600 font-medium">7 robots</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low (<25%)</span>
                    <span className="text-red-600 font-medium">2 robots</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Robot Details
          </CardTitle>
          <CardDescription>Individual robot status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Robot ID</th>
                  <th className="text-left p-2 text-sm font-medium">State</th>
                  <th className="text-left p-2 text-sm font-medium">Position</th>
                  <th className="text-left p-2 text-sm font-medium">Battery</th>
                  <th className="text-left p-2 text-sm font-medium">Current Task</th>
                  <th className="text-left p-2 text-sm font-medium">Uptime</th>
                  <th className="text-left p-2 text-sm font-medium">MTBF</th>
                  <th className="text-left p-2 text-sm font-medium">Errors</th>
                </tr>
              </thead>
              <tbody>
                {data.robots.map((robot) => (
                  <tr key={robot.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <span className="font-medium">{robot.id}</span>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline" className={getStateColor(robot.state)}>
                        {robot.state}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {robot.position.x},{robot.position.y}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <Battery className={`h-4 w-4 ${getBatteryColor(robot.battery)}`} />
                        <span className={`text-sm font-medium ${getBatteryColor(robot.battery)}`}>
                          {robot.battery}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-sm">{robot.task}</td>
                    <td className="p-2 text-sm">{robot.uptime}%</td>
                    <td className="p-2 text-sm">{robot.mtbf}h</td>
                    <td className="p-2">
                      {robot.errors > 0 ? (
                        <Badge variant="outline" className="text-red-600 bg-red-100">
                          {robot.errors}
                        </Badge>
                      ) : (
                        <span className="text-sm text-green-600">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Errors
            </CardTitle>
            <CardDescription>Latest robot errors and their resolution status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.errors.length > 0 ? (
                data.errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{error.robotId}</p>
                        {error.resolved && (
                          <Badge variant="outline" className="text-green-600 bg-green-100">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{error.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {error.type} • {new Date(error.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent errors</p>
                  <p className="text-sm">All robots operating normally</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Trends
            </CardTitle>
            <CardDescription>Hourly task completion and movement patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance chart visualization would be rendered here</p>
                <p className="text-sm">Task completion rates, movement efficiency trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}