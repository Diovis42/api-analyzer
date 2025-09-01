import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Bot, Zap, Grid3X3, Battery, AlertTriangle } from 'lucide-react'

interface DashboardOverviewProps {
  params: {
    installation: string
  }
}

// This would normally fetch real data from the Unify API
async function getDashboardData(installationId: string) {
  // Mock data for now
  return {
    systemStatus: {
      mode: 'RUNNING' as const,
      uptime: '99.2%',
      lastUpdate: new Date().toISOString(),
    },
    robotSummary: {
      total: 24,
      active: 22,
      charging: 2,
      errors: 0,
    },
    portSummary: {
      total: 12,
      open: 10,
      closed: 1,
      down: 1,
    },
    gridSummary: {
      totalCells: 8640,
      occupancy: 87.3,
      blocked: 23,
    },
    batterySummary: {
      averageLevel: 78,
      chargingStations: 6,
      lowBattery: 1,
    },
    recentAlerts: [
      { id: 1, type: 'warning', message: 'Port P001 closed unexpectedly', time: '2 mins ago' },
      { id: 2, type: 'info', message: 'Maintenance scheduled for tonight', time: '1 hour ago' },
    ]
  }
}

export default async function InstallationOverview({ params }: DashboardOverviewProps) {
  const data = await getDashboardData(params.installation)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time monitoring of your AutoStore system</p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge variant={data.systemStatus.mode === 'RUNNING' ? 'default' : 'destructive'}>
              {data.systemStatus.mode}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Uptime: {data.systemStatus.uptime}
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(data.systemStatus.lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.robotSummary.active}/{data.robotSummary.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.robotSummary.charging} charging, {data.robotSummary.errors} errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ports</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.portSummary.open}/{data.portSummary.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.portSummary.closed} closed, {data.portSummary.down} down
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Occupancy</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.gridSummary.occupancy}%</div>
            <p className="text-xs text-muted-foreground">
              {data.gridSummary.blocked} blocked cells
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.batterySummary.averageLevel}%</div>
            <p className="text-xs text-muted-foreground">
              {data.batterySummary.lowBattery} low battery warnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent Alerts
          </CardTitle>
          <CardDescription>
            Latest system notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}