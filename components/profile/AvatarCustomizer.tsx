'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { AvatarCustomization } from '@/lib/db/types'
import { Loader2, Save, RotateCcw } from 'lucide-react'

interface AvatarCustomizerProps {
  userId: string
  initialCustomization?: AvatarCustomization | null
  onSave?: (customization: AvatarCustomization) => void
}

const SKIN_COLORS = [
  { name: 'Light', value: '#FDBCB4' },
  { name: 'Fair', value: '#F1C27D' },
  { name: 'Medium', value: '#E0AC69' },
  { name: 'Olive', value: '#C68642' },
  { name: 'Tan', value: '#8D5524' },
  { name: 'Brown', value: '#6B4423' },
  { name: 'Dark', value: '#4A2C1A' },
]

const HAIR_STYLES = [
  { name: 'Short', value: 'short' },
  { name: 'Medium', value: 'medium' },
  { name: 'Long', value: 'long' },
  { name: 'Curly', value: 'curly' },
  { name: 'Wavy', value: 'wavy' },
  { name: 'Spiky', value: 'spiky' },
  { name: 'Bald', value: 'bald' },
]

const HAIR_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Blonde', value: '#F5DEB3' },
  { name: 'Red', value: '#A0522D' },
  { name: 'Gray', value: '#808080' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Purple', value: '#800080' },
]

const CLOTHING_OPTIONS = [
  { name: 'Casual', value: 'casual' },
  { name: 'Formal', value: 'formal' },
  { name: 'Sporty', value: 'sporty' },
  { name: 'Adventure', value: 'adventure' },
  { name: 'School', value: 'school' },
  { name: 'Hero', value: 'hero' },
]

const ACCESSORIES = [
  { name: 'None', value: null },
  { name: 'Glasses', value: 'glasses' },
  { name: 'Hat', value: 'hat' },
  { name: 'Cap', value: 'cap' },
  { name: 'Headband', value: 'headband' },
  { name: 'Mask', value: 'mask' },
]

const BODY_TYPES = [
  { name: 'Slim', value: 'slim' },
  { name: 'Average', value: 'average' },
  { name: 'Athletic', value: 'athletic' },
  { name: 'Stocky', value: 'stocky' },
]

export function AvatarCustomizer({ userId, initialCustomization, onSave }: AvatarCustomizerProps) {
  const [customization, setCustomization] = useState<AvatarCustomization>(
    initialCustomization || {
      skinColor: 'default',
      hairStyle: 'default',
      hairColor: 'default',
      clothing: 'default',
      accessories: [],
      faceFeatures: {},
      bodyType: 'default',
    }
  )
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const updateCustomization = (key: keyof AvatarCustomization, value: any) => {
    setCustomization((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_customization: customization })
        .eq('id', userId)

      if (error) {
        console.error('Error saving avatar customization:', error)
        alert('Failed to save avatar. Please try again.')
        return
      }

      if (onSave) {
        onSave(customization)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setCustomization({
      skinColor: 'default',
      hairStyle: 'default',
      hairColor: 'default',
      clothing: 'default',
      accessories: [],
      faceFeatures: {},
      bodyType: 'default',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Avatar</CardTitle>
          <CardDescription>
            Design your character that will appear throughout your adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="flex justify-center py-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarFallback className="text-4xl bg-primary/10">
                {customization.skinColor !== 'default' ? '👤' : '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Skin Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skin Color</label>
            <div className="grid grid-cols-7 gap-2">
              {SKIN_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateCustomization('skinColor', color.value)}
                  className={`h-10 w-10 rounded-full border-2 ${
                    customization.skinColor === color.value
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hair Style</label>
            <div className="grid grid-cols-4 gap-2">
              {HAIR_STYLES.map((style) => (
                <Button
                  key={style.value}
                  variant={customization.hairStyle === style.value ? 'default' : 'outline'}
                  onClick={() => updateCustomization('hairStyle', style.value)}
                  className="text-sm"
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          {customization.hairStyle !== 'bald' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Hair Color</label>
              <div className="grid grid-cols-8 gap-2">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateCustomization('hairColor', color.value)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      customization.hairColor === color.value
                        ? 'border-primary ring-2 ring-primary ring-offset-1'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Clothing */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Clothing</label>
            <div className="grid grid-cols-3 gap-2">
              {CLOTHING_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={customization.clothing === option.value ? 'default' : 'outline'}
                  onClick={() => updateCustomization('clothing', option.value)}
                  className="text-sm"
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Accessories</label>
            <div className="grid grid-cols-3 gap-2">
              {ACCESSORIES.map((accessory) => (
                <Button
                  key={accessory.value || 'none'}
                  variant={
                    customization.accessories?.includes(accessory.value || '')
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() => {
                    const current = customization.accessories || []
                    if (accessory.value === null) {
                      updateCustomization('accessories', [])
                    } else if (current.includes(accessory.value)) {
                      updateCustomization(
                        'accessories',
                        current.filter((a) => a !== accessory.value)
                      )
                    } else {
                      updateCustomization('accessories', [...current, accessory.value])
                    }
                  }}
                  className="text-sm"
                >
                  {accessory.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Body Type</label>
            <div className="grid grid-cols-4 gap-2">
              {BODY_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={customization.bodyType === type.value ? 'default' : 'outline'}
                  onClick={() => updateCustomization('bodyType', type.value)}
                  className="text-sm"
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1" size="lg">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Avatar
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

