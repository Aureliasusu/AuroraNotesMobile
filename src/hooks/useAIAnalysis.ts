import { useState, useCallback } from 'react';
import { EdgeFunctionService } from '../services/edgeFunctions';
import { Alert } from 'react-native';

interface AIAnalysis {
  id: string;
  note_id: string;
  summary: string;
  key_points: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  created_at: string;
}

interface KeywordSuggestion {
  keyword: string;
  relevance: number;
  category: string;
}

interface TagSuggestion {
  tag: string;
  confidence: number;
  category: string;
}

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyze note
  const analyzeNote = useCallback(async (noteId: string, content: string) => {
    if (!content.trim()) {
      Alert.alert('Error', 'Note content is required for analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await EdgeFunctionService.analyzeNote(noteId, content);
      setAnalysis(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      Alert.alert('Analysis Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate summary
  const generateSummary = useCallback(async (noteId: string, content: string) => {
    if (!content.trim()) {
      Alert.alert('Error', 'Note content is required for summary');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await EdgeFunctionService.generateSummary(noteId, content);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Summary generation failed';
      setError(errorMessage);
      Alert.alert('Summary Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Extract keywords
  const extractKeywords = useCallback(async (content: string): Promise<KeywordSuggestion[]> => {
    if (!content.trim()) {
      return [];
    }

    try {
      const result = await EdgeFunctionService.extractKeywords(content);
      return result.keywords || [];
    } catch (err) {
      console.error('Failed to extract keywords:', err);
      return [];
    }
  }, []);

  // Suggest tags
  const suggestTags = useCallback(async (content: string): Promise<TagSuggestion[]> => {
    if (!content.trim()) {
      return [];
    }

    try {
      const result = await EdgeFunctionService.suggestTags(content);
      return result.tags || [];
    } catch (err) {
      console.error('Failed to suggest tags:', err);
      return [];
    }
  }, []);

  // Find similar notes
  const findSimilarNotes = useCallback(async (noteId: string, content: string) => {
    if (!content.trim()) {
      return [];
    }

    try {
      const result = await EdgeFunctionService.findSimilarNotes(noteId, content);
      return result.similar_notes || [];
    } catch (err) {
      console.error('Failed to find similar notes:', err);
      return [];
    }
  }, []);

  // Batch process notes
  const batchProcessNotes = useCallback(async (noteIds: string[], operation: string) => {
    if (noteIds.length === 0) {
      Alert.alert('Error', 'No notes selected for processing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await EdgeFunctionService.batchProcessNotes(noteIds, operation);
      Alert.alert('Success', `Successfully processed ${noteIds.length} notes`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch processing failed';
      setError(errorMessage);
      Alert.alert('Batch Processing Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear analysis results
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    analyzeNote,
    generateSummary,
    extractKeywords,
    suggestTags,
    findSimilarNotes,
    batchProcessNotes,
    clearAnalysis,
  };
}
