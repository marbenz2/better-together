export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <p className="uppercase text-2xl font-black">Better together.</p>
      </div>

      <p className="text-2xl lg:text-3xl !leading-tight mx-auto max-w-xl text-center">
        Mache dir und deinen Freunden den gemeinsamen Urlaub leichter.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  )
}
