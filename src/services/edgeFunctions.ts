import { supabase } from '../lib/supabase'

// Service for calling Supabase edge functions
export class EdgeFunctionService {
  // Analyze note
  static async analyzeNote(noteId: string, content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: {
          note_id: noteId,
          content: content,
        },
      })

      if (error) {
        throw new Error(`Analysis failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to analyze note', error)
      throw error
    }
  }

  // Generate summary
  static async generateSummary(noteId: string, content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          note_id: noteId,
          content: content,
        },
      })

      if (error) {
        throw new Error(`Summary generation failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to generate summary', error)
      throw error
    }
  }

  // Extract keywords
  static async extractKeywords(content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('extract-keywords', {
        body: {
          content: content,
        },
      })

      if (error) {
        throw new Error(`Keyword extraction failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to extract keywords', error)
      throw error
    }
  }

  // Suggest tags
  static async suggestTags(content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('suggest-tags', {
        body: {
          content: content,
        },
      })

      if (error) {
        throw new Error(`Tag suggestion failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to suggest tags', error)
      throw error
    }
  }

  // Find similar notes
  static async findSimilarNotes(noteId: string, content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('find-similar-notes', {
        body: {
          note_id: noteId,
          content: content,
        },
      })

      if (error) {
        throw new Error(`Similar notes search failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to find similar notes', error)
      throw error
    }
  }

  // Batch process notes
  static async batchProcessNotes(noteIds: string[], operation: string) {
    try {
      const { data, error } = await supabase.functions.invoke('batch-process-notes', {
        body: {
          note_ids: noteIds,
          operation: operation,
        },
      })

      if (error) {
        throw new Error(`Batch processing failed: ${error.message}`)
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to batch process notes', error)
      throw error
    }
  }
}