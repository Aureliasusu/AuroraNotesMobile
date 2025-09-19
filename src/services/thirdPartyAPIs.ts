import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// OpenAI API service
export class OpenAIService {
  private static readonly API_URL = 'https://api.openai.com/v1';
  private static readonly API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key'; // Get from environment variables

  // Generate text summary
  static async generateSummary(text: string, maxLength: number = 150): Promise<string> {
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
              role: 'system',
              content: `You are a helpful assistant that creates concise summaries. Create a summary of the given text in ${maxLength} characters or less.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
    } catch (error) {
      console.error('OpenAI summary error:', error);
      Alert.alert('Error', 'Failed to generate summary');
      throw error;
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
              role: 'system',
              content: 'You are a helpful assistant that extracts keywords from text. Return only the keywords as a comma-separated list, maximum 10 keywords.'
            },
            {
              role: 'user',
              content: `Extract keywords from: ${text}`
            }
          ],
          max_tokens: 50,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const keywords = data.choices[0]?.message?.content?.trim() || '';
      return keywords.split(',').map(k => k.trim()).filter(Boolean);
    } catch (error) {
      console.error('OpenAI keywords error:', error);
      Alert.alert('Error', 'Failed to extract keywords');
      throw error;
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
              role: 'system',
              content: 'You are a helpful assistant that analyzes sentiment. Return only one word: positive, negative, or neutral.'
            },
            {
              role: 'user',
              content: `Analyze the sentiment of: ${text}`
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const sentiment = data.choices[0]?.message?.content?.trim().toLowerCase();
      
      if (['positive', 'negative', 'neutral'].includes(sentiment)) {
        return sentiment as 'positive' | 'negative' | 'neutral';
      }
      
      return 'neutral';
    } catch (error) {
      console.error('OpenAI sentiment error:', error);
      Alert.alert('Error', 'Failed to analyze sentiment');
      throw error;
    }
  }

  // Generate tag suggestions
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
              role: 'system',
              content: 'You are a helpful assistant that suggests relevant tags for notes. Return only the tags as a comma-separated list, maximum 5 tags.'
            },
            {
              role: 'user',
              content: `Suggest tags for: ${text}`
            }
          ],
          max_tokens: 30,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const tags = data.choices[0]?.message?.content?.trim() || '';
      return tags.split(',').map(t => t.trim()).filter(Boolean);
    } catch (error) {
      console.error('OpenAI tags error:', error);
      Alert.alert('Error', 'Failed to suggest tags');
      throw error;
    }
  }
}

// Translation service
export class TranslationService {
  // Translate text using Edge Function
  static async translateText(text: string, targetLang: string = 'en'): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          text: text,
          targetLang: targetLang,
        },
      });

      if (error) {
        console.error('Translation error:', error);
        throw new Error(`Translation failed: ${error.message}`);
      }

      return data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Failed to translate text');
      throw error;
    }
  }
}

// Weather service using Edge Functions
export class WeatherService {
  // Get current weather using Edge Function
  static async getCurrentWeather(lat: number, lon: number): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: {
          lat: lat,
          lon: lon,
        },
      });

      if (error) {
        console.error('Weather error:', error);
        throw new Error(`Weather failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Weather error:', error);
      Alert.alert('Error', 'Failed to get weather data');
      throw error;
    }
  }
}

// News service using Edge Functions
export class NewsService {
  // Get news using Edge Function
  static async getNews(query: string, language: string = 'en'): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('get-news', {
        body: {
          query: query,
          language: language,
        },
      });

      if (error) {
        console.error('News error:', error);
        throw new Error(`News failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('News error:', error);
      Alert.alert('Error', 'Failed to get news');
      throw error;
    }
  }
}
