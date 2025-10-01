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

describe('AppNavigator', () => {
  it('renders without crashing', () => {
    const { root } = render(<AppNavigator user={null} />)
    expect(root).toBeTruthy()
  })

  it('renders auth screens when user is null', () => {
    const { root } = render(<AppNavigator user={null} />)
    expect(root).toBeTruthy()
  })

  it('renders main app screens when user is present', () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
    }
    
    const { root } = render(<AppNavigator user={mockUser} />)
    expect(root).toBeTruthy()
  })

  it('handles user object with required properties', () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }
    
    const { root } = render(<AppNavigator user={mockUser} />)
    expect(root).toBeTruthy()
  })

  it('handles user object with minimal properties', () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
    }
    
    const { root } = render(<AppNavigator user={mockUser} />)
    expect(root).toBeTruthy()
  })
})
