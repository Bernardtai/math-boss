'use client'

import { Island3D } from '@/components/3d/Island3D'
import { IslandType } from '@/lib/3d/island-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Island3DViewProps {
  islandType: IslandType
  islandName: string
  onClose?: () => void
}

export function Island3DView({ islandType, islandName, onClose }: Island3DViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{islandName} - 3D View</CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden bg-muted">
            <Island3D islandType={islandType} width={800} height={600} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

