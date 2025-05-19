type EventFinancialsProps = {
  totalExpense: number
  userBalance: number
}

export default function EventBalance({ totalExpense, userBalance }: EventFinancialsProps) {
  const formattedTotal = new Intl.NumberFormat("es-CO").format(totalExpense)
  const formattedBalance = new Intl.NumberFormat("es-CO").format(userBalance)
  const isPositiveBalance = userBalance >= 0

  return (
    <>
      <div className="flex-1 md:w-40 border-2 border-white p-3 rounded-xl text-center">
        <p className="text-md text-primary-20 font-bold">Gasto total</p>
        <p className="font-medium text-black ">${formattedTotal}</p>
      </div>
      <div className="flex-1 md:w-40 border-2 border-white p-3 rounded-xl text-center">
        <p className="text-md text-primary-20 font-bold ">Tu Saldo</p>
        <p className={` font-medium ${isPositiveBalance ? "text-green-600" : "text-red-600"}`}>
          {isPositiveBalance ? "+" : ""}
          {formattedBalance}
        </p>
      </div>
    </>
  )
}
