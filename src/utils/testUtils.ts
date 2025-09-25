// Test utilities for better testing experience

import { render, RenderOptions } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockNote = {
  id: 'test-note-id',
  user_id: 'test-user-id',
  title: 'Test Note',
  content: 'This is a test note content.',
  tags: ['test', 'example'],
  is_archived: false,
  is_pinned: false,
  folder_id: null,
  word_count: 8,
  reading_time: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockFolder = {
  id: 'test-folder-id',
  user_id: 'test-user-id',
  name: 'Test Folder',
  color: '#3b82f6',
  parent_id: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock functions
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}

export const mockRoute = {
  key: 'test-route',
  name: 'TestScreen',
  params: {},
}

// Async testing utilities
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
}

// Test data factories
export const createMockNotes = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockNote,
    id: `note-${index}`,
    title: `Test Note ${index + 1}`,
    content: `This is test note content ${index + 1}.`,
  }))
}

export const createMockFolders = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockFolder,
    id: `folder-${index}`,
    name: `Test Folder ${index + 1}`,
  }))
}

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = Date.now()
  renderFn()
  const end = Date.now()
  return end - start
}

// Accessibility testing utilities
export const getAccessibilityProps = (component: any) => {
  return {
    accessible: component.props.accessible,
    accessibilityLabel: component.props.accessibilityLabel,
    accessibilityHint: component.props.accessibilityHint,
    accessibilityRole: component.props.accessibilityRole,
  }
}

export * from '@testing-library/react-native'
export { customRender as render }
