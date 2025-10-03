import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'

// Text processing service
export class TextProcessingService {
  private static readonly API_URL = 'https://api.openai.com/v1'
  private static readonly API_KEY = process.env.OPENAI_API_KEY || 'your-api-key'

  // Generate text summary
  static async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `You are a helpful assistant that creates concise summaries. Create a summary of the given text in ${maxLength} characters or less.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('API error:', error)
      Alert.alert('Error', 'Failed to generate summary')
      throw error
    }
  }

  // Extract keywords
  static async extractKeywords(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'You are a helpful assistant that extracts keywords from text. Return only the keywords as a comma-separated list, maximum 10 keywords.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const keywords = data.choices[0].message.content.trim()
      return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    } catch (error) {
      console.error('API error:', error)
      Alert.alert('Error', 'Failed to extract keywords')
      throw error
    }
  }

  // Analyze sentiment
  static async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const response = await fetch(`${this.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'You are a helpful assistant that analyzes sentiment. Return only one word: positive, negative, or neutral.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const sentiment = data.choices[0].message.content.trim().toLowerCase()
      
      if (sentiment.includes('positive')) return 'positive'
      if (sentiment.includes('negative')) return 'negative'
      return 'neutral'
    } catch (error) {
      console.error('API error:', error)
      Alert.alert('Error', 'Failed to analyze sentiment')
      throw error
    }
  }

  // Suggest tags
  static async suggestTags(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'You are a helpful assistant that suggests relevant tags for notes. Return only the tags as a comma-separated list, maximum 5 tags.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 50,
          temperature: 0.5,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const tags = data.choices[0].message.content.trim()
      return tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    } catch (error) {
      console.error('API error:', error)
      Alert.alert('Error', 'Failed to suggest tags')
      throw error
    }
  }
}

// Translation service
export class TranslationService {
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { text, targetLanguage }
      })

      if (error) {
        throw new Error(`Translation failed: ${error.message}`)
      }

      return data.translatedText
    } catch (error) {
      console.error('Translation error:', error)
      Alert.alert('Error', 'Failed to translate text')
      throw error
    }
  }
}

// Weather service
export class WeatherService {
  static async getCurrentWeather(lat: number, lon: number): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { lat, lon }
      })

      if (error) {
        throw new Error(`Weather failed: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Weather error:', error)
      Alert.alert('Error', 'Failed to get weather data')
      throw error
    }
  }
}

// News service
export class NewsService {
  static async getNews(query: string, language: string = 'en'): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-news', {
        body: { query, language }
      })

      if (error) {
        throw new Error(`News failed: ${error.message}`)
      }

      return data.articles
    } catch (error) {
      console.error('News error:', error)
      Alert.alert('Error', 'Failed to get news')
      throw error
    }
  }
}

// Combined service for batch processing
export class BatchProcessingService {
  static async processText(text: string): Promise<{
    summary: string
    keywords: string[]
    sentiment: 'positive' | 'negative' | 'neutral'
    tags: string[]
  }> {
    try {
      const [summary, keywords, sentiment, tags] = await Promise.all([
        OpenAIService.generateSummary(text),
        OpenAIService.extractKeywords(text),
        OpenAIService.analyzeSentiment(text),
        OpenAIService.suggestTags(text),
      ])

      return { summary, keywords, sentiment, tags }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process text'
      console.error('Batch processing error:', error)
      Alert.alert('Error', 'Failed to process text')
      throw error
    }
  }
}