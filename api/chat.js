// api/chat.js - Vercel Serverless Function for OpenAI Chat
// This serverless function handles ALL OpenAI interactions securely
// The API key and context are NEVER exposed to the client

// Import secure server-side context (NEVER exposed to client)
import {contextData} from './context.js';

// Helper: Check if query is in scope
function isInScope(query) {
  const allowedDomains = [
    'android', 'kotlin', 'compose', 'experience', 'project', 'cv', 'portfolio', 'skill', 'article', 'blog', 'medium', 'rituraj sambherao',
    'about', 'summary', 'profile', 'company', 'open source', 'education', 'certifications',
    'sap', 'toast', 'mastercard', 'nitor', 'corona-warn', 'digital aged', 'internationalization', 'payment gateway',
    'interest', 'interests', 'hobby', 'hobbies', 'pc building', 'pc_building', 'gaming',
    'motorcycle', 'bike', 'motorcycling', 'car', 'cars', 'motorhead', 'motorsport',
    'dog', 'dog training', 'home automation', 'smart home'
  ];
  const lower = query.toLowerCase();
  return allowedDomains.some(keyword => lower.includes(keyword));
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
      console.log('OPTIONS preflight');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
      console.warn('Request denied: Not POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
      console.log('Processing body:', req.body);
    const { message, userMessage } = req.body;
    const finalMessage = message || userMessage;
      console.log('Received message:', finalMessage);

    if (!finalMessage || typeof finalMessage !== 'string') {
        console.warn('Bad or missing "message" in body');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check scope server-side
    if (!isInScope(finalMessage)) {
        console.log('Query out of scope:', finalMessage);
      return res.status(200).json({
        reply: "I'm here to answer questions about Rituraj Sambherao's professional work, experience, projects, or articles."
      });
    }

    // Retrieve context SERVER-SIDE using secure context data
    const contextSnippet = retrieveRelevantContext(contextData, finalMessage);
      console.log('Context snippet:', contextSnippet);

    if (!contextSnippet || contextSnippet.length < 10) {
        console.log('No relevant context found');
      return res.status(200).json({
        reply: "I can only answer questions related to Rituraj Sambherao's experience, projects, and articles."
      });
    }

    // Get OpenAI API key from environment variable
      const apiKey = process.env.OPENAI_API_KEY;
      console.log('ENV ALL:', process.env);
      console.log('DEBUG ENV apiKey:', apiKey);
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // System prompt
    const SYSTEM_PROMPT = `You are the AndroidMeda Assistant. You answer ONLY using the provided context snippet: experience, projects, skills, interests, and blog summaries. When a user's query matches a context entry, reply with the full content for that entry (for example, if asked about interests, list the interests directly). Be concise, clear, and professional. Format your answers with paragraphs and add ONE empty line after each paragraph or section so responses are easy to read as chat messages; do not use em dashes. Use whitespace and spacing as appropriate.`;

      // Prepare OpenAI payload
      const chatPayload = {
          model: 'gpt-4o-mini',
          messages: [
              {role: 'system', content: SYSTEM_PROMPT},
              {role: 'user', content: `Context:\n${contextSnippet}`},
              {role: 'user', content: finalMessage}
          ],
          max_tokens: 380,
          temperature: 0.7,
      };
      console.log('OpenAI request payload:', chatPayload);

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
      const errorData = await openAIResponse.text();
      console.error('OpenAI API Error:', openAIResponse.status, errorData);
      return res.status(500).json({ error: 'Failed to get response from AI service' });
    }

    const data = await openAIResponse.json();
      console.log('OpenAI raw response:', data);
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";

    // Return the response
      console.log('Final reply:', reply);
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

