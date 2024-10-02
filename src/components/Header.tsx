import { HeartHandshakeIcon } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <HeartHandshakeIcon className="w-28 h-28 text-[#c940ce]" strokeWidth={1} />
      <h2 className="!leading-tight mx-auto max-w-xl text-center">
        Mache dir und deinen Freunden den gemeinsamen Urlaub leichter.
      </h2>
      <div className="flex gap-8 justify-center items-center">
        <h1 className="uppercase text-3xl font-black">Better together.</h1>
      </div>
    </div>
  )
}
