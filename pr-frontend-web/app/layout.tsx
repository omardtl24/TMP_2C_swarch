import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/contexts/SessionContext";
import { fetchSessionUniversal } from "@/lib/api/sessionHelpers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuentas Claras",
  description: "Proyecto de gestión de gastos personales - Swarch 2C 2025-1S",
  // viewport se mueve a una exportación aparte
};

export const viewport = {
  initialScale: 1,
  width: "device-width",
  height: "device-height",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Precargar la sesión del servidor para hidratar el cliente
  const initialSession = await fetchSessionUniversal(); 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background h-dvh w-dvw relative flex flex-col` }
      >
        <SessionProvider initialSession={initialSession}>
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
