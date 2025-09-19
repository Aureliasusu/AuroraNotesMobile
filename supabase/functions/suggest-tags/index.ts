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

    const { content } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tags = suggestTags(content)

    return new Response(
      JSON.stringify({ tags }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function suggestTags(content: string): string[] {
  const text = content.toLowerCase()
  
  // Category-based tag suggestions
  const categories = {
    work: ['meeting', 'project', 'deadline', 'task', 'client', 'business', 'office', 'team', 'report', 'presentation'],
    personal: ['family', 'friend', 'home', 'health', 'hobby', 'travel', 'vacation', 'birthday', 'anniversary'],
    learning: ['study', 'course', 'book', 'tutorial', 'lesson', 'education', 'research', 'knowledge', 'skill'],
    technology: ['code', 'programming', 'software', 'app', 'website', 'database', 'api', 'development', 'tech'],
    finance: ['money', 'budget', 'expense', 'income', 'investment', 'saving', 'bank', 'payment', 'cost'],
    health: ['exercise', 'workout', 'diet', 'doctor', 'medicine', 'fitness', 'gym', 'running', 'yoga'],
    travel: ['trip', 'vacation', 'hotel', 'flight', 'destination', 'sightseeing', 'adventure', 'explore'],
    food: ['recipe', 'cooking', 'restaurant', 'meal', 'dinner', 'lunch', 'breakfast', 'ingredient', 'taste'],
    entertainment: ['movie', 'music', 'game', 'book', 'show', 'concert', 'party', 'fun', 'relax'],
    shopping: ['buy', 'purchase', 'store', 'price', 'deal', 'sale', 'product', 'order', 'delivery']
  }

  const suggestedTags: string[] = []
  
  // Check for category keywords
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => text.includes(keyword))
    if (matches.length > 0) {
      suggestedTags.push(category)
    }
  })

  // Add specific keywords as tags
  const specificKeywords = [
    'urgent', 'important', 'idea', 'note', 'reminder', 'todo', 'done', 'completed',
    'draft', 'final', 'review', 'edit', 'update', 'new', 'old', 'recent'
  ]

  specificKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      suggestedTags.push(keyword)
    }
  })

  // Remove duplicates and limit to 5 tags
  return [...new Set(suggestedTags)].slice(0, 5)
}
