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
		return eventos.find(
			(evento) =>
				evento.fecha.getDate() === day.getDate() &&
				evento.fecha.getMonth() === day.getMonth() &&
				evento.fecha.getFullYear() === day.getFullYear(),
		)
	}

	// Función para manejar el clic en un día
	const handleDayClick = (day: Date) => {
		const evento = tieneEvento(day)
		if (evento) {
			alert(`Tienes un evento ${evento.tipo} para el ${format(day, "dd/MM/yyyy")}`)
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
		<div className="w-full max-w-md rounded-3xl bg-purple-400 p-6 shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<CalendarIcon className="h-6 w-6 text-white" />
					<h2 className="text-xl font-bold text-white">Calendario</h2>
				</div>
				<Button
					onClick={crearEvento}
					className="flex items-center gap-2 rounded-full border border-yellow-300 bg-transparent px-4 py-2 text-yellow-300 hover:bg-purple-500"
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
				className="rounded-md border-0 bg-transparent"
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
						"h-10 w-10 text-sm p-0 font-normal text-white hover:bg-purple-300 rounded-md",
					day_selected: "bg-transparent text-white",
					day_today: "bg-transparent text-white font-bold",
					day_outside: "text-white opacity-50",
					day_disabled: "text-purple-200 opacity-50",
					day_hidden: "invisible",
				}}
				components={{
					Day: ({ date, ...props }) => {
						const evento = tieneEvento(date)
						const isToday =
							date.getDate() === new Date().getDate() &&
							date.getMonth() === new Date().getMonth() &&
							date.getFullYear() === new Date().getFullYear()

						// Default color
						let bgColor = "bg-purple-200"

						// If it's today, use orange
						if (isToday) {
							bgColor = "bg-orange-300"
						}
						// If it has an event and is not today, use purple
						else if (evento) {
							bgColor = "bg-purple-500"
						}

						return (
							<button
								{...props}
								className={cn(
									bgColor,
									"flex h-10 w-10 items-center justify-center rounded-md p-0 text-sm font-normal aria-selected:opacity-100",
								)}
								onClick={() => handleDayClick(date)}
							>
								{format(date, "d")}
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
