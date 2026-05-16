import * as React from "react"

export type ToastVariant = "default" | "destructive"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface ToastState {
  toasts: ToastProps[]
}

type ToastAction =
  | { type: "ADD"; toast: ToastProps }
  | { type: "REMOVE"; id: string }

let count = 0
function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD":
      return { toasts: [...state.toasts, action.toast] }
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) }
    default:
      return state
  }
}

export function toast(props: Omit<ToastProps, "id">) {
  const id = generateId()

  dispatch({ type: "ADD", toast: { ...props, id } })

  setTimeout(() => {
    dispatch({ type: "REMOVE", id })
  }, 4000)

  return id
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
  }
}