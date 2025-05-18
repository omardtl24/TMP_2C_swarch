'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

// Create a context to share modal control functions
type ModalContextType = {
  closeModal: () => void
  openModal: () => void
  isOpen: boolean
}

// Create a global context to access the modal externally
const GlobalModalContext = createContext<{
  [key: string]: ModalContextType
}>({})

// Component context for internal use
const ModalContext = createContext<ModalContextType | undefined>(undefined)

// Provider to wrap the application with
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals] = useState<{[key: string]: ModalContextType}>({})
  
  return (
    <GlobalModalContext.Provider value={modals}>
      {children}
    </GlobalModalContext.Provider>
  )
}

// Hook to control a modal from outside
export function useModal(modalId: string) {
  const modals = useContext(GlobalModalContext)
  return modals[modalId] || { 
    openModal: () => console.warn(`Modal ${modalId} not found`), 
    closeModal: () => {}, 
    isOpen: false 
  }
}

// Hook for children to access the close function
export const useModalForm = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalForm must be used within a ModalFormBase')
  }
  return context
}

interface ModalFormBaseProps {
  trigger?: ReactNode // Optional element that triggers the modal
  icono?: ReactNode // Optional element that triggers the modal
  id: string // Required ID to reference this modal
  title: string
  description?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  headerClassName?: string 
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ModalFormBase({
  trigger,
  icono,
  id,
  title,
  description,
  children,
  className,
  contentClassName,
  headerClassName,
  defaultOpen,
  onOpenChange,
}: ModalFormBaseProps) {
  const [open, setOpen] = useState(defaultOpen || false)
  const modals = useContext(GlobalModalContext) 
  
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  // Register this modal with the global context
  if (!modals[id]) {
    modals[id] = { openModal, closeModal, isOpen: open }
  } else {
    modals[id].openModal = openModal
    modals[id].closeModal = closeModal
    modals[id].isOpen = open
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent 
        className={cn("sm:max-w-[500px] glass-effect bg-white/50  border-1 border-primary", contentClassName)}
      >
        <DialogHeader className={headerClassName}>
          <DialogTitle className='text-2xl'>{title}</DialogTitle>
          {icono}
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ModalContext.Provider value={{ closeModal, openModal, isOpen: open }}>
          <div className={cn("mt-4", className)}>
            {children}
          </div>
        </ModalContext.Provider>
      </DialogContent>
    </Dialog>
  )
}

// Example Button component that can be used inside forms to close the modal
export function ModalSubmitButton({ 
  onClick, 
  children, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  onClick?: () => void 
}) {
  const { closeModal } = useModalForm()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.()
    closeModal()
    e.preventDefault() // Prevent form submission if needed 
  }
  
  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}
