import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "comida":
        return "text-red-500"
      case "bebida":
        return "text-green-500"
      case "fruta":
        return "text-orange-400"
      default:
        return "text-gray-500"
    }
  }

  // Function to determine category background
export const getCategoryBg = (category: string) => {
    switch (category.toLowerCase()) {
      case "comida":
        return "bg-red-100"
      case "bebida":
        return "bg-green-100"
      case "fruta":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }