
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";




export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export const expenseCategories = [
    {
      "value": 0, 
      "label": "Alimentos y Bebidas",
      "textColor": "text-red-500",
      "bgColor": "bg-red-100"
    },
    {
      "value": 1, 
      "label": "Compras",
      "textColor": "text-blue-500",
      "bgColor": "bg-blue-100"
    },
    {
      "value": 2, 
      "label": "Hogar",
      "textColor": "text-yellow-500",
      "bgColor": "bg-yellow-100"
    },
    {
      "value": 3, 
      "label": "Transporte",
      "textColor": "text-green-500",
      "bgColor": "bg-green-100"
    },
    {
      "value": 4, 
      "label": "Entretenimiento",
      "textColor": "text-purple-500",
      "bgColor": "bg-purple-100"
    },
    {
      "value": 5, 
      "label": "Comunicación",
      "textColor": "text-orange-500",
      "bgColor": "bg-orange-100"
    },
    {
      "value": 6, 
      "label": "Gastos Financieros",
      "textColor": "text-cyan-500",
      "bgColor": "bg-cyan-100"
    },
]