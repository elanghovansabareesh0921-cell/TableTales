import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ExtractedVibeContext, VibeTheme } from '@/types';

const ConciergeRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  locationName: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional(),
});

function parseVibeFromText(text: string): ExtractedVibeContext {
  const lower = text.toLowerCase();

  // 1. Determine Vibe Theme
  let vibe_theme: VibeTheme = 'romantic';
  if (lower.includes('family') || lower.includes('kid') || lower.includes('children') || lower.includes('parents') || lower.includes('homey')) {
    vibe_theme = 'family';
  } else if (lower.includes('adventur') || lower.includes('exotic') || lower.includes('wild') || lower.includes('daring') || lower.includes('spicy') || lower.includes('surprise') || lower.includes('bold')) {
    vibe_theme = 'adventurous';
  } else if (lower.includes('chill') || lower.includes('relax') || lower.includes('calm') || lower.includes('peace') || lower.includes('zen') || lower.includes('unwind') || lower.includes('solo') || lower.includes('quiet')) {
    vibe_theme = 'chill';
  } else if (lower.includes('celebrat') || lower.includes('birthday') || lower.includes('party') || lower.includes('cheers') || lower.includes('toast') || lower.includes('drink') || lower.includes('fun')) {
    vibe_theme = 'celebration';
  } else if (lower.includes('date') || lower.includes('romantic') || lower.includes('anniversary') || lower.includes('candle') || lower.includes('intimate') || lower.includes('partner') || lower.includes('love')) {
    vibe_theme = 'romantic';
  }

  // 2. Determine Party Size
  let party_size = 1;
  const matchDiners = lower.match(/(?:for|party of|table for|group of|with)\s+(\d+)/);
  if (matchDiners && matchDiners[1]) {
    party_size = parseInt(matchDiners[1], 10);
  } else if (lower.includes('just me') || lower.includes('solo') || lower.includes('by myself') || lower.includes('myself')) {
    party_size = 1;
  } else if (lower.includes('date') || lower.includes('couple') || lower.includes('with my wife') || lower.includes('with my husband') || lower.includes('with my partner') || lower.includes('both of us') || lower.includes('two of us') || lower.includes('2 people')) {
    party_size = 2;
  } else if (lower.includes('family') || lower.includes('group') || lower.includes('friends') || lower.includes('team')) {
    party_size = 4;
  }

  // 3. Determine Dietary Restrictions
  const dietary: string[] = [];
  if (lower.includes('vegan')) dietary.push('Vegan');
  if (lower.includes('vegetarian') || lower.includes('veggie')) dietary.push('Vegetarian');
  if (lower.includes('gluten-free') || lower.includes('gluten free') || lower.includes('celiac') || lower.includes('no gluten')) dietary.push('Gluten-Free');
  if (lower.includes('nut-free') || lower.includes('nut free') || lower.includes('peanut allergy') || lower.includes('tree nut') || lower.includes('no nuts')) dietary.push('Nut-Free');
  if (lower.includes('dairy-free') || lower.includes('dairy free') || lower.includes('lactose')) dietary.push('Dairy-Free');
  if (lower.includes('halal')) dietary.push('Halal');
  if (lower.includes('keto')) dietary.push('Keto');

  // 4. Determine Occasion
  let occasion = 'Casual Dining';
  if (lower.includes('anniversary')) occasion = 'Anniversary';
  else if (lower.includes('birthday')) occasion = 'Birthday Celebration';
  else if (lower.includes('date')) occasion = 'Romantic Date Night';
  else if (lower.includes('business') || lower.includes('meeting')) occasion = 'Business Dinner';
  else if (lower.includes('reunion') || lower.includes('friends')) occasion = 'Friends Reunion';

  // 5. Build sensory recommendation
  const recommendations: Record<VibeTheme, string> = {
    romantic: 'Draped in soft rose amber glow. Hand-rolled truffles, smoked embers, and intimate acoustic melodies await.',
    family: 'Golden sunlit hearths with generous shareable platters and comforting warmth for all generations.',
    adventurous: 'Electric neon emerald botanicals, plancha-seared ocean delicacies, and bold unscripted flavors.',
    chill: 'Tranquil twilight sanctuary with soothing dashi broths, matcha clouds, and meditative stillness.',
    celebration: 'Radiant champagne sparkle, lively communal toasts, and celebratory tapas under starry skylights.'
  };

  return {
    mood: text,
    party_size,
    occasion,
    dietary_restrictions: dietary,
    vibe_theme,
    recommendation_note: recommendations[vibe_theme],
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = ConciergeRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { message, locationName = 'TableTales Signature Venue' } = result.data;
    const extracted = parseVibeFromText(message);

    // Poetic response narrative tailored to extracted vibe
    const responses: Record<VibeTheme, string> = {
      romantic: `A wondrous choice. For an intimate evening at ${locationName}, I am setting our atmosphere to **Romantic Candlelight**. The lights soften into deep rose embers, and the scent of wild truffles and charred cedar fills the air. I have configured your dietary profile (${extracted.dietary_restrictions.length > 0 ? extracted.dietary_restrictions.join(', ') : 'no restrictions'}) and prepared an unforgettable sensory sequence for ${extracted.party_size} ${extracted.party_size === 1 ? 'diner' : 'diners'}.`,
      family: `Welcome to our warm table! I am bathing ${locationName} in **Warm Convivial Harvest** tones. Picture overflowing platters of wood-fired hearth delicacies, crisp farm-fresh botanicals, and joyful communal laughter. Your dietary filters (${extracted.dietary_restrictions.length > 0 ? extracted.dietary_restrictions.join(', ') : 'open menu'}) have been automatically engaged.`,
      adventurous: `A daring palate arrives! I have shifted your atmosphere to **Wild Botanical Frontier** with an electric jade luminescence. Prepare for smoky charred plancha crusts, 22-ingredient toasted moles, and bold flavor combinations curated specifically for ${extracted.party_size} explorers.`,
      chill: `Take a deep breath and settle in. At ${locationName}, your environment is now immersed in **Serene Twilight Sanctuary** with calming lavender hues and delicate kombu dashi aromas. Every dish presented will soothe the senses and quiet the mind.`,
      celebration: `Let the festivities begin! I have sparked the **Euphoric Midnight Spark** theme across ${locationName} with vibrant magenta energy. Sparkling cava, socarrat rice crusts, and celebratory tapas are queued for your party!`
    };

    const aiSpeech = responses[extracted.vibe_theme];

    // Stream the response with custom chunking for realistic typewriter feel
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text words
        const words = aiSpeech.split(' ');
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise((r) => setTimeout(r, 24));
        }

        // Send function call payload at the end
        const functionCallPayload = `\n\n__FUNCTION_CALL__:${JSON.stringify(extracted)}`;
        controller.enqueue(encoder.encode(functionCallPayload));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err: unknown) {
    console.error('Concierge API error:', err);
    return NextResponse.json({ error: 'Failed to process concierge request' }, { status: 500 });
  }
}
