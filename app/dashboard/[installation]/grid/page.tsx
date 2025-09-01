import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Grid3X3, 
  Package, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  RefreshCw,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Archive
} from 'lucide-react'

interface GridPageProps {
  params: {
    installation: string
  }
}

// Mock data - would normally fetch from Unify API
async function getGridData(installationId: string) {
  return {
    overview: {
      totalCells: 8640,
      occupiedCells: 7545,
      occupancyRate: 87.3,
      blockedCells: 23,
      availableCells: 1072,
      accessPoints: 12,
    },
    binData: {
      totalBins: 7545,
      contentCodes: {
        'CC-001': { count: 2456, description: 'Electronics' },
        'CC-002': { count: 1823, description: 'Apparel' },
        'CC-003': { count: 1245, description: 'Home & Garden' },
        'CC-004': { count: 987, description: 'Books' },
        'CC-005': { count: 654, description: 'Toys' },
        'CC-006': { count: 380, description: 'Sports' },
      },
      qualityDistribution: {
        excellent: 6789,
        good: 623,
        fair: 98,
        poor: 35,
      }
    },
    accessPoints: [
      {
        id: 'AP-01',
        location: 'North-East',
        status: 'active',
        robotsAssigned: 6,
        currentLoad: 78,
        maxLoad: 100,
        throughputToday: 1247,
        avgResponseTime: 12.3
      },
      {
        id: 'AP-02',
        location: 'North-West',
        status: 'active',
        robotsAssigned: 5,
        currentLoad: 65,
        maxLoad: 100,
        throughputToday: 1089,
        avgResponseTime: 14.7
      },
      {
        id: 'AP-03',
        location: 'South-East',
        status: 'active',
        robotsAssigned: 7,
        currentLoad: 82,
        maxLoad: 100,
        throughputToday: 1456,
        avgResponseTime: 11.8
      },
      {
        id: 'AP-04',
        location: 'South-West',
        status: 'maintenance',
        robotsAssigned: 0,
        currentLoad: 0,
        maxLoad: 100,
        throughputToday: 0,
        avgResponseTime: 0
      },
    ],
    gridLayout: {
      width: 120,
      height: 72,
      zones: [
        { name: 'Zone A', x: 0, y: 0, width: 60, height: 36, occupancy: 92.1 },
        { name: 'Zone B', x: 60, y: 0, width: 60, height: 36, occupancy: 85.7 },
        { name: 'Zone C', x: 0, y: 36, width: 60, height: 36, occupancy: 89.3 },
        { name: 'Zone D', x: 60, y: 36, width: 60, height: 36, occupancy: 82.4 },
      ]
    },
    recentActivity: [
      {
        id: 1,
        type: 'bin_placed',
        message: 'Bin placed at cell C45-23-12',
        contentCode: 'CC-001',
        time: '2024-08-30T15:45:00Z'
      },
      {
        id: 2,
        type: 'bin_retrieved',
        message: 'Bin retrieved from cell C67-89-05',
        contentCode: 'CC-002',
        time: '2024-08-30T15:43:00Z'
      },
      {
        id: 3,
        type: 'cell_blocked',
        message: 'Cell C23-45-67 blocked due to system error',
        contentCode: null,
        time: '2024-08-30T15:40:00Z'
      },
      {
        id: 4,
        type: 'zone_optimization',
        message: 'Zone A optimized for better access patterns',
        contentCode: null,
        time: '2024-08-30T15:30:00Z'
      },
    ],
    heatmapData: [
      { zone: 'A1', activity: 95, x: 15, y: 18 },
      { zone: 'A2', activity: 87, x: 45, y: 18 },
      { zone: 'B1', activity: 78, x: 75, y: 18 },
      { zone: 'B2', activity: 82, x: 105, y: 18 },
      { zone: 'C1', activity: 91, x: 15, y: 54 },
      { zone: 'C2', activity: 76, x: 45, y: 54 },
      { zone: 'D1', activity: 69, x: 75, y: 54 },
      { zone: 'D2', activity: 88, x: 105, y: 54 },
    ],
    trends: {
      occupancyTrend: [85.2, 86.1, 87.3, 86.8, 87.9, 87.1, 87.3],
      dailyMovements: 2847,
      peakHour: 14,
      avgDwellTime: 12.7 // hours
    }
  }
}

export default async function GridPage({ params }: GridPageProps) {
  const data = await getGridData(params.installation)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'maintenance':
        return 'text-red-600 bg-red-100'
      case 'offline':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getLoadColor = (load: number) => {
    if (load > 80) return 'text-red-600'
    if (load > 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 bg-green-100'
      case 'good':
        return 'text-blue-600 bg-blue-100'
      case 'fair':
        return 'text-yellow-600 bg-yellow-100'
      case 'poor':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bin_placed':
        return <Package className="h-4 w-4 text-green-500" />
      case 'bin_retrieved':
        return <Archive className="h-4 w-4 text-blue-500" />
      case 'cell_blocked':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'zone_optimization':
        return <Activity className="h-4 w-4 text-purple-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grid & Bins</h2>
          <p className="text-gray-600">Monitor grid layout, bin content codes, quality, and access point load</p>
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
            <CardTitle className="text-sm font-medium">Grid Occupancy</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.occupiedCells.toLocaleString()} / {data.overview.totalCells.toLocaleString()} cells
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.binData.totalBins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              stored in grid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Cells</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.overview.blockedCells}</div>
            <p className="text-xs text-muted-foreground">
              require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Movements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trends.dailyMovements.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              bin movements today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Codes Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Content Codes
            </CardTitle>
            <CardDescription>Distribution of bin content types across the grid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.binData.contentCodes).map(([code, info]) => (
                <div key={code} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{code}</p>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{info.count.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {((info.count / data.binData.totalBins) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bin Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Bin Quality
            </CardTitle>
            <CardDescription>Quality assessment of bins in storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.binData.qualityDistribution).map(([quality, count]) => (
                <div key={quality} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getQualityColor(quality)}>
                      {quality}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{count.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">
                      {((count / data.binData.totalBins) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Layout Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid3X3 className="h-5 w-5 mr-2" />
            Grid Layout Overview
          </CardTitle>
          <CardDescription>Visual representation of grid zones and occupancy rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-4 h-64">
              {data.gridLayout.zones.map((zone) => (
                <div 
                  key={zone.name}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col justify-center items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{zone.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {zone.occupancy}%
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {Math.round((zone.width * zone.height * zone.occupancy) / 100)} bins
                  </p>
                  <div className={`mt-2 w-16 h-2 rounded-full ${
                    zone.occupancy > 90 ? 'bg-red-400' :
                    zone.occupancy > 80 ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded bg-green-400" />
                <span>Low density</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded bg-yellow-400" />
                <span>Medium density</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 rounded bg-red-400" />
                <span>High density</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Access Points
          </CardTitle>
          <CardDescription>Performance and load distribution across access points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {data.accessPoints.map((ap) => (
              <div key={ap.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{ap.id}</h3>
                    <p className="text-sm text-muted-foreground">{ap.location}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(ap.status)}>
                    {ap.status}
                  </Badge>
                </div>
                
                {ap.status === 'active' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Load:</span>
                      <span className={`font-medium ${getLoadColor(ap.currentLoad)}`}>
                        {ap.currentLoad}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ap.currentLoad > 80 ? 'bg-red-500' :
                          ap.currentLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${ap.currentLoad}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Robots:</span>
                        <div className="font-medium">{ap.robotsAssigned}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Throughput:</span>
                        <div className="font-medium">{ap.throughputToday.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response:</span>
                        <div className="font-medium">{ap.avgResponseTime}s</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max Load:</span>
                        <div className="font-medium">{ap.maxLoad}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest grid and bin movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    {activity.contentCode && (
                      <p className="text-xs text-blue-600 font-medium">
                        {activity.contentCode}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Key grid performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {data.trends.avgDwellTime}h
                </div>
                <p className="text-sm text-muted-foreground">Average Dwell Time</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.trends.peakHour}:00
                  </div>
                  <p className="text-xs text-muted-foreground">Peak Activity Hour</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {data.overview.availableCells.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Available Cells</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">7-Day Occupancy Trend</h4>
                <div className="space-y-2">
                  {data.trends.occupancyTrend.map((rate, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Day {index + 1}
                      </span>
                      <span className="font-medium">{rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Activity Heatmap
          </CardTitle>
          <CardDescription>Grid activity distribution and utilization patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Activity heatmap visualization would be rendered here</p>
              <p className="text-sm">Zone activity levels, movement patterns, and utilization hotspots</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}