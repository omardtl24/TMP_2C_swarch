"use client"

import { useState, useEffect } from "react"
import { UserRound } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

import MenuIcon from "./Icons/MenuIcon"
import CuentasClarasIcon from "./Icons/CuentasClarasIcon"
import routes from "../lib/routes"
import { useSession } from "@/contexts/SessionContext"
import { logout } from "@/lib/actions/authActions"

const Navbar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { session, clearSession } = useSession()

  // Cerrar el menú cuando la pantalla se hace más grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // 768px es el breakpoint 'md' en Tailwind
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <nav className="sticky top-0 right-0 left-0 bg-surface h-16 w-full flex flex-row items-center justify-between px-4 md:px-8 py-2 rounded-b-md shadow-md shadow-primary-80/50 z-50">
      {/* Menu Icon for mobile - hidden on md and up */}
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0 size-8" size={"icon"}>
              {open ? (
                <XIcon className="stroke-primary-50 size-3" size={20} />
              ) : (
                <MenuIcon className="fill-primary-50 w-full h-full size-3" size="xs" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] mx-2 p-2 mt-3 border-none shadow-lg bg-surface rounded-lg">
            <div className="flex flex-col space-y-2 pt-2 pb-3">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === route.path
                      ? "bg-primary-80/20 text-primary"
                      : "text-primary-50 hover:bg-primary-80/10 hover:text-primary transition-colors"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Logo - centered on mobile, left on desktop */}
      <div className=" flex items-center hover:cursor-pointer hover:bg-primary-90 rounded-md transition duration-200">
        <Link className="p-0" href={"/"}>
          <CuentasClarasIcon size="lg" />
        </Link>
      </div>

      {/* Desktop navigation - hidden on mobile, centered on desktop */}
      <div className="hidden md:flex items-center justify-center flex-1">
        <div className="flex space-x-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`text-base font-normal ${
                pathname === route.path ? "text-primary font-bold" : "text-primary-60 hover:text-primary-20 hover:font-semibold transition-colors"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>

      {/* User/Login - always on the right */}
      {session ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-1" size="icon">
              <UserRound className="stroke-primary-50 w-full h-full" size={25} />
              <span className="sr-only">User menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-2 mt-2 border-none shadow-lg bg-surface rounded-lg">
            <div className="flex flex-col space-y-1">
              <Link href="/eventBoard" className="px-3 py-2 rounded-md text-base font-medium text-primary-60 hover:bg-primary-80/10 hover:text-primary transition-colors">
                EventBoard
              </Link>
              <Link href="/personalExpenses" className="px-3 py-2 rounded-md text-base font-medium text-primary-60 hover:bg-primary-80/10 hover:text-primary transition-colors">
                Gastos personales
              </Link>
              <button
                className="px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                onClick={async () => {
                  await logout()
                  clearSession()
                  window.location.href = "/"
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          variant="outline"
          className="border-primary-50 text-primary-50 font-semibold hover:bg-primary-50 hover:text-white"
          onClick={() => window.location.href = "/login"}
        >
          Iniciar sesión
        </Button>
      )}
    </nav>
  )
}

export default Navbar
