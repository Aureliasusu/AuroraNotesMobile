import { EdgeFunctionService } from '../../src/services/edgeFunctions'
import { supabase } from '../../src/lib/supabase'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}))

describe('EdgeFunctionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('analyzeNote', () => {
    it('should analyze note successfully', async () => {
      const mockData = {
        sentiment: 'positive',
        readability: 85,
        wordCount: 250,
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await EdgeFunctionService.analyzeNote('note1', 'Test content')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('analyze-content', {
        body: {
          note_id: 'note1',
          content: 'Test content',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when analysis fails', async () => {
      const mockError = { message: 'Analysis failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.analyzeNote('note1', 'Test content')
      ).rejects.toThrow('Analysis failed: Analysis failed')
    })
  })

  describe('generateSummary', () => {
    it('should generate summary successfully', async () => {
      const mockData = {
        summary: 'This is a summary',
        keyPoints: ['Point 1', 'Point 2'],
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await EdgeFunctionService.generateSummary('note1', 'Long content')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-summary', {
        body: {
          note_id: 'note1',
          content: 'Long content',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when summary generation fails', async () => {
      const mockError = { message: 'Generation failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.generateSummary('note1', 'Content')
      ).rejects.toThrow('Summary generation failed: Generation failed')
    })
  })

  describe('extractKeywords', () => {
    it('should extract keywords successfully', async () => {
      const mockData = {
        keywords: ['react', 'testing', 'hooks'],
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await EdgeFunctionService.extractKeywords('React testing content')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('extract-keywords', {
        body: {
          content: 'React testing content',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when keyword extraction fails', async () => {
      const mockError = { message: 'Extraction failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.extractKeywords('Content')
      ).rejects.toThrow('Keyword extraction failed: Extraction failed')
    })
  })

  describe('suggestTags', () => {
    it('should suggest tags successfully', async () => {
      const mockData = {
        tags: ['development', 'testing', 'react-native'],
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await EdgeFunctionService.suggestTags('React Native development')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('suggest-tags', {
        body: {
          content: 'React Native development',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when tag suggestion fails', async () => {
      const mockError = { message: 'Suggestion failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.suggestTags('Content')
      ).rejects.toThrow('Tag suggestion failed: Suggestion failed')
    })
  })

  describe('findSimilarNotes', () => {
    it('should find similar notes successfully', async () => {
      const mockData = {
        similar: [
          { id: 'note2', similarity: 0.85, title: 'Similar Note 1' },
          { id: 'note3', similarity: 0.72, title: 'Similar Note 2' },
        ],
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const result = await EdgeFunctionService.findSimilarNotes('note1', 'Content to match')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('find-similar-notes', {
        body: {
          note_id: 'note1',
          content: 'Content to match',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when finding similar notes fails', async () => {
      const mockError = { message: 'Search failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.findSimilarNotes('note1', 'Content')
      ).rejects.toThrow('Similar notes search failed: Search failed')
    })
  })

  describe('batchProcessNotes', () => {
    it('should batch process notes successfully', async () => {
      const mockData = {
        processed: 5,
        failed: 0,
        results: ['result1', 'result2', 'result3'],
      }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      })

      const noteIds = ['note1', 'note2', 'note3']
      const result = await EdgeFunctionService.batchProcessNotes(noteIds, 'analyze')

      expect(supabase.functions.invoke).toHaveBeenCalledWith('batch-process', {
        body: {
          note_ids: noteIds,
          operation: 'analyze',
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error when batch processing fails', async () => {
      const mockError = { message: 'Batch failed' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.batchProcessNotes(['note1'], 'analyze')
      ).rejects.toThrow('Batch processing failed: Batch failed')
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error')

      ;(supabase.functions.invoke as jest.Mock).mockRejectedValue(networkError)

      await expect(
        EdgeFunctionService.analyzeNote('note1', 'Content')
      ).rejects.toThrow('Network error')
    })

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockError = { message: 'Test error' }

      ;(supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(
        EdgeFunctionService.analyzeNote('note1', 'Content')
      ).rejects.toThrow()

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})

