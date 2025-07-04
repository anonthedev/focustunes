import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { Preset } from "./types"

interface PresetManagerProps {
  presets: Preset[]
  onLoadPreset: (preset: Preset) => void
  onDeletePreset: (presetId: string) => void
}

export function PresetManager({ presets, onLoadPreset, onDeletePreset }: PresetManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Presets</CardTitle>
      </CardHeader>
      <CardContent>
        {presets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No presets saved yet. Create a mix and save it!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => (
              <Card key={preset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{preset.name}</h3>
                    <p className="text-sm text-gray-500">
                      {preset.sounds.length} sounds • {new Date(preset.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={() => onLoadPreset(preset)} size="sm" className="flex-1">
                        Load
                      </Button>
                      <Button onClick={() => onDeletePreset(preset.id)} variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 