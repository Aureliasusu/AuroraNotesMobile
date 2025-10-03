import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { note_id, content } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Implement content analysis
    const analysis = {
      id: crypto.randomUUID(),
      note_id,
      summary: generateSummary(content),
      key_points: extractKeyPoints(content),
      sentiment: analyzeSentiment(content),
      confidence: 0.8,
      created_at: new Date().toISOString(),
    }

    // Save analysis to database
    const { error } = await supabaseClient
      .from('note_analyses')
      .insert(analysis)

    if (error) {
      console.error('Database error', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Implement text analysis functions
function generateSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  
  if (sentences.length <= 2) {
    return text.substring(0, 100) + (text.length > 100 ? '...' : '')
  }
  
  // Take first and last sentences for summary
  const summary = sentences.slice(0, 1).concat(sentences.slice(-1)).join('. ')
  return summary.substring(0, 150) + (summary.length > 150 ? '...' : '')
}

function extractKeyPoints(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const keyPoints = sentences
    .filter(sentence => sentence.length > 20)
    .slice(0, 5)
    .map(s => s.trim())
  
  return keyPoints.length > 0 ? keyPoints : ['No key points identified']
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy']
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'frustrated', 'disappointed']
  
  const words = text.toLowerCase().split(/\s+/)
  const positiveCount = words.filter(w => positiveWords.includes(w)).length
  const negativeCount = words.filter(w => negativeWords.includes(w)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}