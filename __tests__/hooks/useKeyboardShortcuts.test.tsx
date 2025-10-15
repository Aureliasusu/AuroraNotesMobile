import { renderHook } from '@testing-library/react-native'
import { useKeyboardShortcuts } from '../../src/hooks/useKeyboardShortcuts'

// Mock BackHandler directly
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

jest.mock('react-native', () => {
  const actualRN = jest.requireActual('react-native')
  
  return Object.setPrototypeOf(
    {
      BackHandler: {
        addEventListener: (...args: any[]) => mockAddEventListener(...args),
        removeEventListener: (...args: any[]) => mockRemoveEventListener(...args),
      },
      Platform: {
        ...actualRN.Platform,
        OS: 'android',
      },
    },
    actualRN
  )
})

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAddEventListener.mockReturnValue({ remove: jest.fn() })
  })

  it('should register hardware back button listener when enabled', () => {
    const mockAction = jest.fn()
    const shortcuts = [
      { key: 'back', action: mockAction, description: 'Go back' },
    ]

    renderHook(() => useKeyboardShortcuts({ shortcuts, enabled: true }))

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    )
  })

  it('should not register listener when disabled', () => {
    const mockAction = jest.fn()
    const shortcuts = [
      { key: 'back', action: mockAction, description: 'Go back' },
    ]

    renderHook(() => useKeyboardShortcuts({ shortcuts, enabled: false }))

    expect(mockAddEventListener).not.toHaveBeenCalled()
  })

  it('should execute back shortcut action when back button is pressed', () => {
    const mockAction = jest.fn()
    const shortcuts = [
      { key: 'back', action: mockAction, description: 'Go back' },
    ]

    let backPressHandler: (() => boolean) | undefined

    mockAddEventListener.mockImplementation(
      (event: string, handler: () => boolean) => {
        if (event === 'hardwareBackPress') {
          backPressHandler = handler
        }
        return { remove: jest.fn() }
      }
    )

    renderHook(() => useKeyboardShortcuts({ shortcuts, enabled: true }))

    // Simulate back button press
    const result = backPressHandler?.()

    expect(mockAction).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should return false when no back shortcut is defined', () => {
    const shortcuts = [
      { key: 'save', action: jest.fn(), description: 'Save' },
    ]

    let backPressHandler: (() => boolean) | undefined

    mockAddEventListener.mockImplementation(
      (event: string, handler: () => boolean) => {
        if (event === 'hardwareBackPress') {
          backPressHandler = handler
        }
        return { remove: jest.fn() }
      }
    )

    renderHook(() => useKeyboardShortcuts({ shortcuts, enabled: true }))

    // Simulate back button press
    const result = backPressHandler?.()

    expect(result).toBe(false)
  })

  it('should clean up listener on unmount', () => {
    const mockRemove = jest.fn()
    mockAddEventListener.mockReturnValue({
      remove: mockRemove,
    })

    const shortcuts = [
      { key: 'back', action: jest.fn(), description: 'Go back' },
    ]

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ shortcuts, enabled: true })
    )

    unmount()

    expect(mockRemove).toHaveBeenCalled()
  })

  it('should provide getShortcutHelp function', () => {
    const shortcuts = [
      { key: 'back', action: jest.fn(), description: 'Go back' },
      { key: 'save', action: jest.fn(), description: 'Save note' },
    ]

    const { result } = renderHook(() =>
      useKeyboardShortcuts({ shortcuts, enabled: true })
    )

    const help = result.current.getShortcutHelp()

    expect(help).toEqual([
      { key: 'back', description: 'Go back' },
      { key: 'save', description: 'Save note' },
    ])
  })
})

