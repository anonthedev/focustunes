export interface Sound {
  id: string
  name: string
  url: string
  tags: string[]
}

export interface ActiveSound {
  id: string
  name: string
  volume: number
  audio: HTMLAudioElement
  gainNode?: GainNode
}

export interface Preset {
  id: string
  name: string
  sounds: { id: string; volume: number }[]
  createdAt: Date
}

export const SOUND_LIBRARY: Sound[] = [
  {
    id: "rain",
    name: "Rain",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//rain.mp3",
    tags: ["rain", "water", "weather", "nature"],
  },
  // { id: "forest", name: "Forest Ambience", url: "/placeholder.mp3", tags: ["forest", "trees", "nature", "wind"] },
  {
    id: "birds",
    name: "Birds Chirping",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//chirping-birds.mp3",
    tags: ["birds", "chirping", "nature", "morning"],
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//ocean-wave.mp3",
    tags: ["ocean", "waves", "water", "beach"],
  },
  {
    id: "fire",
    name: "Crackling Fire",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//crackling-fire.mp3",
    tags: ["fire", "crackling", "cozy", "warmth"],
  },
  {
    id: "thunder",
    name: "Thunder",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//thunder.mp3",
    tags: ["thunder", "storm", "weather", "dramatic"],
  },
  {
    id: "wind",
    name: "Wind",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//wind.mp3",
    tags: ["wind", "breeze", "nature", "calm"],
  },
  // { id: "cafe", name: "Cafe Ambience", url: "/placeholder.mp3", tags: ["cafe", "coffee", "chatter", "urban"] },
  {
    id: "piano",
    name: "Soft Piano",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//soft-piano.mp3",
    tags: ["piano", "music", "peaceful", "melody"],
  },
  {
    id: "brown-noise",
    name: "Brown Noise",
    url: "https://bqommnhjxssessanivzo.supabase.co/storage/v1/object/public/tunes//brown-noise.mp3",
    tags: ["white-noise", "static", "focus", "concentration"],
  },
] 