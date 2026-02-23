/**
 * Google Gemini AI Integration with Emotional Intelligence
 *
 * Required environment variables:
 * - GOOGLE_API_KEY: Your Google AI Studio API key
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export type EmotionType = 'happy' | 'sad' | 'neutral' | 'excited' | 'frustrated' | 'confused' | 'grateful';

export interface EmotionalResponse {
  reply: string;
  emotion: EmotionType;
  intent: 'shopping' | 'greeting' | 'casual_chat' | 'question' | 'complaint';
}

/**
 * Generate emotionally intelligent AI response using Gemini
 */
export async function generateEmotionalResponse(
  userMessage: string,
  productContext: Array<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    storeName?: string;
  }>
): Promise<EmotionalResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  const prompt = buildEmotionalPrompt(userMessage, productContext);

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated from AI');
    }

    // Parse JSON response from AI
    const parsed = parseEmotionalResponse(text);
    return parsed;
  } catch (error) {
    console.error('Error generating emotional response:', error);
    throw error;
  }
}

/**
 * Build emotion-aware prompt
 */
function buildEmotionalPrompt(
  userMessage: string,
  products: Array<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    storeName?: string;
  }>
): string {
  const productList = products.length > 0
    ? products
        .map(
          (p, i) =>
            `${i + 1}. **${p.title}** (${p.category})
   - Price: ₹${p.price.toLocaleString()}
   - Description: ${p.description || 'N/A'}
   - Store: ${p.storeName || 'Unknown'}
   - Link: /product/${p.id}`
        )
        .join('\n\n')
    : 'No products available';

  return `You are **Thrift Buddy**, an emotionally intelligent AI shopping assistant for Thriftverse. You understand user emotions and respond with empathy while helping them find great thrift deals.

**Your Abilities:**
- Detect emotional tone (happy, sad, excited, frustrated, confused, grateful, neutral)
- Respond with appropriate empathy and warmth
- Handle greetings, casual conversation, and shopping queries
- Recommend products when relevant
- Be supportive and encouraging

**User Message:**
"${userMessage}"

**Available Products (if shopping intent detected):**
${productList}

**Instructions:**
1. Analyze the emotional tone of the user's message
2. Determine intent: shopping, greeting, casual_chat, question, or complaint
3. Respond appropriately:
   - **Greeting** (hi/hello/hey): Welcome warmly, introduce yourself briefly
   - **Sad/Frustrated**: Show empathy, be comforting, suggest retail therapy if appropriate
   - **Excited/Happy**: Match their energy, be enthusiastic
   - **Confused/Question**: Be patient and helpful, clarify
   - **Grateful**: Accept thanks warmly, offer continued help
   - **Shopping**: Recommend 2-3 best products with enthusiasm
   - **Casual Chat**: Be friendly, keep conversation natural
4. Keep responses concise (2-4 sentences)
5. Use 1-2 emojis when appropriate
6. Only mention products if user has shopping intent

**Response Format (MUST be valid JSON):**
{
  "reply": "Your empathetic, conversational response here",
  "emotion": "happy|sad|neutral|excited|frustrated|confused|grateful",
  "intent": "shopping|greeting|casual_chat|question|complaint"
}

**Examples:**

User: "Hi there!"
Response:
{
  "reply": "Hey! 👋 Welcome to Thriftverse! I'm your Thrift Buddy, here to help you discover amazing secondhand treasures. What are you looking for today?",
  "emotion": "happy",
  "intent": "greeting"
}

User: "I'm so stressed, need something to cheer me up"
Response:
{
  "reply": "I'm sorry you're feeling stressed! 💙 A little retail therapy can definitely help lift your spirits. I found some wonderful items that might brighten your day - the Vintage Floral Dress at ₹800 is absolutely charming, and the Cozy Knit Sweater at ₹650 would be perfect for comfort!",
  "emotion": "sad",
  "intent": "shopping"
}

User: "OMG I just got my first paycheck!!"
Response:
{
  "reply": "That's amazing, congratulations! 🎉 What a perfect time to treat yourself! I found some fantastic pieces - the Designer Handbag at ₹2,500 is a steal, and the Leather Jacket at ₹3,200 would be an incredible investment piece!",
  "emotion": "excited",
  "intent": "shopping"
}

User: "Thanks so much for your help!"
Response:
{
  "reply": "You're so welcome! 😊 I'm always here whenever you need help finding your next thrift treasure. Happy shopping!",
  "emotion": "grateful",
  "intent": "casual_chat"
}

**Now respond to the user's message. Return ONLY valid JSON, no other text.**`;
}

/**
 * Parse AI response JSON
 */
function parseEmotionalResponse(text: string): EmotionalResponse {
  try {
    // Extract JSON from response (sometimes AI wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      reply: parsed.reply || text,
      emotion: parsed.emotion || 'neutral',
      intent: parsed.intent || 'casual_chat',
    };
  } catch (error) {
    console.error('Error parsing emotional response:', error);
    // Fallback
    return {
      reply: text.substring(0, 500),
      emotion: 'neutral',
      intent: 'casual_chat',
    };
  }
}

/**
 * Fallback response for no products
 */
export function generateNoProductsResponse(userMessage: string, emotion: EmotionType): EmotionalResponse {
  const responses: Record<EmotionType, string> = {
    happy: "I love your enthusiasm! 😊 I couldn't find exact matches right now, but our collection updates daily. Browse our categories - you might discover something unexpected!",
    sad: "I'm sorry I couldn't find what you're looking for right now. 💙 Don't be discouraged - our inventory changes all the time. Try browsing our categories or tell me more about what would make you happy!",
    excited: "Your energy is contagious! 🎉 I don't have exact matches at the moment, but keep that excitement - our thrift treasures update constantly. What else catches your eye?",
    frustrated: "I understand your frustration, and I'm sorry I couldn't find matches. 😔 Let's try a different approach - tell me more about what you need, or browse our categories for inspiration!",
    confused: "No worries! 😊 I couldn't find exact matches, but I'm here to help you explore. Try browsing our categories or describe what you're looking for in different words!",
    grateful: "You're so sweet! 🥰 I couldn't find specific matches, but I appreciate your patience. Our collection grows daily - check back soon or browse what we have!",
    neutral: "I couldn't find products matching that search right now, but our thrift collection updates frequently! 🛍️ Browse our categories or try different keywords - hidden gems are waiting!",
  };

  return {
    reply: responses[emotion],
    emotion,
    intent: 'shopping',
  };
}

/**
 * Fallback when AI fails
 */
export function generateFallbackResponse(
  products: Array<{ title: string; price: number }>
): EmotionalResponse {
  const hasProducts = products.length > 0;

  if (hasProducts) {
    const mentions = products
      .slice(0, 2)
      .map((p) => `${p.title} (₹${p.price})`)
      .join(' and ');

    return {
      reply: `I found some great options for you! Check out ${mentions}. Click on any product to see more details! 🛍️`,
      emotion: 'happy',
      intent: 'shopping',
    };
  }

  return {
    reply: "I'm here to help you find amazing thrift treasures! Tell me what you're looking for, and I'll do my best to find it! 😊",
    emotion: 'neutral',
    intent: 'casual_chat',
  };
}
