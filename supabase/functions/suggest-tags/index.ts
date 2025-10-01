import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

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

    const tags = suggestTags(content)

    return new Response(
      JSON.stringify({ tags }),
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

function suggestTags(text: string): string[] {
  // Simple tag suggestion based on content analysis
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
  
  // Common categories for tagging
  const categories = {
    'work': ['meeting', 'project', 'deadline', 'task', 'business', 'office'],
    'personal': ['family', 'friend', 'home', 'personal', 'life', 'health'],
    'study': ['learn', 'study', 'education', 'course', 'book', 'research'],
    'travel': ['trip', 'vacation', 'travel', 'hotel', 'flight', 'destination'],
    'food': ['recipe', 'cooking', 'restaurant', 'food', 'meal', 'dinner'],
    'tech': ['code', 'programming', 'software', 'technology', 'computer', 'app'],
    'finance': ['money', 'budget', 'expense', 'investment', 'financial', 'cost'],
    'health': ['exercise', 'fitness', 'doctor', 'medical', 'health', 'wellness'],
  }
  
  const suggestedTags: string[] = []
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    )
    if (matches.length > 0) {
      suggestedTags.push(category)
    }
  })
  
  // Add some frequent words as tags
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  const frequentWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word)
  
  return [...suggestedTags, ...frequentWords].slice(0, 5)
}