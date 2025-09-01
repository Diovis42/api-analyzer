'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, 
  Wifi, 
  WifiOff,
  Bot, 
  Package, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

interface LivePageProps {
  params: {
    installation: string
  }
}

interface LiveEvent {
  id: string
  timestamp: string
  type: 'robot' | 'port' | 'system' | 'grid' | 'battery'
  subType: string
  message: string
  data: any
  severity: 'info' | 'warning' | 'error'
}

interface ConnectionStatus {
  connected: boolean
  lastHeartbeat: string | null
  reconnectAttempts: number
}

export default function LivePage({ params }: LivePageProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    lastHeartbeat: null,
    reconnectAttempts: 0
  })
  const [isStreamActive, setIsStreamActive] = useState(true)
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set())
  const [autoScroll, setAutoScroll] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)
  const eventsContainerRef = useRef<HTMLDivElement>(null)
  const maxEvents = 100

  // Mock WebSocket implementation for demo purposes
  useEffect(() => {
    if (!isStreamActive) return

    // Simulate WebSocket connection
    const simulateConnection = () => {
      setConnectionStatus(prev => ({
        ...prev,
        connected: true,
        lastHeartbeat: new Date().toISOString(),
        reconnectAttempts: 0
      }))

      // Simulate periodic events
      const eventTypes = [
        { type: 'robot', subType: 'task_completed', severity: 'info' as const },
        { type: 'robot', subType: 'charging_started', severity: 'info' as const },
        { type: 'robot', subType: 'error_detected', severity: 'warning' as const },
        { type: 'port', subType: 'bin_presented', severity: 'info' as const },
        { type: 'port', subType: 'port_closed', severity: 'warning' as const },
        { type: 'system', subType: 'heartbeat', severity: 'info' as const },
        { type: 'grid', subType: 'bin_placed', severity: 'info' as const },
        { type: 'grid', subType: 'cell_blocked', severity: 'error' as const },
        { type: 'battery', subType: 'low_battery', severity: 'warning' as const },
      ]

      const generateEvent = () => {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const robotId = `R${String(Math.floor(Math.random() * 24) + 1).padStart(3, '0')}`
        const portId = `P${String(Math.floor(Math.random() * 12) + 1).padStart(3, '0')}`
        const cellId = `C${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 99)}`
        
        const messages = {
          'robot:task_completed': `${robotId} completed pick task at ${cellId}`,
          'robot:charging_started': `${robotId} started charging at station CS-${Math.floor(Math.random() * 8) + 1}`,
          'robot:error_detected': `${robotId} navigation error - obstacle detected`,
          'port:bin_presented': `Bin presented at ${portId} for order fulfillment`,
          'port:port_closed': `${portId} closed unexpectedly - investigating`,
          'system:heartbeat': 'System health check - all services operational',
          'grid:bin_placed': `Bin placed at ${cellId} with content code CC-${String(Math.floor(Math.random() * 6) + 1).padStart(3, '0')}`,
          'grid:cell_blocked': `Cell ${cellId} blocked due to system error`,
          'battery:low_battery': `${robotId} battery level critical (${Math.floor(Math.random() * 20) + 5}%)`
        }

        const eventKey = `${eventType.type}:${eventType.subType}` as keyof typeof messages
        
        const newEvent: LiveEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: eventType.type as any,
          subType: eventType.subType,
          message: messages[eventKey] || 'Unknown event',
          data: {
            robotId: eventType.type === 'robot' ? robotId : undefined,
            portId: eventType.type === 'port' ? portId : undefined,
            cellId: eventType.type === 'grid' ? cellId : undefined,
            batteryLevel: eventType.subType === 'low_battery' ? Math.floor(Math.random() * 20) + 5 : undefined
          },
          severity: eventType.severity
        }

        setEvents(prev => {
          const updated = [newEvent, ...prev].slice(0, maxEvents)
          return updated
        })
      }

      const interval = setInterval(() => {
        if (isStreamActive) {
          generateEvent()
          setConnectionStatus(prev => ({
            ...prev,
            lastHeartbeat: new Date().toISOString()
          }))
        }
      }, Math.random() * 3000 + 1000) // Random interval between 1-4 seconds

      return () => clearInterval(interval)
    }

    const cleanup = simulateConnection()
    return cleanup
  }, [isStreamActive])

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (autoScroll && eventsContainerRef.current) {
      eventsContainerRef.current.scrollTop = 0
    }
  }, [events, autoScroll])

  const toggleStream = () => {
    setIsStreamActive(!isStreamActive)
    if (isStreamActive) {
      setConnectionStatus(prev => ({ ...prev, connected: false }))
    }
  }

  const clearEvents = () => {
    setEvents([])
  }

  const toggleTypeFilter = (type: string) => {
    setFilteredTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
      } else {
        newSet.add(type)
      }
      return newSet
    })
  }

  const filteredEvents = events.filter(event => {
    if (filteredTypes.size === 0) return true
    return !filteredTypes.has(event.type)
  })

  const getEventIcon = (type: string, subType: string) => {
    switch (type) {
      case 'robot':
        return <Bot className="h-4 w-4 text-blue-500" />
      case 'port':
        return <Zap className="h-4 w-4 text-green-500" />
      case 'system':
        return <Activity className="h-4 w-4 text-purple-500" />
      case 'grid':
        return <Package className="h-4 w-4 text-orange-500" />
      case 'battery':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Data Stream</h2>
          <p className="text-gray-600">Real-time system events and monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
          >
            {autoScroll ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Auto-scroll
          </Button>
          <Button variant="outline" size="sm" onClick={clearEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            variant={isStreamActive ? "destructive" : "default"}
            size="sm"
            onClick={toggleStream}
          >
            {isStreamActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {connectionStatus.connected ? (
                <Wifi className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 mr-2 text-red-500" />
              )}
              Connection Status
            </div>
            <Badge variant="outline" className={
              connectionStatus.connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            }>
              {connectionStatus.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {connectionStatus.connected ? 'Receiving live data' : 'Stream paused'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Update</p>
              <p className="font-medium">
                {connectionStatus.lastHeartbeat ? 
                  new Date(connectionStatus.lastHeartbeat).toLocaleTimeString() : 
                  'Never'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Events Received</p>
              <p className="font-medium">{events.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Event Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Filters</CardTitle>
            <CardDescription>Toggle event types to filter the stream</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['robot', 'port', 'system', 'grid', 'battery'].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(type, '')}
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {eventTypeCounts[type] || 0}
                    </span>
                    <Button
                      variant={filteredTypes.has(type) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleTypeFilter(type)}
                    >
                      {filteredTypes.has(type) ? 'Hidden' : 'Visible'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Events Feed */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Live Events Feed
                {connectionStatus.connected && (
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              <Badge variant="outline">
                {filteredEvents.length} / {events.length} events
              </Badge>
            </CardTitle>
            <CardDescription>Real-time system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={eventsContainerRef}
              className="h-96 overflow-y-auto space-y-2 border rounded-lg p-4 bg-gray-50"
            >
              {filteredEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No events to display</p>
                    <p className="text-sm">
                      {isStreamActive ? 'Waiting for events...' : 'Stream is paused'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-3 bg-white rounded-lg border animate-in fade-in slide-in-from-top-1 duration-300"
                  >
                    {getEventIcon(event.type, event.subType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {event.type} • {event.subType.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">{event.message}</p>
                      {event.data && Object.keys(event.data).some(key => event.data[key] !== undefined) && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Object.entries(event.data)
                            .filter(([_, value]) => value !== undefined)
                            .map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {value}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.entries(eventTypeCounts).map(([type, count]) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{type} Events</CardTitle>
              {getEventIcon(type, '')}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {events.length > 0 ? ((count / events.length) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Real-time System Status
          </CardTitle>
          <CardDescription>Live system performance indicators updated in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {connectionStatus.connected ? '99.2%' : '--'}
              </div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <div className={`mt-2 w-full h-2 rounded-full ${
                connectionStatus.connected ? 'bg-green-200' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    connectionStatus.connected ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                  style={{ width: connectionStatus.connected ? '99.2%' : '0%' }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {connectionStatus.connected ? '22/24' : '--'}
              </div>
              <p className="text-sm text-muted-foreground">Active Robots</p>
              <div className="flex justify-center mt-2 space-x-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-4 rounded ${
                      connectionStatus.connected && i < 22 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {connectionStatus.connected ? '156/min' : '--'}
              </div>
              <p className="text-sm text-muted-foreground">Event Rate</p>
              <div className="text-xs text-muted-foreground mt-2">
                Current throughput
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {connectionStatus.connected ? '2.3s' : '--'}
              </div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <div className="text-xs text-muted-foreground mt-2">
                System response time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}