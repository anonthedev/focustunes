"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSoundMix } from "./actions/generate-mix";
import { PlaybackControls } from "@/components/sound-mixer/playback-controls";
import { ActiveSoundsMixer } from "@/components/sound-mixer/active-sounds-mixer";
import { SoundLibrary } from "@/components/sound-mixer/sound-library";
import { AIGenerator } from "@/components/sound-mixer/ai-generator";
import { PresetManager } from "@/components/sound-mixer/preset-manager";
import { useAudioManager } from "@/hooks/use-audio-manager";
import { SOUND_LIBRARY, Preset } from "@/components/sound-mixer/types";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FocusSoundMixer() {
  const isMobile = useIsMobile();
  const {
    activeSounds,
    isPlaying,
    loadingSounds,
    addSound,
    removeSound,
    updateVolume,
    togglePlayback,
    stopPlayback,
  } = useAudioManager();

  const [searchTerm, setSearchTerm] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");

  // Load saved presets
  useEffect(() => {
    const savedPresets = localStorage.getItem("focus-presets");
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const generateAIMix = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateSoundMix(aiPrompt, SOUND_LIBRARY);

      // Clear current sounds
      activeSounds.forEach((sound) => {
        removeSound(sound.id);
      });

      // Add suggested sounds with default volume
      for (const suggestion of result.suggestions) {
        const sound = SOUND_LIBRARY.find((s) => s.id === suggestion.soundId);
        if (sound) {
          await addSound(sound);
          // Set the suggested volume
          setTimeout(() => {
            updateVolume(suggestion.soundId, suggestion.volume);
          }, 100);
        }
      }

      toast.success("Generated new sound mix!", {
        description: result.description,
      });
    } catch (error) {
      throw error; // Let the AI Generator component handle the error
    } finally {
      setIsGenerating(false);
    }
  };

  const savePreset = () => {
    if (!presetName.trim() || activeSounds.length === 0) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      sounds: activeSounds.map((s) => ({ id: s.id, volume: s.volume })),
      createdAt: new Date(),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem("focus-presets", JSON.stringify(updatedPresets));
    setPresetName("");
  };

  const loadPreset = async (preset: Preset) => {
    // Clear current sounds
    activeSounds.forEach((sound) => {
      removeSound(sound.id);
    });

    // Load preset sounds
    for (const presetSound of preset.sounds) {
      const sound = SOUND_LIBRARY.find((s) => s.id === presetSound.id);
      if (sound) {
        await addSound(sound);
        setTimeout(() => {
          updateVolume(presetSound.id, presetSound.volume);
        }, 100);
      }
    }
  };

  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter((p) => p.id !== presetId);
    setPresets(updatedPresets);
    localStorage.setItem("focus-presets", JSON.stringify(updatedPresets));
  };

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 noise" />

      <div
        className={`relative h-full flex ${
          isMobile ? "flex-col overflow-auto p-0" : "flex-row-reverse p-6"
        } gap-4`}
      >
        <div
          className={`glass-effect-strong rounded-xl flex flex-col gap-6 ${
            isMobile ? "min-h-[50vh] rounded-none" : "h-full"
          } ${isMobile ? "w-full" : "w-1/4"} ${isMobile ? "p-4" : "p-6"}`}
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary glow-text">
              MyTunes
            </h1>
            <p className="text-sm text-muted-foreground">Sound Mixer</p>
          </div>

          <PlaybackControls
            isPlaying={isPlaying}
            hasActiveSounds={activeSounds.length > 0}
            onTogglePlay={togglePlayback}
            onStop={stopPlayback}
          />

          <ActiveSoundsMixer
            activeSounds={activeSounds}
            presetName={presetName}
            onPresetNameChange={setPresetName}
            onSavePreset={savePreset}
            onUpdateVolume={updateVolume}
            onRemoveSound={removeSound}
          />
        </div>

        <Tabs
          defaultValue="library"
          className={`glass-effect rounded-xl flex flex-col gap-6 ${
            isMobile ? "min-h-[50vh] rounded-none" : "h-full"
          } ${isMobile ? "w-full" : "w-3/4"} ${isMobile ? "p-4" : "p-6"}`}
        >
          <TabsList
            className={`grid ${
              isMobile ? "w-full" : "w-fit"
            } grid-cols-3 rounded-lg bg-secondary`}
          >
            <TabsTrigger value="library">Sound Library</TabsTrigger>
            <TabsTrigger value="ai">AI Generator</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent
            value="library"
            className={`${isMobile ? "" : "flex-1 overflow-auto"}`}
          >
            <SoundLibrary
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddSound={addSound}
              loadingSounds={loadingSounds}
              activeSoundIds={new Set(activeSounds.map((s) => s.id))}
            />
          </TabsContent>

          <TabsContent
            value="ai"
            className={`${isMobile ? "" : "flex-1 overflow-auto"}`}
          >
            <AIGenerator
              aiPrompt={aiPrompt}
              isGenerating={isGenerating}
              onPromptChange={setAiPrompt}
              onGenerate={generateAIMix}
            />
          </TabsContent>

          <TabsContent
            value="presets"
            className={`${isMobile ? "" : "flex-1 overflow-auto"}`}
          >
            <PresetManager
              presets={presets}
              onLoadPreset={loadPreset}
              onDeletePreset={deletePreset}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
