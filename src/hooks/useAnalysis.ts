import { useState, useCallback } from 'react'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { Alert } from 'react-native'


export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeNote = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.analyzeNote(noteId, content)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to analyze note')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const generateSummary = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.generateSummary(noteId, content)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Summary generation failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to generate summary')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const extractKeywords = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.extractKeywords(content)
      return result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to extract keywords', err)
      Alert.alert('Error', 'Failed to extract keywords')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTags = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.suggestTags(content)
      return result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to suggest tags', err)
      Alert.alert('Error', 'Failed to suggest tags')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const findSimilarNotes = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.findSimilarNotes(noteId, content)
      return result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to find similar notes', err)
      Alert.alert('Error', 'Failed to find similar notes')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const batchProcessNotes = useCallback(async (noteIds: string[], operation: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await EdgeFunctionService.batchProcessNotes(noteIds, operation)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch processing failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to process notes')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    analyzeNote,
    generateSummary,
    extractKeywords,
    suggestTags,
    findSimilarNotes,
    batchProcessNotes,
  }
}