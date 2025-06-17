import React from "react";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Cargando..." }: LoadingProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:px-12 md:py-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-50 mb-4"></div>
      <span className="text-lg text-gray-700">{message}</span>
    </div>
  );
}