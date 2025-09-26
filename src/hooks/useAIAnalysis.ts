import { useState, useCallback } from 'react'
import { edgeFunctionService } from '../services/edgeFunctions'
import { Alert } from 'react-native'

interface Analysis {
  id: string
  note_id: string
  summary: string
  key_points: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  suggested_tags: string[]
  created_at: string
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeNote = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.analyzeNote(noteId, content)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to analyze note')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const generateSummary = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.generateSummary(noteId, content)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Summary generation failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to generate summary')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const extractKeywords = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.extractKeywords(content)
      return result
    } catch (error) {
      console.error('Failed to extract keywords', error)
      Alert.alert('Error', 'Failed to extract keywords')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTags = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.suggestTags(content)
      return result
    } catch (error) {
      console.error('Failed to suggest tags', error)
      Alert.alert('Error', 'Failed to suggest tags')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const findSimilarNotes = useCallback(async (noteId: string, content: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.findSimilarNotes(noteId, content)
      return result
    } catch (error) {
      console.error('Failed to find similar notes', error)
      Alert.alert('Error', 'Failed to find similar notes')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const batchProcessNotes = useCallback(async (noteIds: string[], operation: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await edgeFunctionService.batchProcessNotes(noteIds, operation)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Batch processing failed'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to process notes')
      throw error
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