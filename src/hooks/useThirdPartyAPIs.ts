import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { OpenAIService, TranslationService, WeatherService, NewsService } from '../services/thirdPartyAPIs'

export function useThirdPartyServices() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OpenAI related functions
  const generateSummary = useCallback(async (text: string, maxLength: number = 200) => {
    setLoading(true)
    setError(null)
    
    try {
      const summary = await OpenAIService.generateSummary(text, maxLength)
      return summary
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to generate summary')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const extractKeywords = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const keywords = await OpenAIService.extractKeywords(text)
      return keywords
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to extract keywords'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to extract keywords')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeSentiment = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const sentiment = await OpenAIService.analyzeSentiment(text)
      return sentiment
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze sentiment'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to analyze sentiment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTags = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const tags = await OpenAIService.suggestTags(text)
      return tags
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to suggest tags'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to suggest tags')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Translation functions
  const translateText = useCallback(async (text: string, targetLanguage: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const translatedText = await TranslationService.translateText(text, targetLanguage)
      return translatedText
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to translate text'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to translate text')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Weather functions
  const getCurrentWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const weather = await WeatherService.getCurrentWeather(lat, lon)
      return weather
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get weather'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to get weather data')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // News functions
  const getNews = useCallback(async (query: string, language: string = 'en') => {
    setLoading(true)
    setError(null)
    
    try {
      const news = await NewsService.getNews(query, language)
      return news
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get news'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to get news')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Batch processing
  const processText = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const [summary, keywords, sentiment, tags] = await Promise.all([
        generateSummary(text),
        extractKeywords(text),
        analyzeSentiment(text),
        suggestTags(text),
      ])

      return { summary, keywords, sentiment, tags }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process text'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to process text')
      throw error
    } finally {
      setLoading(false)
    }
  }, [generateSummary, extractKeywords, analyzeSentiment, suggestTags])

  return {
    loading,
    error,
    generateSummary,
    extractKeywords,
    analyzeSentiment,
    suggestTags,
    translateText,
    getCurrentWeather,
    getNews,
    processText,
  }
}