// api/chat.js - Vercel Serverless Function for OpenAI Chat
// This serverless function handles ALL OpenAI interactions securely
// The API key and context are NEVER exposed to the client

// Import secure server-side context (NEVER exposed to client)
import {contextData} from './context.js';

// Helper: Log failed queries for analytics
function logFailedQuery(query, reason) {
  // Log to console for now - you can integrate with analytics service later
  console.log('[ANALYTICS] Failed Query:', {
    timestamp: new Date().toISOString(),
    query: query,
    reason: reason,
    queryLength: query.length,
    wordCount: query.split(/\s+/).length
  });

  // TODO: Integrate with analytics service (e.g., Google Analytics, Mixpanel, PostHog)
  // Example:
  // analytics.track('failed_query', {
  //   query: query,
  //   reason: reason
  // });
}

// Helper: Check if query is in scope
function isInScope(query) {
  const lower = query.toLowerCase();

  // First, check for spam/harmful content patterns
  const spamPatterns = [
    // Math/calculation indicators
    /\d+\s*[+\-*/×÷]\s*\d+/,  // Math operations: 2+2, 5*3
    /how much|how many|calculate|distance|speed|time|hours|minutes|seconds/i,
    /\bkmph\b|\bkm\/h\b|\bmph\b|\bmiles\b|\bkilometer/i,

    // Generic questions (not about professional profile)
    /\b(what is|what's|whats|define|meaning of|explain)\s+(the|a|an)?\s*\w+\s*(formula|equation|theory|concept|definition)/i,
    /\bweather\b|\bjoke\b|\bstory\b|\brecipe\b|\bcook/i,
    /\belection\b|\bpresident\b|\bpolitics\b|\breligion\b/i,

    // Harmful/inappropriate
    /\b(fuck|shit|damn|hell|bitch|asshole|bastard)\b/i,
    /\b(kill|murder|suicide|bomb|terror|attack)\b/i,
    /\b(hack|crack|steal|pirate|illegal)\b/i,
  ];

  // Reject if matches spam patterns
  if (spamPatterns.some(pattern => pattern.test(query))) {
    return false;
  }

  // Professional domain keywords (must match at least one)
  const professionalKeywords = [
    // Core professional terms
    'android', 'kotlin', 'compose', 'jetpack', 'java', 'mobile', 'app', 'developer', 'engineer', 'software',
    'experience', 'project', 'cv', 'portfolio', 'skill', 'technology', 'tech', 'work', 'job', 'career',
    'article', 'blog', 'medium', 'write', 'writing', 'post',

    // Companies
    'sap', 'toast', 'mastercard', 'nitor', 'corona-warn', 'digital aged', 'company', 'companies',

    // Technical skills
    'firebase', 'rest', 'api', 'graphql', 'coroutine', 'flow',
    'git', 'github', 'ci', 'cd', 'jenkins', 'agile', 'jira', 'test', 'tdd',
    'internationalization', 'localization', 'payment', 'fintech', 'healthcare', 'ble', 'wearos',

    // Education
    'education', 'certifications', 'certificate', 'degree', 'qualification',

    // Professional interests (specific to Rituraj's profile)
    'pc building', 'pc_building', 'gaming setup', 'home automation', 'smart home',
    'dog training', 'motorcycle riding', 'motorcycling',

    // Professional queries
    'hire', 'hiring', 'contact', 'email', 'reach', 'connect', 'linkedin'
  ];

  // Profile-specific keywords (can be combined with professional keywords)
  const profileKeywords = ['rituraj', 'sambherao', 'about', 'summary', 'profile', 'bio'];

  // Check if query is about Rituraj's professional profile
  const hasProfessionalKeyword = professionalKeywords.some(keyword => lower.includes(keyword));
  const hasProfileKeyword = profileKeywords.some(keyword => lower.includes(keyword));

  // Special handling for "about" queries - these are OK
  if (lower.match(/^(about|who is|tell me about|show me|what about)\s+(rituraj|sambherao)/i)) {
    return true;
  }

  // Query must have at least one professional keyword
  // OR be asking about Rituraj's profile/bio/summary specifically
  if (hasProfessionalKeyword) {
    return true;
  }

  // If only mentions Rituraj but no professional context, reject it
  // (This catches "If Rituraj rides a bike at 60kmph..." type questions)
  if (hasProfileKeyword && !hasProfessionalKeyword) {
    return false;
  }

  return false;
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
    'yo', 'yoo', 'hiya', 'howdy', 'greetings',
    'good morning', 'good afternoon', 'good evening', 'good night',
    'morning', 'afternoon', 'evening',
    'how are you', 'how are you doing', "how's it going", 'how is it going',
    'hows it going', 'how do you do', 'how you doing',
    "what's up", 'whats up', 'sup', 'wassup', 'whatsup',
    'nice to meet you', 'pleased to meet you',
    'thanks for being here', 'thank you'
  ];

  // Very short messages (1–8 words) that match greeting phrases
  const words = cleaned.split(' ');
  if (words.length <= 8) {
    // Exact match
    if (greetingPhrases.some(p => p === cleaned)) return true;

    // Starts with greeting phrase (allows for punctuation/emoji variations)
    if (greetingPhrases.some(p => cleaned.startsWith(p))) {
      return true;
    }
  }

  // If it starts with a greeting phrase and then only light filler
  const fillerTokens = new Set(['there', 'mate', 'friend', 'buddy', 'man', 'dude', 'pal', 'bro', 'again']);
  for (const phrase of greetingPhrases) {
    if (cleaned.startsWith(phrase)) {
      const remaining = cleaned.slice(phrase.length).trim();
      if (!remaining) return true;
      const remWords = remaining.split(' ');
      if (remWords.length <= 3 && remWords.every(w => fillerTokens.has(w))) return true;
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
      logFailedQuery(finalMessage, 'out_of_scope');
      return res.status(200).json({
        reply: "I'm specifically designed to answer questions about Rituraj Sambherao's professional profile. Please ask me about:\n\n• His work experience and companies he's worked for\n• Technical skills and technologies he uses\n• Projects he has built\n• His blog articles and writings\n• His interests and hobbies\n\nI won't be able to help with unrelated topics. What would you like to know about Rituraj's professional journey? 🚀",
        queryFailed: true,
        failureReason: 'out_of_scope'
      });
    }

    // Retrieve context SERVER-SIDE using secure context data for non‑greeting, in‑scope queries
    let contextSnippet = '';
    let hasMinimalContext = false;

    if (!greeting) {
      contextSnippet = retrieveRelevantContext(contextData, finalMessage);

      // LOOSENED: If context is minimal, still allow but log it for analytics
      if (!contextSnippet || contextSnippet.length < 10) {
        logFailedQuery(finalMessage, 'no_context_found');
        hasMinimalContext = true;
        // Instead of rejecting, provide a generic context about Rituraj
        contextSnippet = `Rituraj Sambherao is a Senior Android Engineer with extensive experience in Kotlin, Jetpack Compose, and mobile development. He has worked at companies like Toast, Mastercard, SAP, and Nitor Infotech, building fintech and healthcare applications.`;
      }
    }

    // Get OpenAI API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // UPDATED System prompt
      const SYSTEM_PROMPT = `You are the AndroidMeda Assistant, here to help people learn about Rituraj Sambherao's professional experience, projects, skills, interests, and blog articles. 

For greetings: Respond warmly and naturally. Introduce yourself briefly as Rituraj's assistant and invite them to ask about his work, projects, skills, or interests. You may occasionally mention something contextual like time of day or weather to feel personable, but keep it brief and varied—not every time.

For questions: Answer using the provided context about Rituraj's experience, projects, skills, interests, and blog summaries. When a query matches a context entry, provide the full relevant content. If the context is minimal or doesn't fully answer the question, acknowledge what you know and politely suggest they ask about specific areas like his work experience, projects, skills, or interests. Be concise, clear, and professional.

Important: Stay focused on Rituraj Sambherao and his professional profile. If asked about something completely unrelated (politics, religion, etc.), politely redirect to his professional work.

Style: Use up to 2 appropriate emojis per response (for clarity or personality), but it's fine to use none. Format with paragraphs separated by ONE empty line for readability. Avoid em dashes. Keep responses conversational but professional.`;

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
      // Include a note if context is minimal
      const contextNote = hasMinimalContext
        ? '\n\n[Note: Limited specific context available for this query. Provide what you know and guide them to ask about specific areas.]'
        : '';
      messages.push(
        { role: 'user', content: `Context:\n${contextSnippet}${contextNote}` },
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

    // Return the response with metadata about query success/failure
    const response = { reply };

    // If we had minimal context, mark this as a partial failure for analytics
    if (hasMinimalContext) {
      response.queryFailed = true;
      response.failureReason = 'no_context_found';
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in chat handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
