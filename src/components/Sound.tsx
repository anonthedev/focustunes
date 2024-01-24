"use client"
import { useEffect, useRef, useState } from "react";
import musicImg from "@/resources/images/music.svg"
import Image from "next/image";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { CiVolumeHigh } from "react-icons/ci";

interface propType {
    soundName: string
}

export default function Sound({ soundName }: propType) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const soundPath = `/sounds/${soundName}.webm`;
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState<number>(0.8)

    useEffect(() => {
        const audio = audioRef.current
        isPlaying ? audio?.play() : audio?.pause()
        audio!.volume = volume
        console.log(audioRef.current?.paused)

        return (() => {
            audio!.volume = 0.8
        })

    }, [isPlaying, volume])

    function capitalizeFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    return (
        <div className="rounded-lg w-64 min-h-72 bg-[#121212] flex flex-col items-center justify-between py-5 px-8 gap-4 ">
            <audio loop ref={audioRef} src={soundPath}></audio>
            <Image src={musicImg} alt="music-logo" width={100} height={100} />
            {audioRef !== null && <div className="flex flex-col items-center gap-4">
                <span className="font-poppins font-medium text-gray-300 text-2xl text-center">{capitalizeFirstLetter(soundName)}</span>
                <div className="flex flex-col items-center gap-4">
                    <button onClick={() => {
                        setIsPlaying(!isPlaying)
                    }}>{!audioRef.current?.paused ? <CiPlay1 size={20} /> : <CiPause1 size={20} />}</button>
                    <div className="flex flex-row items-center gap-3">
                        <CiVolumeHigh size={20} />
                        <input
                            className="h-[2px] accent-purple-600"
                            type="range"
                            value={volume}
                            step="0.1"
                            min="0"
                            max="1"
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
