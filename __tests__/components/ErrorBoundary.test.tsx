import React from 'react'
import { render } from '@testing-library/react-native'
import { ErrorBoundary } from '../../src/components/ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Component that doesn't throw
const NoError = () => <div>No error</div>

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    )
    
    // Check if the component renders without error
    expect(getByText('No error')).toBeTruthy()
  })

  it('renders error fallback when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Check if error message is displayed
    expect(getByText('Something went wrong')).toBeTruthy()
  })

  it('renders custom error message when provided', () => {
    const customMessage = 'Custom error message'
    const { getByText } = render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText(customMessage)).toBeTruthy()
  })

  it('renders custom error component when provided', () => {
    const CustomErrorComponent = () => <div>Custom error component</div>
    const { getByText } = render(
      <ErrorBoundary fallback={<CustomErrorComponent />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Custom error component')).toBeTruthy()
  })

  it('handles multiple errors', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong.')).toBeTruthy()
    
    // Rerender with no error
    rerender(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    )
    
    expect(getByText('No error')).toBeTruthy()
  })

  it('logs error to console', () => {
    const consoleSpy = jest.spyOn(console, 'error')
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('handles error in nested components', () => {
    const NestedComponent = () => (
      <div>
        <div>Outer component</div>
        <ThrowError shouldThrow={true} />
      </div>
    )
    
    const { getByText } = render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong.')).toBeTruthy()
  })

  it('handles error in deeply nested components', () => {
    const DeepNestedComponent = () => (
      <div>
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      </div>
    )
    
    const { getByText } = render(
      <ErrorBoundary>
        <DeepNestedComponent />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong.')).toBeTruthy()
  })

  it('handles error in multiple children', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <NoError />
        <ThrowError shouldThrow={true} />
        <NoError />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong.')).toBeTruthy()
  })

  it('handles error in conditional rendering', () => {
    const ConditionalComponent = ({ showError }: { showError: boolean }) => (
      <div>
        {showError ? <ThrowError shouldThrow={true} /> : <NoError />}
      </div>
    )
    
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ConditionalComponent showError={false} />
      </ErrorBoundary>
    )
    
    expect(getByText('No error')).toBeTruthy()
    
    rerender(
      <ErrorBoundary>
        <ConditionalComponent showError={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong.')).toBeTruthy()
  })
})
