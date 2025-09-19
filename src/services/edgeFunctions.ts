import { supabase } from '../lib/supabase';

// Edge Function service for calling Supabase Edge Functions
export class EdgeFunctionService {
  // AI note analysis
  static async analyzeNote(noteId: string, content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-note', {
        body: {
          note_id: noteId,
          content: content,
        },
      });

      if (error) {
        console.error('Error analyzing note:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to analyze note:', error);
      throw error;
    }
  }

  // Generate note summary
  static async generateSummary(noteId: string, content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          note_id: noteId,
          content: content,
        },
      });

      if (error) {
        console.error('Error generating summary:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  }

  // Extract keywords
  static async extractKeywords(content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('extract-keywords', {
        body: {
          content: content,
        },
      });

      if (error) {
        console.error('Error extracting keywords:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to extract keywords:', error);
      throw error;
    }
  }

  // Smart tag suggestions
  static async suggestTags(content: string) {
    try {
      const { data, error } = await supabase.functions.invoke('suggest-tags', {
        body: {
          content: content,
        },
      });

      if (error) {
        console.error('Error suggesting tags:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      throw error;
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
      });

      if (error) {
        console.error('Error finding similar notes:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to find similar notes:', error);
      throw error;
    }
  }

  // Batch process notes
  static async batchProcessNotes(noteIds: string[], operation: string) {
    try {
      const { data, error } = await supabase.functions.invoke('batch-process-notes', {
        body: {
          note_ids: noteIds,
          operation: operation, // 'analyze', 'summarize', 'categorize'
        },
      });

      if (error) {
        console.error('Error batch processing notes:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to batch process notes:', error);
      throw error;
    }
  }
}
