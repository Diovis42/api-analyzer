import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Zap, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Package,
  Timer,
  BarChart3,
  MapPin
} from 'lucide-react'

interface PortsPageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getPortsData(installationId: string) {
  return {
    summary: {
      total: 12,
      open: 10,
      closed: 1,
      down: 1,
      maintenance: 0,
    },
    analytics: {
      avgUptime: 98.7,
      avgWaitTime: 2.3, // minutes
      totalThroughput: 4827,
      mbbf: 720.5, // Mean Bins Between Failures (hours)
    },
    ports: [
      {
        id: 'P001',
        name: 'Inbound Station 1',
        state: 'open',
        location: 'North Side',
        uptime: 99.2,
        waitTime: 1.8,
        throughput: 487,
        mbbf: 756.2,
        binCount: 23,
        avgProcessTime: 45,
        lastActivity: '2024-08-30T15:45:00Z'
      },
      {
        id: 'P002',
        name: 'Outbound Station 1',
        state: 'open',
        location: 'South Side',
        uptime: 98.9,
        waitTime: 2.1,
        throughput: 523,
        mbbf: 689.4,
        binCount: 31,
        avgProcessTime: 52,
        lastActivity: '2024-08-30T15:43:00Z'
      },
      {
        id: 'P003',
        name: 'QC Station 1',
        state: 'closed',
        location: 'East Side',
        uptime: 97.5,
        waitTime: 0,
        throughput: 298,
        mbbf: 623.8,
        binCount: 0,
        avgProcessTime: 78,
        lastActivity: '2024-08-30T12:30:00Z'
      },
      {
        id: 'P004',
        name: 'Inbound Station 2',
        state: 'down',
        location: 'North Side',
        uptime: 94.2,
        waitTime: 0,
        throughput: 0,
        mbbf: 445.7,
        binCount: 0,
        avgProcessTime: 0,
        lastActivity: '2024-08-30T08:15:00Z'
      },
      {
        id: 'P005',
        name: 'Outbound Station 2',
        state: 'open',
        location: 'South Side',
        uptime: 99.1,
        waitTime: 2.8,
        throughput: 445,
        mbbf: 834.1,
        binCount: 19,
        avgProcessTime: 48,
        lastActivity: '2024-08-30T15:44:00Z'
      },
      {
        id: 'P006',
        name: 'Express Lane 1',
        state: 'open',
        location: 'West Side',
        uptime: 99.5,
        waitTime: 1.2,
        throughput: 678,
        mbbf: 892.3,
        binCount: 12,
        avgProcessTime: 32,
        lastActivity: '2024-08-30T15:46:00Z'
      },
    ],
    stateDistribution: [
      { state: 'open', count: 10, color: 'bg-green-500' },
      { state: 'closed', count: 1, color: 'bg-yellow-500' },
      { state: 'down', count: 1, color: 'bg-red-500' },
      { state: 'maintenance', count: 0, color: 'bg-purple-500' },
    ],
    hourlyThroughput: [45, 52, 48, 61, 58, 72, 89, 94, 87, 91, 76, 68],
    waitTimeDistribution: {
      under1min: 4,
      between1and3min: 5,
      between3and5min: 2,
      over5min: 1
    },
    recentEvents: [
      {
        portId: 'P003',
        type: 'info',
        event: 'Port manually closed for quality check',
        time: '2024-08-30T12:30:00Z'
      },
      {
        portId: 'P004',
        type: 'error',
        event: 'Communication failure - port offline',
        time: '2024-08-30T08:15:00Z'
      },
      {
        portId: 'P001',
        type: 'warning',
        event: 'High bin wait time detected',
        time: '2024-08-30T07:45:00Z'
      },
    ]
  }
}

export default async function PortsPage({ params }: PortsPageProps) {
  const data = await getPortsData(params.installation)

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open':
        return 'text-green-600 bg-green-100'
      case 'closed':
        return 'text-yellow-600 bg-yellow-100'
      case 'down':
        return 'text-red-600 bg-red-100'
      case 'maintenance':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime < 1) return 'text-green-600'
    if (waitTime < 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Port Analytics</h2>
          <p className="text-gray-600">Monitor port performance, uptime, and bin processing metrics</p>
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
            <CardTitle className="text-sm font-medium">Total Ports</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.summary.open} open, {data.summary.down} down
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.avgUptime}%</div>
            <p className="text-xs text-muted-foreground">
              Across all active ports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.avgWaitTime}m</div>
            <p className="text-xs text-muted-foreground">
              Bin processing wait time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MBBF</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.mbbf}h</div>
            <p className="text-xs text-muted-foreground">
              Mean Bins Between Failures
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Port State Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Port States
            </CardTitle>
            <CardDescription>Current distribution of port operational states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.stateDistribution.map((stateInfo) => (
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

        {/* Wait Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              Wait Time Distribution
            </CardTitle>
            <CardDescription>Bin wait time categories across all ports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Under 1 minute</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{data.waitTimeDistribution.under1min}</span>
                  <p className="text-xs text-muted-foreground">ports</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">1-3 minutes</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-600">{data.waitTimeDistribution.between1and3min}</span>
                  <p className="text-xs text-muted-foreground">ports</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">3-5 minutes</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-orange-600">{data.waitTimeDistribution.between3and5min}</span>
                  <p className="text-xs text-muted-foreground">ports</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Over 5 minutes</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">{data.waitTimeDistribution.over5min}</span>
                  <p className="text-xs text-muted-foreground">ports</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Port Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Port Details
          </CardTitle>
          <CardDescription>Individual port status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Port ID</th>
                  <th className="text-left p-2 text-sm font-medium">Name</th>
                  <th className="text-left p-2 text-sm font-medium">State</th>
                  <th className="text-left p-2 text-sm font-medium">Location</th>
                  <th className="text-left p-2 text-sm font-medium">Uptime</th>
                  <th className="text-left p-2 text-sm font-medium">Wait Time</th>
                  <th className="text-left p-2 text-sm font-medium">Bins</th>
                  <th className="text-left p-2 text-sm font-medium">Throughput</th>
                  <th className="text-left p-2 text-sm font-medium">MBBF</th>
                </tr>
              </thead>
              <tbody>
                {data.ports.map((port) => (
                  <tr key={port.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <span className="font-medium">{port.id}</span>
                    </td>
                    <td className="p-2 text-sm">{port.name}</td>
                    <td className="p-2">
                      <Badge variant="outline" className={getStateColor(port.state)}>
                        {port.state}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">{port.location}</td>
                    <td className="p-2 text-sm">{port.uptime}%</td>
                    <td className="p-2">
                      <span className={`text-sm font-medium ${getWaitTimeColor(port.waitTime)}`}>
                        {port.waitTime}m
                      </span>
                    </td>
                    <td className="p-2 text-sm">
                      {port.binCount > 0 ? (
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3 text-blue-500" />
                          <span>{port.binCount}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="p-2 text-sm">{port.throughput}</td>
                    <td className="p-2 text-sm">{port.mbbf}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Events
            </CardTitle>
            <CardDescription>Latest port events and status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{event.portId}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.time).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Throughput */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Throughput Trends
            </CardTitle>
            <CardDescription>Hourly bin processing across all ports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Throughput chart visualization would be rendered here</p>
                <p className="text-sm">Hourly bin processing rates and trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Summary
          </CardTitle>
          <CardDescription>Key performance indicators and efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {data.analytics.totalThroughput.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Bins Processed</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(data.analytics.totalThroughput / data.summary.open / 24).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Bins per Hour</p>
              <p className="text-xs text-muted-foreground">Per active port</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {data.ports.reduce((sum, port) => sum + port.avgProcessTime, 0) / data.ports.length}s
              </div>
              <p className="text-sm text-muted-foreground">Avg Process Time</p>
              <p className="text-xs text-muted-foreground">Per bin</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}