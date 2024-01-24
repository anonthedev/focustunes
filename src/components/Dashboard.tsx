"use client"

import Sound from "./Sound"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const [soundFiles, setSoundFiles] = useState<String[] | null | undefined>([])

    async function getSounds() {
        await fetch("/api/getSounds")
            .then((data) => data.json())
            .then(resp => setSoundFiles(resp.sounds))
    }

    useEffect(() => {
        document.onkeydown = function (e) {
            if (e.key == " " ||
                e.code == "Space"
            ) {
                const audioEls = document.getElementsByTagName("audio")
                for (let i = 0; i < audioEls.length; i++) {
                    audioEls[i].pause()
                }
            }
        }
    })

    useEffect(() => {
        getSounds()
    }, [])

    return (
        <section className="flex flex-col w-screen h-screen items-center">
            <div className="mt-32 md:mt-24">
                <h1 className="text-center text-5xl font-semibold font-raleway">Let&apos;s get you focused.</h1>
            </div>
            <div className="flex flex-row flex-wrap justify-center px-14 gap-10 mt-32 pb-10 md:flex-col lg:px-10 lg:gap-8 md:mt-24">
                {soundFiles?.map((soundFile, i) => (
                    <Sound key={i} soundName={`${soundFile.slice(0, -5)}`} />
                ))}
            </div>
            <Link target="_blank" href={"/credits"} className="no-underline text-white fixed right-5 top-5 bg-purple-600 font-poppins py-2 px-4 rounded-md">Sound Credits</Link>
            <p className="fixed bottom-5 right-5 font-poppins">Made by <a target="_blank" href={"http://anonthedev.vercel.app"} className="text-purple-500 no-underline">Anon 2.0</a></p>
        </section>
    )
}
