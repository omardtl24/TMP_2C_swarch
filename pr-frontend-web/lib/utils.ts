import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";




export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export const expenseCategories = [
    {
      "value": 0, 
      "label": "Comida y Bebida",
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
      "label": "Comunicacion",
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

export function mapExpenseLabelToEnum(label: string): string {
  switch (label) {
    case "Comida y Bebida":
      return "COMIDA_Y_BEBIDA";
    case "Compras":
      return "COMPRAS";
    case "Hogar":
      return "HOGAR";
    case "Transporte":
      return "TRANSPORTE";
    case "Entretenimiento":
      return "ENTRETENIMIENTO";
    case "Comunicacion":
      return "COMUNICACION";
    case "Gastos Financieros":
      return "GASTOS_FINANCIEROS";
    default:
      return label;
  }
}

export function mapExpenseEnumToLabel(enumValue: string): string {
  switch (enumValue) {
    case "COMIDA_Y_BEBIDA":
      return "Comida y Bebida";
    case "COMPRAS":
      return "Compras";
    case "HOGAR":
      return "Hogar";
    case "TRANSPORTE":
      return "Transporte";
    case "ENTRETENIMIENTO":
      return "Entretenimiento";
    case "COMUNICACION":
      return "Comunicacion";
    case "GASTOS_FINANCIEROS":
      return "Gastos Financieros";
    default:
      return enumValue;
  }
}