import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { OpenAIService, TranslationService, WeatherService, NewsService } from '../services/thirdPartyAPIs';

export function useThirdPartyAPIs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OpenAI related functions
  const generateSummary = useCallback(async (text: string, maxLength: number = 150) => {
    setLoading(true);
    setError(null);

    try {
      const summary = await OpenAIService.generateSummary(text, maxLength);
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const extractKeywords = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const keywords = await OpenAIService.extractKeywords(text);
      return keywords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract keywords';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSentiment = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const sentiment = await OpenAIService.analyzeSentiment(text);
      return sentiment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze sentiment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestTags = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const tags = await OpenAIService.suggestTags(text);
      return tags;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suggest tags';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Translation function
  const translateText = useCallback(async (text: string, targetLang: string = 'en') => {
    setLoading(true);
    setError(null);

    try {
      const translatedText = await TranslationService.translateText(text, targetLang);
      return translatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to translate text';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Weather function
  const getCurrentWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const weather = await WeatherService.getCurrentWeather(lat, lon);
      return weather;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weather';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // News function
  const getNews = useCallback(async (query: string, language: string = 'en') => {
    setLoading(true);
    setError(null);

    try {
      const news = await NewsService.getNews(query, language);
      return news;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get news';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Batch process text
  const processText = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const [summary, keywords, sentiment, tags] = await Promise.all([
        generateSummary(text),
        extractKeywords(text),
        analyzeSentiment(text),
        suggestTags(text),
      ]);

      return {
        summary,
        keywords,
        sentiment,
        tags,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process text';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [generateSummary, extractKeywords, analyzeSentiment, suggestTags]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    clearError,
  };
}
