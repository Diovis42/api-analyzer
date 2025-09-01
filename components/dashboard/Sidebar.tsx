'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Bot, 
  Battery, 
  Grid3X3, 
  Activity, 
  Wifi,
  Settings,
  Home,
  Zap
} from 'lucide-react'

interface SidebarProps {
  installationId: string
}

const navigation = [
  {
    name: 'Overview',
    href: '',
    icon: Home,
  },
  {
    name: 'System Status',
    href: '/system',
    icon: Activity,
  },
  {
    name: 'Robots',
    href: '/robots',
    icon: Bot,
  },
  {
    name: 'Ports',
    href: '/ports',
    icon: Zap,
  },
  {
    name: 'Battery & Charging',
    href: '/battery',
    icon: Battery,
  },
  {
    name: 'Grid & Bins',
    href: '/grid',
    icon: Grid3X3,
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: BarChart3,
  },
  {
    name: 'Live Data',
    href: '/live',
    icon: Wifi,
  },
]

export function Sidebar({ installationId }: SidebarProps) {
  const pathname = usePathname()
  const basePath = `/dashboard/${installationId}`

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-4 border-b">
        <Link href="/dashboard" className="text-lg font-semibold">
          API Analyzer
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-4">
        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const href = `${basePath}${item.href}`
            const isActive = pathname === href
            
            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 shrink-0',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-2">Installation</div>
          <div className="text-sm font-medium text-gray-900 truncate">
            {installationId}
          </div>
        </div>
      </div>
    </div>
  )
}