import Sounds from "./Sounds"

export default function Dashboard() {
    return (
        <section className="flex flex-col gap-5 w-screen h-screen items-center justify-center">
            <div>
                <h1 className="text-center text-5xl font-semibold">Let&apos;s get you focused.</h1>
            </div>
            <div className="flex flex-row">
                <Sounds soundName={"rain"} />
                <Sounds soundName={"binaural"} />
            </div>
        </section>
    )
}
