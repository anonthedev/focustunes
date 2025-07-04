"use server";

import { Sound } from "@/components/sound-mixer/types";

export interface AudioMixSettings {
  soundId: string;
  volume: number;
}

export async function mixAudio(
  sounds: AudioMixSettings[],
  soundLibrary: Sound[]
): Promise<string> {
  // Validate all sounds exist in library
  const validSounds = sounds.filter((mix) =>
    soundLibrary.some((sound) => sound.id === mix.soundId)
  );

  if (validSounds.length === 0) {
    throw new Error("No valid sounds provided for mixing");
  }

  // Map sounds to their URLs and settings
  const audioMixData = validSounds.map((mix) => {
    const sound = soundLibrary.find((s) => s.id === mix.soundId)!;
    return {
      url: sound.url,
      volume: mix.volume / 100, // Convert percentage to decimal
    };
  });

  // Return the mix settings for client-side processing
  return JSON.stringify(audioMixData);
} 