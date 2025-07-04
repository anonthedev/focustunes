import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Volume2, Trash2, Save } from "lucide-react";
import { ActiveSound } from "./types";

interface ActiveSoundsMixerProps {
  activeSounds: ActiveSound[];
  presetName: string;
  onPresetNameChange: (name: string) => void;
  onSavePreset: () => void;
  onUpdateVolume: (soundId: string, volume: number) => void;
  onRemoveSound: (soundId: string) => void;
}

export function ActiveSoundsMixer({
  activeSounds,
  presetName,
  onPresetNameChange,
  onSavePreset,
  onUpdateVolume,
  onRemoveSound,
}: ActiveSoundsMixerProps) {
  if (activeSounds.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-4">
        <div className="text-muted-foreground">
          <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active sounds</p>
          <p className="text-sm">Add sounds from the library to start mixing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Active Sounds</h2>
        <p className="text-sm text-muted-foreground">
          {activeSounds.length} sound{activeSounds.length !== 1 ? "s" : ""} playing
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto">
        {activeSounds.map((sound) => (
          <div
            key={sound.id}
            className="group relative p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{sound.name}</h4>
              <Button
                onClick={() => onRemoveSound(sound.id)}
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <Slider
                value={[sound.volume]}
                onValueChange={([value]) => onUpdateVolume(sound.id, value)}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-9 text-right">
                {sound.volume}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            placeholder="Save as preset..."
            value={presetName}
            onChange={(e) => onPresetNameChange(e.target.value)}
          />
          <Button
            onClick={onSavePreset}
            disabled={!presetName.trim()}
            variant="default"
            className="shrink-0"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
