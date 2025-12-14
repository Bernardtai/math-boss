/**
 * Profile management utilities
 * Handles fetching, creating, and updating user profiles
 */

import { createClient } from '@/lib/supabase/client'
import type { Profile } from './types'

/**
 * Get or create a user profile
 * If profile doesn't exist, creates it from auth user data
 */
export async function getOrCreateProfile(
  userId: string,
  email: string,
  metadata?: {
    full_name?: string
    avatar_url?: string
  }
): Promise<Profile | null> {
  const supabase = createClient()

  // Try to fetch existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // If profile exists, return it
  if (existingProfile && !fetchError) {
    return existingProfile as Profile
  }

  // Check if error is "not found" (PGRST116) or table doesn't exist (404/42P01/PGRST205)
  // If it's a table missing error, the table doesn't exist - we can't proceed
  if (fetchError) {
    // PGRST205: Could not find the table in the schema cache
    // 42P01: relation does not exist (PostgreSQL error)
    // 404: HTTP not found
    const isTableMissing = 
      fetchError.code === 'PGRST205' ||
      fetchError.code === '42P01' ||
      fetchError.message?.includes('404') ||
      fetchError.message?.includes('relation') ||
      fetchError.message?.includes('does not exist') ||
      fetchError.message?.includes('Could not find the table')
    
    if (isTableMissing) {
      const errorMessage = 'The profiles table does not exist in your Supabase database. Please run the migration script: scripts/create-profiles-table.sql in your Supabase SQL Editor.'
      // Log with less verbosity to reduce console noise
      console.warn('Profiles table missing - user will see helpful error message')
      throw new Error(errorMessage)
    }
    
    // PGRST116 means "not found" - profile doesn't exist, we'll create it
    if (fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', {
        message: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint,
      })
      // Still try to create profile, might be a permission issue
    }
  }

  // Profile doesn't exist, create it
  const newProfile = {
    id: userId,
    email,
    full_name: metadata?.full_name || null,
    avatar_url: metadata?.avatar_url || null,
    country: null,
    date_of_birth: null,
  }

  const { data: createdProfile, error: createError } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single()

  if (createError) {
    // Check if table is missing
    const isTableMissing = 
      createError.code === 'PGRST205' ||
      createError.code === '42P01' ||
      createError.message?.includes('404') ||
      createError.message?.includes('relation') ||
      createError.message?.includes('does not exist') ||
      createError.message?.includes('Could not find the table')
    
    if (isTableMissing) {
      const errorMessage = 'The profiles table does not exist in your Supabase database. Please run the migration script: scripts/create-profiles-table.sql in your Supabase SQL Editor.'
      // Log with less verbosity to reduce console noise
      console.warn('Profiles table missing - user will see helpful error message')
      throw new Error(errorMessage)
    }
    
    console.error('Error creating profile:', {
      message: createError?.message || 'Unknown error',
      code: createError?.code || 'Unknown code',
      details: createError?.details || 'No details',
      hint: createError?.hint || 'No hint',
      fullError: createError || 'No error object',
    })
    
    // If it's a unique constraint violation, try to fetch again
    if (createError.code === '23505') {
      const { data: retryProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (retryProfile) {
        return retryProfile as Profile
      }
    }
    
    return null
  }

  return createdProfile as Profile
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'country' | 'date_of_birth' | 'avatar_url'>>
): Promise<Profile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data as Profile
}

/**
 * Upload avatar image to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const supabase = createClient()

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    return null
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)

  if (!urlData?.publicUrl) {
    console.error('Error getting public URL')
    return null
  }

  return urlData.publicUrl
}

