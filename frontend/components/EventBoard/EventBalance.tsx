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
      <div className="flex-1 md:w-40 bg-[#E9DDFF] p-3 rounded-xl text-center">
        <p className="text-sm text-[#3A0092]">Gasto total</p>
        <p className="font-bold text-[#3A0092]">${formattedTotal}</p>
      </div>
      <div className="flex-1 md:w-40 bg-[#E9DDFF] p-3 rounded-xl text-center">
        <p className="text-sm text-[#3A0092]">Tu Saldo</p>
        <p className={`font-bold ${isPositiveBalance ? "text-green-600" : "text-red-600"}`}>
          {isPositiveBalance ? "+" : ""}
          {formattedBalance}
        </p>
      </div>
    </>
  )
}
