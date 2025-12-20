import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      // Get the user after successful session exchange
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      // Create profile if user exists (don't block redirect if profile creation fails)
      if (user && !userError) {
        try {
          const userId = user.id
          const email = user.email || ''
          const metadata = user.user_metadata || {}
          const googleName = metadata.full_name || metadata.name || ''
          const googleAvatar = metadata.avatar_url || metadata.picture || ''

          // Check if profile already exists (handle missing table gracefully)
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single()

          // If table doesn't exist (PGRST205), skip profile creation
          // User will see helpful error message on profile page
          const isTableMissing = 
            checkError?.code === 'PGRST205' ||
            checkError?.code === '42P01' ||
            checkError?.message?.includes('Could not find the table')

          if (isTableMissing) {
            console.warn('Profiles table missing - profile will be created when table exists')
            // Don't try to create profile if table doesn't exist
          } else if (!existingProfile && !checkError) {
            // Only create if profile doesn't exist and no error checking
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email,
                full_name: googleName || null,
                avatar_url: googleAvatar || null,
                country: null,
                date_of_birth: null,
              })

            if (profileError) {
              // Log error but don't block redirect
              const isTableMissingOnInsert = 
                profileError.code === 'PGRST205' ||
                profileError.code === '42P01' ||
                profileError.message?.includes('Could not find the table')
              
              if (isTableMissingOnInsert) {
                console.warn('Profiles table missing - user will see helpful error message')
              } else {
                console.error('Error creating profile after login:', {
                  code: profileError.code,
                  message: profileError.message,
                  hint: profileError.hint
                })
              }
            } else {
              console.log('Profile created successfully for user:', userId)
            }
          }
        } catch (err) {
          // Log error but don't block redirect
          console.error('Unexpected error creating profile:', err)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // We can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-code-error`)
}
