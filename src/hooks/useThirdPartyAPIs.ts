import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { TextProcessingService, TranslationService, WeatherService, NewsService } from '../services/thirdPartyAPIs'

export function useThirdPartyServices() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OpenAI related functions
  const generateSummary = useCallback(async (text: string, maxLength: number = 200) => {
    setLoading(true)
    setError(null)
    
    try {
      const summary = await TextProcessingService.generateSummary(text, maxLength)
      return summary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to generate summary')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const extractKeywords = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const keywords = await TextProcessingService.extractKeywords(text)
      return keywords
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract keywords'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to extract keywords')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeSentiment = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const sentiment = await TextProcessingService.analyzeSentiment(text)
      return sentiment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze sentiment'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to analyze sentiment')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const suggestTags = useCallback(async (text: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const tags = await TextProcessingService.suggestTags(text)
      return tags
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suggest tags'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to suggest tags')
      throw err
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to translate text'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to translate text')
      throw err
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weather'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to get weather data')
      throw err
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get news'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to get news')
      throw err
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process text'
      setError(errorMessage)
      Alert.alert('Error', 'Failed to process text')
      throw err
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