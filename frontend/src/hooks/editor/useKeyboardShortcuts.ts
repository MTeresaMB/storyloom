import { useCallback, useEffect } from 'react'
import type { KeyboardShortcut } from '../../types/ui'

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!event.ctrlKey === !!shortcut.ctrlKey
      const shiftMatch = !!event.shiftKey === !!shortcut.shiftKey
      const altMatch = !!event.altKey === !!shortcut.altKey

      return keyMatch && ctrlMatch && shiftMatch && altMatch
    })

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault()
      }
      matchingShortcut.action()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

export function useEditorShortcuts({
  onSave,
  onToggleEdit
}: {
  onSave: () => void
  onToggleEdit: () => void
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrlKey: true,
      action: onSave,
      preventDefault: true,
      description: 'Save'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: onToggleEdit,
      preventDefault: true,
      description: 'Toggle Edit'
    }
  ]

  useKeyboardShortcuts(shortcuts)
}
