import { useState, useEffect, useRef } from "react"
import { Sound, ActiveSound, SOUND_LIBRARY } from "../components/sound-mixer/types"

export function useAudioManager() {
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingSounds, setLoadingSounds] = useState<Set<string>>(new Set())
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  useEffect(() => {
    const initAudioContext = async () => {
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        masterGainRef.current = audioContextRef.current.createGain()
        masterGainRef.current.connect(audioContextRef.current.destination)
      }
    }

    initAudioContext()

    return () => {
      activeSounds.forEach((sound) => {
        sound.audio.pause()
        sound.audio.src = ""
        sound.audio.load()
      })

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch((error) => {
          console.warn("Error closing AudioContext:", error)
        })
      }
    }
  }, [])

  const setupWebAudio = async (audio: HTMLAudioElement) => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audio.volume = 0.5
      return { audio, volume: 50 }
    }

    try {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }

      const source = audioContextRef.current.createMediaElementSource(audio)
      const gainNode = audioContextRef.current.createGain()
      gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
      source.connect(gainNode).connect(masterGainRef.current!)
      return { gainNode, volume: 50 }
    } catch (error) {
      console.error("Error setting up audio context:", error)
      audio.volume = 0.5
      return { audio, volume: 50 }
    }
  }

  const addSound = async (sound: Sound) => {
    if (activeSounds.find((s) => s.id === sound.id)) return

    setLoadingSounds((prev) => new Set(prev).add(sound.id))
    try {
      let audio: HTMLAudioElement
      const cachedAudio = audioCacheRef.current.get(sound.id)

      if (!cachedAudio) {
        audio = new Audio(sound.url)
        audio.loop = true
        audio.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          audio.addEventListener("canplaythrough", resolve, { once: true })
          audio.addEventListener("error", reject, { once: true })
          audio.load()
        }).catch((error) => {
          console.warn(`Using fallback for ${sound.name}:`, error)
        })

        audioCacheRef.current.set(sound.id, audio.cloneNode(true) as HTMLAudioElement)
      } else {
        audio = cachedAudio.cloneNode(true) as HTMLAudioElement
      }

      const { gainNode, volume } = await setupWebAudio(audio)

      const newSound: ActiveSound = {
        id: sound.id,
        name: sound.name,
        volume,
        audio,
        gainNode,
      }

      setActiveSounds((prev) => [...prev, newSound])

      if (isPlaying) {
        try {
          await audio.play()
        } catch (error) {
          console.error(`Error playing ${sound.name}:`, error)
        }
      }
    } finally {
      setLoadingSounds((prev) => {
        const next = new Set(prev)
        next.delete(sound.id)
        return next
      })
    }
  }

  const removeSound = (soundId: string) => {
    const sound = activeSounds.find((s) => s.id === soundId)
    if (sound) {
      sound.audio.pause()
      sound.audio.currentTime = 0
      sound.audio.src = ""
      sound.audio.load()
    }
    setActiveSounds((prev) => prev.filter((s) => s.id !== soundId))
  }

  const updateVolume = (soundId: string, volume: number) => {
    setActiveSounds((prev) =>
      prev.map((sound) => {
        if (sound.id === soundId) {
          if (sound.gainNode && audioContextRef.current?.state === "running") {
            try {
              sound.gainNode.gain.linearRampToValueAtTime(
                volume / 100,
                audioContextRef.current.currentTime + 0.1
              )
            } catch (error) {
              console.error("Error updating gain volume:", error)
              sound.audio.volume = volume / 100
            }
          } else {
            sound.audio.volume = volume / 100
          }
          return { ...sound, volume }
        }
        return sound
      })
    )
  }

  const togglePlayback = async () => {
    if (activeSounds.length === 0) return

    try {
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume()
      }

      if (isPlaying) {
        activeSounds.forEach((sound) => {
          sound.audio.pause()
        })
        setIsPlaying(false)
      } else {
        const playPromises = activeSounds.map(async (sound) => {
          try {
            await sound.audio.play()
          } catch (error) {
            console.error(`Error playing ${sound.name}:`, error)
          }
        })
        await Promise.allSettled(playPromises)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error in playback toggle:", error)
    }
  }

  const stopPlayback = () => {
    activeSounds.forEach((sound) => {
      try {
        sound.audio.pause()
        sound.audio.currentTime = 0
      } catch (error) {
        console.error(`Error stopping ${sound.name}:`, error)
      }
    })
    setIsPlaying(false)
  }

  const applyMix = async (mix: { soundId: string; volume: number }[]) => {
    // Stop current playback
    stopPlayback()
    
    // Remove all current sounds
    activeSounds.forEach((sound) => removeSound(sound.id))

    // Add new sounds with specified volumes
    for (const { soundId, volume } of mix) {
      const sound = SOUND_LIBRARY.find((s: Sound) => s.id === soundId)
      if (sound) {
        await addSound(sound)
        updateVolume(soundId, volume)
      }
    }
  }

  return {
    activeSounds,
    isPlaying,
    loadingSounds,
    addSound,
    removeSound,
    updateVolume,
    togglePlayback,
    stopPlayback,
    applyMix,
  }
} 