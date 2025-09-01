import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

const UNIFY_WEBSOCKET_URL = 'https://live.unify.autostoresystem.com/connect'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const installationId = searchParams.get('installation')

    if (!installationId) {
      return NextResponse.json({ error: 'Installation ID required' }, { status: 400 })
    }

    // Get the installation and API token
    const { data: installation, error: dbError } = await supabase
      .from('installations')
      .select('unify_api_token, installation_name')
      .eq('user_id', user.id)
      .eq('installation_id', installationId)
      .single()

    if (dbError || !installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    try {
      // Get WebSocket URL from Unify
      const response = await fetch(
        `${UNIFY_WEBSOCKET_URL}?installations=${installationId}`,
        {
          headers: {
            'Authorization': `Token ${installation.unify_api_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const websocketUrl = await response.text()

      // Store the connection info in the database
      await supabase
        .from('live_connections')
        .upsert({
          user_id: user.id,
          installation_id: installationId,
          connection_url: websocketUrl,
          status: 'active',
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'user_id,installation_id'
        })

      return NextResponse.json({
        websocket_url: websocketUrl,
        installation_id: installationId,
        expires_in: 600 // 10 minutes
      })
    } catch (error) {
      console.error('WebSocket URL fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to get WebSocket URL from Unify API' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('WebSocket setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}