/**
 * @format
 */

import React from 'react'
import { render } from '@testing-library/react-native'
import App from '../App'

// Mock all the hooks and stores to avoid Platform issues
jest.mock('../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    initializeAuth: jest.fn(),
  }),
}))

test('renders correctly', () => {
  const { getByTestId } = render(<App />)
  // Basic test to ensure app renders without crashing
  expect(getByTestId).toBeDefined()
})