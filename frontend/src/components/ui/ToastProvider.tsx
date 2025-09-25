import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Toast = {
  id: string
  title?: string
  message: string
  variant?: 'default' | 'success' | 'error'
}

type ToastContextValue = {
  toasts: Toast[]
  show: (message: string, opts?: { title?: string; variant?: Toast['variant']; timeoutMs?: number }) => void
  success: (message: string, opts?: { title?: string; timeoutMs?: number }) => void
  error: (message: string, opts?: { title?: string; timeoutMs?: number }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback((message: string, opts?: { title?: string; variant?: Toast['variant']; timeoutMs?: number }) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, title: opts?.title, variant: opts?.variant ?? 'default' }
    setToasts(prev => [...prev, toast])
    const timeout = opts?.timeoutMs ?? 3000
    if (timeout > 0) setTimeout(() => dismiss(id), timeout)
  }, [dismiss])

  const success = useCallback((message: string, opts?: { title?: string; timeoutMs?: number }) => {
    show(message, { title: opts?.title, timeoutMs: opts?.timeoutMs, variant: 'success' })
  }, [show])

  const error = useCallback((message: string, opts?: { title?: string; timeoutMs?: number }) => {
    show(message, { title: opts?.title, timeoutMs: opts?.timeoutMs, variant: 'error' })
  }, [show])

  const value = useMemo<ToastContextValue>(() => ({ toasts, show, success, error, dismiss }), [toasts, show, success, error, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`min-w-[240px] max-w-[360px] rounded-md shadow px-4 py-3 text-sm bg-white border ${t.variant === 'success' ? 'border-green-200' : t.variant === 'error' ? 'border-red-200' : 'border-gray-200'
            }`}>
            {t.title && <div className="font-medium mb-1">{t.title}</div>}
            <div>{t.message}</div>
            <button className="absolute top-1 right-2 text-gray-400 hover:text-gray-600" onClick={() => dismiss(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


