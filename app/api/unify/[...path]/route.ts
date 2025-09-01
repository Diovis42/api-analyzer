import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import { makeUnifyRequest, UnifyApiError } from '@/lib/unify-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const supabase = await getServerSupabaseClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract installation ID from the path
    const pathSegments = params.path
    if (pathSegments.length < 2 || pathSegments[0] !== 'installations') {
      return NextResponse.json({ error: 'Invalid API path' }, { status: 400 })
    }

    const installationId = pathSegments[1]
    
    // Get the installation and API token for this user
    const { data: installation, error: dbError } = await supabase
      .from('installations')
      .select('unify_api_token, installation_name')
      .eq('user_id', user.id)
      .eq('installation_id', installationId)
      .single()

    if (dbError || !installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    // Build the endpoint path
    const endpoint = `/${pathSegments.join('/')}`
    
    // Extract query parameters
    const searchParams = new URL(request.url).searchParams
    const params_obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params_obj[key] = value
    })

    // Record the API request start time
    const startTime = Date.now()
    
    try {
      // Make the request to Unify API
      const data = await makeUnifyRequest(
        endpoint,
        installation.unify_api_token,
        params_obj
      )

      const responseTime = Date.now() - startTime

      // Log the successful request
      await supabase
        .from('api_requests')
        .insert({
          user_id: user.id,
          installation_id: installationId,
          endpoint,
          method: 'GET',
          response_status: 200,
          response_time_ms: responseTime,
        })

      return NextResponse.json(data)
      
    } catch (error) {
      const responseTime = Date.now() - startTime
      let statusCode = 500
      let errorMessage = 'Unknown error'

      if (error instanceof UnifyApiError) {
        statusCode = error.status
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      // Log the failed request
      await supabase
        .from('api_requests')
        .insert({
          user_id: user.id,
          installation_id: installationId,
          endpoint,
          method: 'GET',
          response_status: statusCode,
          response_time_ms: responseTime,
          error_message: errorMessage,
        })

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      )
    }
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}