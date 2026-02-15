

import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@/lib/utils"

type SheetContextValue = {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(
  undefined
)

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Sheet = ({ open = false, onOpenChange, children }: SheetProps) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const useSheetContext = () => {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within a <Sheet> root.")
  }
  return context
}

const SheetTrigger = ({
  children,
}: {
  children: React.ReactElement
}) => {
  const { onOpenChange } = useSheetContext()
  return React.cloneElement(children, {
    onClick: () => onOpenChange?.(true),
  })
}

const SheetClose = ({
  children,
}: {
  children: React.ReactElement
}) => {
  const { onOpenChange } = useSheetContext()
  return React.cloneElement(children, {
    onClick: () => onOpenChange?.(false),
  })
}

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "right"
}

const SheetContent = ({ side = "right", className, children, ...props }: SheetContentProps) => {
  const { open, onOpenChange } = useSheetContext()

  if (typeof document === "undefined" || !open) {
    return null
  }

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col bg-white dark:bg-gray-900 shadow-2xl",
          "w-full max-w-xl sm:max-w-xl", // slightly narrower on desktop
          side === "right" && "right-0 border-l border-gray-200 dark:border-gray-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body
  )
}

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-6 py-4 sticky top-0 z-10",
      className
    )}
    {...props}
  />
)

SheetHeader.displayName = "SheetHeader"

const SheetTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-lg font-semibold text-gray-600 dark:text-white inter", className)}
    {...props}
  />
)

const SheetDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
)

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}


