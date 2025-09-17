import { useEffect, useCallback } from 'react'
import { BackHandler } from 'react-native'

interface KeyboardShortcut {
  key: string
  action: () => void
  description: string
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleBackPress = useCallback(() => {
    if (!enabled) return false

    // Handle Android back button
    // This is a simplified version - in a real app you might want more sophisticated handling
    const backShortcut = shortcuts.find(shortcut => shortcut.key === 'Back')
    if (backShortcut) {
      backShortcut.action()
      return true // Prevent default back behavior
    }
    
    return false // Allow default back behavior
  }, [shortcuts, enabled])

  useEffect(() => {
    if (enabled) {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      return () => subscription.remove()
    }
  }, [handleBackPress, enabled])
}

// Common keyboard shortcuts for note editing (mobile-adapted)
export const createNoteShortcuts = (actions: {
  onBack?: () => void
  onSave?: () => void
  onNewNote?: () => void
  onDeleteNote?: () => void
  onSearch?: () => void
  onToggleTheme?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onBold?: () => void
  onItalic?: () => void
  onUnderline?: () => void
  onFocusSearch?: () => void
}) => {
  const shortcuts: KeyboardShortcut[] = []

  if (actions.onBack) {
    shortcuts.push({
      key: 'Back',
      action: actions.onBack,
      description: 'Go back'
    })
  }

  if (actions.onSave) {
    shortcuts.push({
      key: 'Save',
      action: actions.onSave,
      description: 'Save note'
    })
  }

  if (actions.onNewNote) {
    shortcuts.push({
      key: 'NewNote',
      action: actions.onNewNote,
      description: 'New note'
    })
  }

  if (actions.onDeleteNote) {
    shortcuts.push({
      key: 'DeleteNote',
      action: actions.onDeleteNote,
      description: 'Delete note'
    })
  }

  if (actions.onSearch) {
    shortcuts.push({
      key: 'Search',
      action: actions.onSearch,
      description: 'Open search'
    })
  }

  if (actions.onToggleTheme) {
    shortcuts.push({
      key: 'ToggleTheme',
      action: actions.onToggleTheme,
      description: 'Toggle theme'
    })
  }

  if (actions.onUndo) {
    shortcuts.push({
      key: 'Undo',
      action: actions.onUndo,
      description: 'Undo'
    })
  }

  if (actions.onRedo) {
    shortcuts.push({
      key: 'Redo',
      action: actions.onRedo,
      description: 'Redo'
    })
  }

  if (actions.onBold) {
    shortcuts.push({
      key: 'Bold',
      action: actions.onBold,
      description: 'Bold text'
    })
  }

  if (actions.onItalic) {
    shortcuts.push({
      key: 'Italic',
      action: actions.onItalic,
      description: 'Italic text'
    })
  }

  if (actions.onUnderline) {
    shortcuts.push({
      key: 'Underline',
      action: actions.onUnderline,
      description: 'Underline text'
    })
  }

  if (actions.onFocusSearch) {
    shortcuts.push({
      key: 'FocusSearch',
      action: actions.onFocusSearch,
      description: 'Focus search'
    })
  }

  return shortcuts
}
