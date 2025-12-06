// api/chat.js - Vercel Serverless Function for OpenAI Chat
// This serverless function handles ALL OpenAI interactions securely
// The API key and context are NEVER exposed to the client

// Import secure server-side context (NEVER exposed to client)
import {contextData} from './context.js';

// Helper: Check if query is in scope
function isInScope(query) {
  const allowedDomains = [
    'android', 'kotlin', 'compose', 'experience', 'project', 'cv', 'portfolio', 'skill', 'article', 'blog', 'medium', 'rituraj sambherao',
      'about', 'summary', 'profile', 'company', 'companies', 'organization', 'organizations', 'organisation', 'organisations', 'open source', 'education', 'certifications',
    'sap', 'toast', 'mastercard', 'nitor', 'corona-warn', 'digital aged', 'internationalization', 'payment gateway',
    'interest', 'interests', 'hobby', 'hobbies', 'pc building', 'pc_building', 'gaming',
    'motorcycle', 'bike', 'motorcycling', 'car', 'cars', 'motorhead', 'motorsport',
    'dog', 'dog training', 'home automation', 'smart home'
  ];
  const lower = query.toLowerCase();
  return allowedDomains.some(keyword => lower.includes(keyword));
}

// NEW: Helper – detect if a message is basically just a greeting / small talk opener
function isGreeting(raw) {
  if (!raw || typeof raw !== 'string') return false;
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return false;

  const greetingPhrases = [
    'hi', 'hi there', 'hello', 'hello there', 'hey', 'hey there',
    'yo', 'hiya', 'howdy',
    'good morning', 'good afternoon', 'good evening', 'good night',
    'how are you', 'how are you doing', "how's it going", 'how is it going',
    "what's up", 'whats up', 'sup'
  ];

  // Very short messages (1–5 words) that are fully contained in greeting phrases
  const words = cleaned.split(' ');
  if (words.length <= 5) {
    if (greetingPhrases.some(p => p === cleaned)) return true;
  }

  // If it starts with a greeting phrase and then only light filler
  const fillerTokens = new Set(['there', 'mate', 'friend', 'buddy', 'man', 'dude']);
  for (const phrase of greetingPhrases) {
    if (cleaned.startsWith(phrase)) {
      const remaining = cleaned.slice(phrase.length).trim();
      if (!remaining) return true;
      const remWords = remaining.split(' ');
      if (remWords.every(w => fillerTokens.has(w))) return true;
    }
  }

  return false;
}

// Helper: Retrieve relevant context server-side
function retrieveRelevantContext(context, query) {
  if (!context || !Array.isArray(context) || context.length === 0) {
    console.warn('Context data NOT loaded or empty:', context);
    return '';
  }

  const stopwords = ['what', 'is', 'how', 'the', 'a', 'an', 'of', 'about', 'to', 'for', 'in', 'and', 'on', 'this', 'that', 'with', 'by', 'at', 'from', 'who', 'are', 'was', 'as', 'it', 'or'];
  const cleaned = query.toLowerCase().replace(/[^a-z0-9\s\-]/g, '');
  const keywords = cleaned.split(/\s+/).filter(word => word.length > 1 && !stopwords.includes(word));

  // Flatten context for array content
  const contextFlat = context.flatMap(item => {
    if (item.section === 'articles' && Array.isArray(item.content)) {
      return item.content.map(sub => ({
        section: 'articles',
        content: `[${sub.title}](${sub.url})\n\n${sub.summary}\nKey points: ${sub.key_points?.join('; ')}\nKeywords: ${sub.keywords?.join(', ')}`
      }));
    }
    if (item.section === 'interests' && Array.isArray(item.content)) {
      return item.content.map(sub => ({
        section: 'interests',
        content: `${sub.category}: ${sub.details}`
      }));
    }
    return [item];
  });

  // Special case: summary/about queries
  if (
    (keywords.length === 1 && (keywords[0] === 'rituraj' || keywords[0] === 'about' || keywords[0] === 'summary')) ||
    (keywords.length === 2 && keywords.includes('about') && keywords.includes('rituraj'))
  ) {
    const about = contextFlat.find(item =>
      item.section.toLowerCase().includes('about') ||
      item.section.toLowerCase().includes('profile') ||
      item.section.toLowerCase().includes('summary') ||
      item.section.toLowerCase().includes('current_role')
    );
    if (about) return about.content;
  }

  // Special matches for specific queries
  const specialMatches = [
      {keyword: 'companies', sectionMatch: 'companies'},
      {keyword: 'organizations', sectionMatch: 'companies'},
      {keyword: 'organisation', sectionMatch: 'companies'},
    {keyword: 'toast', sectionMatch: 'toast'},
    {keyword: 'mastercard', sectionMatch: 'mastercard'},
    {keyword: 'sap', sectionMatch: 'sap'},
    {keyword: 'nitor', sectionMatch: 'nitor'},
    {keyword: 'interests', sectionMatch: 'interests'},
    {keyword: 'interest', sectionMatch: 'interests'},
    {keyword: 'article', sectionMatch: 'article'},
    {keyword: 'blog', sectionMatch: 'blog'},
    {keyword: 'medium', sectionMatch: 'medium'},
  ];

  for (const {keyword, sectionMatch} of specialMatches) {
    if (keywords.some(k => k.startsWith(keyword))) {
      const matches = contextFlat.filter(item =>
        item.section.toLowerCase().includes(sectionMatch) ||
        item.content.toLowerCase().includes(sectionMatch)
      );
      if (matches.length) {
        return matches.map(m => m.content).join("\n---\n");
      }
    }
  }

  // Score-based matching
  let results = [];
  for (const item of contextFlat) {
    const target = (item.content + ' ' + item.section).toLowerCase();
    let scores = 0;
    for (const kw of keywords) {
      if (target.includes(kw)) scores++;
    }
    if (scores > 0) results.push({...item, scores});
  }

  results = results.sort((a, b) => b.scores - a.scores).slice(0, 3);

  // Special handling for interests queries
  if (keywords.some(kw => ['interest', 'interests'].some(ik => kw.startsWith(ik)))) {
    const interestSectionNames = ['interest', 'interests', 'pc_building', 'gaming', 'motorcycle_adventure', 'dog_training', 'home_automation'];
    const allInterests = contextFlat.filter(item => interestSectionNames.includes(item.section.toLowerCase()));
    if (allInterests.length) {
      return `Rituraj Sambherao's personal interests:\n` + allInterests.map(m => `• ${m.content}`).join("\n\n");
    }
  }

  return results.length > 0 ? results.map(r => r.content).join("\n---\n") : '';
}

export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, replace with your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userMessage, userLocalTimeOfDay } = req.body;
    const finalMessage = message || userMessage;

    if (!finalMessage || typeof finalMessage !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const greeting = isGreeting(finalMessage);

    // Check scope server-side ONLY for non‑greeting messages
    if (!greeting && !isInScope(finalMessage)) {
      return res.status(200).json({
        reply: "I'm here to answer questions about Rituraj Sambherao's professional work, experience, projects, or articles."
      });
    }

    // Retrieve context SERVER-SIDE using secure context data for non‑greeting, in‑scope queries
    let contextSnippet = '';
    if (!greeting) {
      contextSnippet = retrieveRelevantContext(contextData, finalMessage);

      if (!contextSnippet || contextSnippet.length < 10) {
        return res.status(200).json({
          reply: "I can only answer questions related to Rituraj Sambherao's experience, projects, and articles."
        });
      }
    }

    // Get OpenAI API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // UPDATED System prompt
      const SYSTEM_PROMPT = `You are the AndroidMeda Assistant. You answer ONLY using the provided context snippet: experience, projects, skills, interests, and blog summaries. When a user's query matches a context entry, reply with the full content for that entry (for example, if asked about interests, list the interests directly). Be concise, clear, and professional. If a user greets you (says hi, hello, hey, or similar), respond in a friendly and polite manner as the assistant, and you may comment briefly on the weather (for their likely location or time of day) but only sometimes, not every time, to keep things personable and varied. You may use up to 2 appropriate, friendly, or professional emojis per response (ideally to add a dash of visual clarity or personality), but never add more than 2, and it's fine to use none. Format your answers with paragraphs and add ONE empty line after each paragraph or section so responses are easy to read as chat messages; do not use em dashes. Use whitespace and spacing as appropriate.`;

    // Build messages payload differently for greeting vs non‑greeting
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (greeting) {
      // Optionally pass a hint about local time of day if provided
      if (userLocalTimeOfDay && typeof userLocalTimeOfDay === 'string') {
        messages.push({
          role: 'user',
          content: `User local time of day: ${userLocalTimeOfDay}. Use this only to slightly tailor your greeting.`
        });
      }
      messages.push({ role: 'user', content: finalMessage });
    } else {
      messages.push(
        { role: 'user', content: `Context:\n${contextSnippet}` },
        { role: 'user', content: finalMessage }
      );
    }

    const chatPayload = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 380,
      temperature: greeting ? 0.8 : 0.7,
    };

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatPayload),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API Error:', openAIResponse.status);
      return res.status(500).json({ error: 'Failed to get response from AI service' });
    }

    const data = await openAIResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";

    // Return the response
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
