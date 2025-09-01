import { redirect } from 'next/navigation'
import { getServerSupabaseClient } from '@/lib/supabase'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'

async function getInstallationData(installationId: string) {
  const supabase = await getServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  const { data: installation, error } = await supabase
    .from('installations')
    .select('*')
    .eq('user_id', user.id)
    .eq('installation_id', installationId)
    .single()

  if (error || !installation) {
    redirect('/dashboard')
  }

  return { user, installation }
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { installation: string }
}) {
  const { user, installation } = await getInstallationData(params.installation)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar installationId={params.installation} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          user={user} 
          installationName={installation.installation_name}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}