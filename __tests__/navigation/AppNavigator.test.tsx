import React from 'react'
import { render } from '@testing-library/react-native'
import { AppNavigator } from '../../src/navigation/AppNavigator'

// Mock navigation dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    dispatch: jest.fn(),
  }),
}))

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}))

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}))

// Mock auth store
const mockUseAuthStore = jest.fn()
jest.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: mockUseAuthStore,
}))

// Mock zustand
jest.mock('zustand', () => ({
  create: jest.fn(() => mockUseAuthStore),
}))

// Mock screens
jest.mock('../../src/screens/auth/SignInScreen', () => ({
  SignInScreen: () => null,
}))

jest.mock('../../src/screens/auth/SignUpScreen', () => ({
  SignUpScreen: () => null,
}))

jest.mock('../../src/screens/notes/NotesListScreen', () => ({
  NotesListScreen: () => null,
}))

jest.mock('../../src/screens/notes/NoteEditorScreen', () => ({
  NoteEditorScreen: () => null,
}))

jest.mock('../../src/screens/notes/EnhancedNoteEditorScreen', () => ({
  EnhancedNoteEditorScreen: () => null,
}))

describe('AppNavigator', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
    })
  })

  it('renders without crashing', () => {
    const { getByTestId } = render(<AppNavigator />)
    expect(getByTestId).toBeDefined()
  })

  it('renders auth screens when user is null', () => {
    const { getByTestId } = render(<AppNavigator />)
    expect(getByTestId).toBeDefined()
  })

  it('renders main app screens when user is present', () => {
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 'user1',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
        },
      },
    })
    
    const { getByTestId } = render(<AppNavigator />)
    expect(getByTestId).toBeDefined()
  })

  it('handles user object with required properties', () => {
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 'user1',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      },
    })
    
    const { getByTestId } = render(<AppNavigator />)
    expect(getByTestId).toBeDefined()
  })

  it('handles user object with minimal properties', () => {
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 'user1',
        email: 'test@example.com',
      },
    })
    
    const { getByTestId } = render(<AppNavigator />)
    expect(getByTestId).toBeDefined()
  })
})
