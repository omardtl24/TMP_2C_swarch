type EventHeaderProps = {
  name: string
  creatorName: string
  code: string
}

export default function EventHeader({ name, creatorName, code }: EventHeaderProps) {
  return (
    <div className="md:max-w-[60%]">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-sm opacity-90">Creado Por: {creatorName}</p>

      <div className="mt-2">
        <span className="inline-block bg-[#5400CC] text-white text-sm px-3 py-1 rounded-full">Código: {code}</span>
      </div>
    </div>
  )
}
