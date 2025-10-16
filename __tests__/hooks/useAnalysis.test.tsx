import { renderHook, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { useAnalysis } from '../../src/hooks/useAnalysis'
import { EdgeFunctionService } from '../../src/services/edgeFunctions'

// Mock dependencies
jest.mock('../../src/services/edgeFunctions')
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

describe('useAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAnalysis())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should analyze note successfully', async () => {
    const mockAnalysis = {
      sentiment: 'positive',
      readability: 85,
      wordCount: 250,
    }

    ;(EdgeFunctionService.analyzeNote as jest.Mock).mockResolvedValue(mockAnalysis)

    const { result } = renderHook(() => useAnalysis())

    let analysisResult
    await waitFor(async () => {
      analysisResult = await result.current.analyzeNote('note1', 'Test content')
    })

    expect(analysisResult).toEqual(mockAnalysis)
    expect(EdgeFunctionService.analyzeNote).toHaveBeenCalledWith('note1', 'Test content')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle analyze note error', async () => {
    const error = new Error('Analysis failed')
    ;(EdgeFunctionService.analyzeNote as jest.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useAnalysis())

    await expect(
      result.current.analyzeNote('note1', 'Test content')
    ).rejects.toThrow('Analysis failed')

    await waitFor(() => {
      expect(result.current.error).toBe('Analysis failed')
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to analyze note')
    })
  })

  it('should generate summary successfully', async () => {
    const mockSummary = {
      summary: 'This is a summary of the note',
      keyPoints: ['Point 1', 'Point 2'],
    }

    ;(EdgeFunctionService.generateSummary as jest.Mock).mockResolvedValue(mockSummary)

    const { result } = renderHook(() => useAnalysis())

    let summaryResult
    await waitFor(async () => {
      summaryResult = await result.current.generateSummary('note1', 'Long content here')
    })

    expect(summaryResult).toEqual(mockSummary)
    expect(EdgeFunctionService.generateSummary).toHaveBeenCalledWith('note1', 'Long content here')
  })

  it('should extract keywords successfully', async () => {
    const mockKeywords = {
      keywords: ['react', 'testing', 'hooks'],
    }

    ;(EdgeFunctionService.extractKeywords as jest.Mock).mockResolvedValue(mockKeywords)

    const { result } = renderHook(() => useAnalysis())

    let keywordsResult
    await waitFor(async () => {
      keywordsResult = await result.current.extractKeywords('React testing with hooks')
    })

    expect(keywordsResult).toEqual(mockKeywords)
    expect(EdgeFunctionService.extractKeywords).toHaveBeenCalledWith('React testing with hooks')
  })

  it('should suggest tags successfully', async () => {
    const mockTags = {
      tags: ['development', 'testing', 'react-native'],
    }

    ;(EdgeFunctionService.suggestTags as jest.Mock).mockResolvedValue(mockTags)

    const { result } = renderHook(() => useAnalysis())

    let tagsResult
    await waitFor(async () => {
      tagsResult = await result.current.suggestTags('React Native development and testing')
    })

    expect(tagsResult).toEqual(mockTags)
    expect(EdgeFunctionService.suggestTags).toHaveBeenCalledWith('React Native development and testing')
  })

  it('should find similar notes successfully', async () => {
    const mockSimilarNotes = {
      similar: [
        { id: 'note2', similarity: 0.85, title: 'Similar Note 1' },
        { id: 'note3', similarity: 0.72, title: 'Similar Note 2' },
      ],
    }

    ;(EdgeFunctionService.findSimilarNotes as jest.Mock).mockResolvedValue(mockSimilarNotes)

    const { result } = renderHook(() => useAnalysis())

    let similarResult
    await waitFor(async () => {
      similarResult = await result.current.findSimilarNotes('note1', 'Content to match')
    })

    expect(similarResult).toEqual(mockSimilarNotes)
    expect(EdgeFunctionService.findSimilarNotes).toHaveBeenCalledWith('note1', 'Content to match')
  })

  it('should batch process notes successfully', async () => {
    const mockBatchResult = {
      processed: 5,
      failed: 0,
      results: ['result1', 'result2', 'result3'],
    }

    ;(EdgeFunctionService.batchProcessNotes as jest.Mock).mockResolvedValue(mockBatchResult)

    const { result } = renderHook(() => useAnalysis())

    const noteIds = ['note1', 'note2', 'note3']
    let batchResult
    await waitFor(async () => {
      batchResult = await result.current.batchProcessNotes(noteIds, 'analyze')
    })

    expect(batchResult).toEqual(mockBatchResult)
    expect(EdgeFunctionService.batchProcessNotes).toHaveBeenCalledWith(noteIds, 'analyze')
  })

  it('should handle batch processing error', async () => {
    const error = new Error('Batch processing failed')
    ;(EdgeFunctionService.batchProcessNotes as jest.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useAnalysis())

    await expect(
      result.current.batchProcessNotes(['note1', 'note2'], 'analyze')
    ).rejects.toThrow('Batch processing failed')

    await waitFor(() => {
      expect(result.current.error).toBe('Batch processing failed')
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to process notes')
    })
  })

  it('should set loading state during operations', async () => {
    ;(EdgeFunctionService.analyzeNote as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100))
    )

    const { result } = renderHook(() => useAnalysis())

    expect(result.current.loading).toBe(false)

    const promise = result.current.analyzeNote('note1', 'content')

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await promise

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})

