// CustomCalendar.tsx
"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import "react-day-picker/dist/style.css"
import { useModal } from "../ModalFormBase"
import FormCreateEvent from "./FormCreateEvent"

// Tipado de eventos
export interface EventItem {
  date: Date
  name: string
  id: number
}

interface CustomCalendarProps {
  events: EventItem[]
}



const CustomCalendar = ({ events }: CustomCalendarProps) => {
  const [selected, setSelected] = React.useState<Date | undefined>()
  const [month, setMonth] = React.useState<Date>(new Date())

  const { openModal } = useModal('createEvent')


  // Prepare modifiers
  const modifiers = React.useMemo(
    () => ({
      event: events.map(e => e.date),
    }),
    [events]
  )
  const modifiersClassNames = {
    event: 'bg-purple-500/30 border border-purple-500 text-white',
    today: 'bg-orange-500 border border-orange-500 text-white',
    selected: 'ring-2 ring-offset-2 ring-primary',
  }

  const handleCreateEvent = (day: Date | undefined) => {
    if (!day) return
    setSelected(day)
    openModal()
  }

  //Custom caption with correct props
  const CustomNav = () => {

    return (

      <div className="flex items-center justify-center gap-4 w-full px-2">
        <Button
          size="icon"
          variant="ghost"
          className="bg-white/50 text-primary-20 rounded-full hover:bg-primary-40/70 size-7 md:size-9"
          onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
        >
          <ChevronLeft className="h-4 w-4 text-primary-20" />
        </Button>
        <span className="text-white text-xl  font-semibold ">

          {month ? format(month, 'MMMM yyyy', { locale: es }) : ""}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white/50 text-primary-20 rounded-full hover:bg-primary-40/70 size-7 md:size-9 "
          onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
        >
          <ChevronRight className="h-4 w-4 text-primary-20" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md  bg-gradient-to-b from-primary/80 to-pink-200/70 p-4 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-white" />
          <h2 className="text-white text-xl font-bold">Calendario</h2>
        </div>
        <Button variant="outline" className="border-amber-300 bg-transparent text-amber-300 font-semibold hover:bg-amber-400/50 hover:text-white md:w-40 md:h-10 "

          onClick={() => handleCreateEvent(new Date())}>
          <CalendarIcon className="h-4 w-4" />
          Crear evento
        </Button>
      </div>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleCreateEvent}
        month={month}
        onMonthChange={setMonth}
        locale={es}
        showOutsideDays={false}
        fixedWeeks
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}

        //navLayout="around"
        components={{ Nav: CustomNav }}
        classNames={{
          table: 'w-full border-collapse',
          head_row: 'flex justify-between',
          head_cell: 'text-white text-xs w-8 text-center',
          row: 'flex justify-between',
          cell: 'w-8 p-0 text-end ',
          day: 'p-[1px] h-10 w-10  text-xs text-end ',
          today: 'font-bold bg-orange-30/70 text ',
          month_caption: "hidden",
          month_grid: "w-full",
          day_button: "w-full glass-effect hover:bg-yellow-300/60 hover:cursor-pointer rounded-md flex p-1 justify-start items-end  border-1 border-white text-white w-full h-full text-primary-50",
          month: "w-full ",
          months: "gap-1",
          day_selected: "bg-primary-50/70 text-white",
        }}
      />

      <FormCreateEvent
        defaultBeginDate={selected}
        
        />
    </div>
  )
}

export default CustomCalendar
