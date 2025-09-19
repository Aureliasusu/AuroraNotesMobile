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

    const { note_id, content, max_length = 150 } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const summary = generateSummary(content, max_length)

    // Save summary to database
    const { error } = await supabaseClient
      .from('note_summaries')
      .upsert({
        note_id,
        summary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save summary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ summary, note_id }),
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

function generateSummary(text: string, maxLength: number): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  if (sentences.length <= 1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
  }
  
  // Simple extractive summarization
  const wordCount = text.split(/\s+/).length
  const targetSentences = Math.max(1, Math.min(sentences.length, Math.ceil(wordCount / 50)))
  
  const summary = sentences.slice(0, targetSentences).join('. ')
  return summary.substring(0, maxLength) + (summary.length > maxLength ? '...' : '')
}
