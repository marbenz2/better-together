export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <p className="uppercase font-bold">Better together.</p>
        <h1 className="sr-only">
          Better together. Ausflüge gemeinsam erleben.
        </h1>
      </div>

      <p className="text-2xl lg:text-3xl font-thin !leading-tight mx-auto max-w-xl text-center">
        Mache dir und deiner Familie oder deinen Freunden den gemeinsamen Urlaub
        leichter.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
