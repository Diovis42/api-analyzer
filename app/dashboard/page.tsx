import { redirect } from 'next/navigation'
import { getServerSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getInstallations() {
  const supabase = await getServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  const { data: installations, error } = await supabase
    .from('installations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching installations:', error)
    return []
  }

  return installations || []
}

export default async function DashboardPage() {
  const installations = await getInstallations()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Installations
          </h1>
          <p className="text-gray-600">
            Select an installation to view its analytics
          </p>
        </div>

        {installations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No installations found
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have access to any installations yet. Contact your system administrator to get access.
              </p>
              <Button asChild>
                <Link href="/dashboard/setup">
                  Add Installation
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {installations.map((installation) => (
              <Card key={installation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {installation.installation_name}
                  </CardTitle>
                  <CardDescription>
                    ID: {installation.installation_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">
                      Added {new Date(installation.created_at).toLocaleDateString()}
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/${installation.installation_id}`}>
                        View Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}