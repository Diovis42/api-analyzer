import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  Activity, 
  Clock, 
  Target,
  RefreshCw,
  Zap,
  Package,
  AlertTriangle,
  CheckCircle,
  Timer,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface PerformancePageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getPerformanceData(installationId: string) {
  return {
    kpis: {
      systemUptime: {
        current: 99.2,
        target: 99.5,
        trend: 0.3,
        status: 'warning'
      },
      binPresentations: {
        current: 1847,
        target: 2000,
        trend: -5.2,
        status: 'warning'
      },
      avgResponseTime: {
        current: 2.3,
        target: 2.0,
        trend: 0.4,
        status: 'warning'
      },
      throughput: {
        current: 94.7,
        target: 95.0,
        trend: 1.2,
        status: 'good'
      }
    },
    trends: {
      uptime: {
        daily: [99.1, 99.3, 98.9, 99.2, 99.4, 99.1, 99.2],
        hourly: [99.2, 99.1, 99.3, 99.0, 98.8, 99.1, 99.4, 99.2, 99.3, 99.1, 99.2, 99.0],
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      },
      binPresentations: {
        hourly: [45, 52, 48, 61, 78, 92, 134, 167, 189, 203, 178, 156],
        daily: [1824, 1967, 1756, 1889, 1923, 1798, 1847],
        monthly: [52847, 54123, 51967, 53456, 52189, 53012]
      },
      throughput: [89.2, 91.5, 93.8, 94.2, 92.7, 94.1, 94.7]
    },
    performance: {
      robotEfficiency: {
        avg: 94.2,
        best: 98.7,
        worst: 87.3,
        robots: [
          { id: 'R001', efficiency: 98.7, tasks: 234, uptime: 99.5 },
          { id: 'R002', efficiency: 96.3, tasks: 218, uptime: 98.9 },
          { id: 'R003', efficiency: 87.3, tasks: 198, uptime: 96.2 },
          { id: 'R004', efficiency: 95.8, tasks: 226, uptime: 99.1 },
          { id: 'R005', efficiency: 93.2, tasks: 211, uptime: 98.4 },
        ]
      },
      portPerformance: {
        avg: 92.6,
        best: 97.8,
        worst: 85.4,
        ports: [
          { id: 'P001', efficiency: 97.8, throughput: 523, uptime: 99.2 },
          { id: 'P002', efficiency: 94.2, throughput: 487, uptime: 98.9 },
          { id: 'P003', efficiency: 85.4, throughput: 298, uptime: 97.5 },
          { id: 'P004', efficiency: 91.7, throughput: 445, uptime: 99.1 },
          { id: 'P005', efficiency: 96.3, throughput: 678, uptime: 99.5 },
        ]
      }
    },
    alerts: [
      {
        id: 1,
        type: 'performance',
        severity: 'medium',
        message: 'Robot R003 efficiency below target (87.3%)',
        time: '2024-08-30T14:23:00Z',
        impact: 'Medium'
      },
      {
        id: 2,
        type: 'uptime',
        severity: 'low',
        message: 'System uptime slightly below target',
        time: '2024-08-30T12:15:00Z',
        impact: 'Low'
      },
      {
        id: 3,
        type: 'throughput',
        severity: 'low',
        message: 'Bin presentations 7.7% below target',
        time: '2024-08-30T11:30:00Z',
        impact: 'Medium'
      },
    ],
    benchmarks: {
      industry: {
        uptime: 98.5,
        throughput: 92.0,
        efficiency: 91.5
      },
      historical: {
        lastMonth: { uptime: 98.9, throughput: 93.2, efficiency: 93.8 },
        lastQuarter: { uptime: 99.1, throughput: 94.1, efficiency: 94.5 }
      }
    },
    forecast: {
      nextHour: {
        binPresentations: 187,
        throughput: 95.2,
        confidence: 87
      },
      nextDay: {
        binPresentations: 1920,
        throughput: 94.9,
        confidence: 82
      }
    }
  }
}

export default async function PerformancePage({ params }: PerformancePageProps) {
  const data = await getPerformanceData(params.installation)

  const getKpiStatus = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'critical':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0.1) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (trend < -0.1) return <ArrowDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0.1) return 'text-green-600'
    if (trend < -0.1) return 'text-red-600'
    return 'text-gray-600'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingDown className="h-4 w-4 text-yellow-500" />
      case 'uptime':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'throughput':
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
          <p className="text-gray-600">Monitor system performance, uptime trends, and efficiency metrics</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.systemUptime.current}%</div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(data.kpis.systemUptime.trend)}
              <span className={`text-xs ${getTrendColor(data.kpis.systemUptime.trend)}`}>
                {Math.abs(data.kpis.systemUptime.trend)}% vs target
              </span>
            </div>
            <Badge variant="outline" className={getKpiStatus(data.kpis.systemUptime.status)}>
              Target: {data.kpis.systemUptime.target}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bin Presentations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.binPresentations.current.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(data.kpis.binPresentations.trend)}
              <span className={`text-xs ${getTrendColor(data.kpis.binPresentations.trend)}`}>
                {Math.abs(data.kpis.binPresentations.trend)}% vs target
              </span>
            </div>
            <Badge variant="outline" className={getKpiStatus(data.kpis.binPresentations.status)}>
              Target: {data.kpis.binPresentations.target.toLocaleString()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.avgResponseTime.current}s</div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(-data.kpis.avgResponseTime.trend)} {/* Negative trend is good for response time */}
              <span className={`text-xs ${getTrendColor(-data.kpis.avgResponseTime.trend)}`}>
                {Math.abs(data.kpis.avgResponseTime.trend)}s vs target
              </span>
            </div>
            <Badge variant="outline" className={getKpiStatus(data.kpis.avgResponseTime.status)}>
              Target: {data.kpis.avgResponseTime.target}s
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.throughput.current}%</div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(data.kpis.throughput.trend)}
              <span className={`text-xs ${getTrendColor(data.kpis.throughput.trend)}`}>
                {Math.abs(data.kpis.throughput.trend)}% vs target
              </span>
            </div>
            <Badge variant="outline" className={getKpiStatus(data.kpis.throughput.status)}>
              Target: {data.kpis.throughput.target}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Uptime Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Uptime Trends
            </CardTitle>
            <CardDescription>System availability over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Uptime trend chart would be rendered here</p>
                <p className="text-sm">Daily and hourly uptime percentages</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">99.2%</div>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">99.1%</div>
                <p className="text-sm text-muted-foreground">7-Day Avg</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">98.9%</div>
                <p className="text-sm text-muted-foreground">30-Day Avg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bin Presentations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Bin Presentations
            </CardTitle>
            <CardDescription>Hourly and daily presentation volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Bin presentations chart would be rendered here</p>
                <p className="text-sm">Hourly and daily presentation trends</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">1,847</div>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">1,882</div>
                <p className="text-sm text-muted-foreground">7-Day Avg</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">52,967</div>
                <p className="text-sm text-muted-foreground">Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Robot Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Robot Performance
            </CardTitle>
            <CardDescription>Individual robot efficiency and task completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Fleet Average: {data.performance.robotEfficiency.avg}%</span>
                <span>Range: {data.performance.robotEfficiency.worst}% - {data.performance.robotEfficiency.best}%</span>
              </div>
              <Separator />
              <div className="space-y-3">
                {data.performance.robotEfficiency.robots.map((robot) => (
                  <div key={robot.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{robot.id}</span>
                      <div className="text-sm text-muted-foreground">
                        {robot.tasks} tasks • {robot.uptime}% uptime
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        robot.efficiency >= 95 ? 'text-green-600' :
                        robot.efficiency >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {robot.efficiency}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Port Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Port Performance
            </CardTitle>
            <CardDescription>Port efficiency and throughput metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Fleet Average: {data.performance.portPerformance.avg}%</span>
                <span>Range: {data.performance.portPerformance.worst}% - {data.performance.portPerformance.best}%</span>
              </div>
              <Separator />
              <div className="space-y-3">
                {data.performance.portPerformance.ports.map((port) => (
                  <div key={port.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{port.id}</span>
                      <div className="text-sm text-muted-foreground">
                        {port.throughput} bins • {port.uptime}% uptime
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        port.efficiency >= 95 ? 'text-green-600' :
                        port.efficiency >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {port.efficiency}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Performance Alerts
            </CardTitle>
            <CardDescription>Current performance issues and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground capitalize">
                          {alert.type}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {alert.impact} impact
                      </span>
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

        {/* Benchmarks & Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Benchmarks & Forecast
            </CardTitle>
            <CardDescription>Industry benchmarks and performance predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Industry Comparison</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Industry: {data.benchmarks.industry.uptime}%</span>
                      <span className="font-medium text-green-600">Ours: 99.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Throughput</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Industry: {data.benchmarks.industry.throughput}%</span>
                      <span className="font-medium text-green-600">Ours: 94.7%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Industry: {data.benchmarks.industry.efficiency}%</span>
                      <span className="font-medium text-green-600">Ours: 94.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Next Hour Forecast</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.forecast.nextHour.binPresentations}
                    </div>
                    <p className="text-xs text-muted-foreground">Bin Presentations</p>
                    <p className="text-xs text-green-600">{data.forecast.nextHour.confidence}% confidence</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.forecast.nextHour.throughput}%
                    </div>
                    <p className="text-xs text-muted-foreground">Throughput</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">24h Forecast</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.forecast.nextDay.binPresentations.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Bin Presentations</p>
                    <p className="text-xs text-green-600">{data.forecast.nextDay.confidence}% confidence</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {data.forecast.nextDay.throughput}%
                    </div>
                    <p className="text-xs text-muted-foreground">Throughput</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Trends Overview
          </CardTitle>
          <CardDescription>Comprehensive view of all performance metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Multi-metric performance chart would be rendered here</p>
              <p className="text-sm">Combined view of uptime, throughput, efficiency, and bin presentations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}