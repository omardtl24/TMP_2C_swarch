"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { format, addMonths, subMonths } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"


// Datos de ejemplo para eventos
const eventos = [
	{ fecha: new Date(2025, 7, 1), tipo: "importante" }, // 1 de agosto - naranja
	{ fecha: new Date(2025, 7, 15), tipo: "reunion" }, // 15 de agosto - morado
	{ fecha: new Date(2025, 7, 26), tipo: "reunion" }, // 26 de agosto - morado
]

export function CustomCalendar() {
	const [date, setDate] = React.useState<Date>(new Date())
	const [month, setMonth] = React.useState<Date>(new Date())

	// Función para verificar si un día tiene eventos
	const tieneEvento = (day: Date) => {
		const dayDate = day

		return eventos.find(
			(evento) =>
				evento.fecha.getDate() === dayDate.getDate() &&
				evento.fecha.getMonth() === dayDate.getMonth() &&
				evento.fecha.getFullYear() === dayDate.getFullYear(),
		)
	}

	// Función para manejar el clic en un día
	const handleDayClick = (day: Date) => {
		const dayDate = day
		const evento = tieneEvento(dayDate)

		if (evento) {
			alert(`Tienes un evento ${evento.tipo} para el ${format(dayDate, "dd/MM/yyyy")}`)
		} else {
			alert(`No tienes eventos para el ${format(dayDate, "dd/MM/yyyy")}`)
		}

	}

	// Función para navegar al mes anterior
	const prevMonth = () => {
		setMonth(subMonths(month, 1))
	}

	// Función para navegar al mes siguiente
	const nextMonth = () => {
		setMonth(addMonths(month, 1))
	}

	// Función para crear un nuevo evento
	const crearEvento = () => {
		alert("Crear nuevo evento")
	}

	return (
		<div className="w-full max-w-md rounded-2xl bg-linear-to-b from-5% from-primary-60/90 to-[#ff9fd8]/70 to-70% px-2 py-4 md:p-6 shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<CalendarIcon className="h-6 w-6 text-white" />
					<h2 className="text-xl font-bold text-white">Calendario</h2>
				</div>
				<Button
					onClick={crearEvento}
					className="flex items-center gap-2 rounded-md border border-yellow-300 bg-transparent px-4 py-2 text-yellow-300 hover:text-orange-400 hover:bg-orange-200/90"
				>
					<CalendarIcon className="h-5 w-5" />
					<span>Crear evento</span>
				</Button>
			</div>

			<div className="mb-4 flex items-center justify-between">
				<Button
					onClick={prevMonth}
					variant="ghost"
					className="h-8 w-8 rounded-full bg-purple-300 p-0 text-white hover:bg-purple-500"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Mes anterior</span>
				</Button>
				<h2 className="text-xl font-bold text-white">
					{format(month, "MMMM yyyy", { locale: es })}
				</h2>
				<Button
					onClick={nextMonth}
					variant="ghost"
					className="h-8 w-8 rounded-full bg-purple-300 p-0 text-white hover:bg-purple-500"
				>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Mes siguiente</span>
				</Button>
			</div>

			<Calendar
				mode="single"
				selected={date}
				onSelect={(newDate) => newDate && setDate(newDate)}
				month={month}
				onMonthChange={setMonth}
				className="rounded-md border-0 bg-transparent p-1 md:pd-3"
				locale={es}
				classNames={{
					months: "flex flex-col",
					month: "flex flex-col",
					caption: "hidden", // Hide default caption since we've created a custom one
					nav: "hidden", // Hide default navigation
					table: "w-full border-spacing-1",
					head_row: "flex w-full justify-between mb-1",
					head_cell:
						"text-white text-xs uppercase font-medium w-10 text-center",
					row: "flex w-full justify-between mb-1",
					cell: "relative p-0 text-center [&:has([aria-selected])]:bg-transparent",
					day:
						"h-12 w-12 text-sm p-0 font-normal text-white hover:bg-purple-300 rounded-md",
					day_selected: "bg-transparent text-white",
					day_today: "bg-transparent text-white font-bold",
					day_outside: "text-white opacity-50",
					day_disabled: "text-purple-200 opacity-50",
					day_hidden: "invisible",
				}}
				components={{
					Day: (props) => {
						// Skip rendering if no date
						if (!props.date) return null;
						
						const dayDate = new Date(props.date)
						
						
						if (dayDate.getMonth() !== month.getMonth()) {

							return <div className="size-9 md:size-12"></div>;
						}
						
						const evento = tieneEvento(dayDate)
						const isToday =
							dayDate.getDate() === new Date().getDate() &&
							dayDate.getMonth() === new Date().getMonth() &&
							dayDate.getFullYear() === new Date().getFullYear()

						// Default color
						

						// Create a completely new button with only the props we need
						return (
							<button
								type="button"
								className={cn(
									`flex  size-9 md:size-12 items-end glass-effect border-1 border-white justify-start rounded-sm p-1 text-primary-40 text-xs font-normal aria-selected:opacity-100 hover:bg-yellow-300/50 hover:border-yellow-600 hover:cursor-pointer
									${isToday ? "bg-orange-300/70 border-orange-400 text-orange-600 font-semibold" : ""}
									${evento ? "bg-purple-500/70 border-primary-50 text-white" : ""}
									
									`
								)}
								onClick={(e) => {
									e.preventDefault();
									handleDayClick(dayDate);
								}}
								aria-label={format(dayDate, "d MMMM yyyy")}
							>
								{format(dayDate, "d")}
							</button>
						)
					},
				}}
				// Hide days from other months
				showOutsideDays={false}
				fixedWeeks={true}
				hideHead={false}
			/>
		</div>
	)
}
