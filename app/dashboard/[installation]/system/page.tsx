import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Database, 
  Wifi, 
  HardDrive,
  RefreshCw,
  TrendingUp
} from 'lucide-react'

interface SystemPageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getSystemData(installationId: string) {
  return {
    systemInfo: {
      installationId,
      mode: 'RUNNING' as const,
      uptime: '45d 12h 34m',
      uptimePercentage: 99.7,
      lastRestart: '2024-07-15T08:30:00Z',
      version: '2.1.4',
      buildNumber: '20240715.1',
    },
    modules: [
      { name: 'Controller', version: '2.1.4', status: 'running', uptime: '99.9%' },
      { name: 'Robot Manager', version: '2.1.3', status: 'running', uptime: '99.8%' },
      { name: 'Port Manager', version: '2.1.4', status: 'running', uptime: '99.7%' },
      { name: 'Grid Manager', version: '2.1.2', status: 'running', uptime: '99.6%' },
      { name: 'WCS Interface', version: '1.8.5', status: 'running', uptime: '98.9%' },
      { name: 'Diagnostics', version: '2.0.1', status: 'running', uptime: '99.4%' },
    ],
    resources: {
      cpu: { usage: 34, cores: 16 },
      memory: { usage: 68, total: 64 },
      storage: { usage: 45, total: 2048 },
      network: { status: 'connected', latency: 2.3 },
    },
    incidents: [
      { 
        id: 1, 
        type: 'warning', 
        title: 'High CPU usage detected', 
        time: '2024-08-28T14:20:00Z',
        resolved: true,
        duration: '15m'
      },
      { 
        id: 2, 
        type: 'error', 
        title: 'Network connectivity issue', 
        time: '2024-08-25T09:45:00Z',
        resolved: true,
        duration: '3h 22m'
      },
      { 
        id: 3, 
        type: 'info', 
        title: 'Scheduled maintenance completed', 
        time: '2024-08-20T02:00:00Z',
        resolved: true,
        duration: '2h'
      },
    ],
    health: {
      overall: 'healthy' as const,
      score: 97,
      checks: [
        { name: 'Database Connection', status: 'healthy', lastCheck: '30s ago' },
        { name: 'API Endpoints', status: 'healthy', lastCheck: '1m ago' },
        { name: 'Message Queue', status: 'healthy', lastCheck: '45s ago' },
        { name: 'File System', status: 'healthy', lastCheck: '2m ago' },
        { name: 'External Services', status: 'degraded', lastCheck: '1m ago' },
      ]
    }
  }
}

export default async function SystemPage({ params }: SystemPageProps) {
  const data = await getSystemData(params.installation)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
      case 'down':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getIncidentIcon = (type: string) => {
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
          <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
          <p className="text-gray-600">Monitor system health, uptime, and module versions</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Mode</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={data.systemInfo.mode === 'RUNNING' ? 'default' : 'destructive'} className="mb-2">
              {data.systemInfo.mode}
            </Badge>
            <p className="text-xs text-muted-foreground">Version {data.systemInfo.version}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemInfo.uptimePercentage}%</div>
            <p className="text-xs text-muted-foreground">{data.systemInfo.uptime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.health.score}/100</div>
            <p className="text-xs text-muted-foreground capitalize">{data.health.overall}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Restart</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(data.systemInfo.lastRestart).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(data.systemInfo.lastRestart).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Module Status
            </CardTitle>
            <CardDescription>Current status of all system modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.modules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      module.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{module.name}</p>
                      <p className="text-xs text-muted-foreground">v{module.version}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{module.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="h-5 w-5 mr-2" />
              Resource Usage
            </CardTitle>
            <CardDescription>Current system resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">{data.resources.cpu.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${data.resources.cpu.usage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{data.resources.cpu.cores} cores</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">{data.resources.memory.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${data.resources.memory.usage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{data.resources.memory.total} GB total</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-muted-foreground">{data.resources.storage.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${data.resources.storage.usage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{data.resources.storage.total} GB total</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-green-600 bg-green-100">
                    {data.resources.network.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.resources.network.latency}ms latency
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Health Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Health Checks
            </CardTitle>
            <CardDescription>System component health verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.health.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      check.status === 'healthy' ? 'bg-green-500' : 
                      check.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">{check.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{check.lastCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Incidents
            </CardTitle>
            <CardDescription>System incidents and their resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.incidents.map((incident) => (
                <div key={incident.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getIncidentIcon(incident.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{incident.title}</p>
                      {incident.resolved && (
                        <Badge variant="outline" className="text-green-600 bg-green-100">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(incident.time).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {incident.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance Trends</CardTitle>
          <CardDescription>Historical performance metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Performance chart visualization would be rendered here</p>
              <p className="text-sm">CPU, Memory, Network trends over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}