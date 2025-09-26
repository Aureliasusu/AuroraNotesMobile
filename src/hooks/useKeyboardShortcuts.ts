import { useEffect, useCallback } from 'react'
import { BackHandler } from 'react-native'

interface KeyboardShortcut {
  key: string
  action: () => void
  description: string
}

interface useKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: useKeyboardShortcutsProps) {
  // Handle back button press
  const handleBackPress = useCallback(() => {
    if (!enabled) return false

    // Find shortcut for back action
    const backShortcut = shortcuts.find(shortcut => shortcut.key === 'back')
    if (backShortcut) {
      backShortcut.action()
      return true
    }

    return false
  }, [shortcuts, enabled])

  // Handle hardware back button
  useEffect(() => {
    if (!enabled) return

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => backHandler.remove()
  }, [handleBackPress, enabled])

  // Handle keyboard shortcuts (for web/desktop)
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const shortcut = shortcuts.find(s => s.key === event.key)
    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }, [shortcuts, enabled])

  // Add keyboard event listeners
  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, enabled])

  // Register shortcuts
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    // This would be implemented based on your specific needs
    console.log('Registering shortcut:', shortcut)
  }, [])

  // Unregister shortcuts
  const unregisterShortcut = useCallback((key: string) => {
    // This would be implemented based on your specific needs
    console.log('Unregistering shortcut:', key)
  }, [])

  // Get shortcut help
  const getShortcutHelp = useCallback(() => {
    return shortcuts.map(shortcut => ({
      key: shortcut.key,
      description: shortcut.description,
    }))
  }, [shortcuts])

  return {
    registerShortcut,
    unregisterShortcut,
    getShortcutHelp,
  }
}