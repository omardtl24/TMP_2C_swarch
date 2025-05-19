import EventBalance from "./EventBalance"

type EventHeaderProps = {
    name: string
    creatorName: string
    code: string
}

  const totalExpense = 10000

  // Mock user balance
  const userBalance = 100000

export default function EventHeader({ name, creatorName, code }: EventHeaderProps) {
    return (
        <div className="w-full h-56 md:52 bg-linear-to-b from-primary-50 to-surface-95  flex flex-col md:flex-row  md:justify-between items-start p-4 pt-6 md:p-12 md:pt-8 rounded-b-lg ">
            <div className="text-white flex flex-col gap-2 flex-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-md font-semibold text-primary-30 ">Creado por: <span className="text-white">{creatorName}</span> </p>
                <p className="inline-block bg-primary-40 text-white text-md px-3 py-1 w-40 rounded-md">Código: <span className="font-bold">{code}</span> </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-between items-center gap-2 w-full md:flex-1 md:flex-col md:gap-2">
              <EventBalance totalExpense={totalExpense} userBalance={userBalance} />
            </div>

        </div>
    )
}
