import { useToast } from "./use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-2
            ${
              t.variant === "destructive"
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-white border-slate-200 text-slate-900"
            }
          `}
        >
          {t.title && (
            <div className="font-semibold text-sm">{t.title}</div>
          )}
          {t.description && (
            <div className="text-sm opacity-80 mt-0.5">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}