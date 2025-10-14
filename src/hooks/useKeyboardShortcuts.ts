import { useEffect, useCallback } from 'react'
import { BackHandler, Platform } from 'react-native'

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

  // Handle hardware back button (Android)
  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') return

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => backHandler.remove()
  }, [handleBackPress, enabled])

  // Register shortcuts
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    // In React Native, keyboard shortcuts are primarily handled via hardware back button
    // For custom shortcuts, you would need to implement them in your component
    console.log('Registering shortcut:', shortcut)
  }, [])

  // Unregister shortcuts
  const unregisterShortcut = useCallback((key: string) => {
    // In React Native, keyboard shortcuts are primarily handled via hardware back button
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