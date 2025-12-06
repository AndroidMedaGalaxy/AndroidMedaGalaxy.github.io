// src/utils/openai.js

const SYSTEM_PROMPT = `You are the AndroidMeda Assistant. You answer ONLY using the provided context snippet: experience, projects, skills, interests, and blog summaries. When a user's query matches a context entry, reply with the full content for that entry (for example, if asked about interests, list the interests directly). Be concise, clear, and professional. Format your answers with paragraphs and add ONE empty line after each paragraph or section so responses are easy to read as chat messages; do not use em dashes. Use whitespace and spacing as appropriate.`;

export function isInScope(query) {
    const allowedDomains = [
        // core professional stuff
        'android', 'kotlin', 'compose', 'experience', 'project', 'cv', 'portfolio', 'skill', 'article', 'blog', 'medium', 'rituraj sambherao',
        'about', 'summary', 'profile', 'company', 'open source', 'education', 'certifications',
        'sap', 'toast', 'mastercard', 'nitor', 'corona-warn', 'digital aged', 'internationalization', 'payment gateway',
        // personal profile + interests
        'interest', 'interests', 'hobby', 'hobbies', 'pc building', 'pc_building', 'gaming',
        'motorcycle', 'bike', 'motorcycling', 'car', 'cars', 'motorhead', 'motorsport',
        'dog', 'dog training', 'home automation', 'smart home'
    ];
    const lower = query.toLowerCase();
    return allowedDomains.some(keyword => lower.includes(keyword));
}


export function retrieveRelevantContext(context, query) {
    if (!context || !Array.isArray(context) || context.length === 0) {
        console.warn('Context data NOT loaded or empty:', context);
        return '';
    }
    const stopwords = ['what', 'is', 'how', 'the', 'a', 'an', 'of', 'about', 'to', 'for', 'in', 'and', 'on', 'this', 'that', 'with', 'by', 'at', 'from', 'who', 'are', 'was', 'as', 'it', 'or'];
    const cleaned = query.toLowerCase().replace(/[^a-z0-9\s\-]/g, ''); // preserves dash for corona-warn
    const keywords = cleaned
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopwords.includes(word));
    console.log('Keywords:', keywords);
    console.log('Loaded context:', context);
    // Before keyword processing, flatten context for array content
    const contextFlat = context.flatMap(item => {
        // Special handling for articles array
        if (item.section === 'articles' && Array.isArray(item.content)) {
            return item.content.map(sub => ({
                section: 'articles',
                content: `[${sub.title}](${sub.url})\n\n${sub.summary}\nKey points: ${sub.key_points?.join('; ')}\nKeywords: ${sub.keywords?.join(', ')}`
            }));
        }

        // Special handling for interests array
        if (item.section === 'interests' && Array.isArray(item.content)) {
            return item.content.map(sub => ({
                section: 'interests',
                content: `${sub.category}: ${sub.details}`
            }));
        }

        // Default: leave as-is
        return [item];
    });

    // Special logic: treat single or two-keyword broad queries for summary/about
    if (
        (keywords.length === 1 && (keywords[0] === 'rituraj' || keywords[0] === 'about' || keywords[0] === 'summary')) ||
        (keywords.length === 2 && keywords.includes('about') && keywords.includes('rituraj'))
    ) {
        const about = contextFlat.find(
            item =>
                item.section.toLowerCase().includes('about') ||
                item.section.toLowerCase().includes('profile') ||
                item.section.toLowerCase().includes('summary') ||
                item.section.toLowerCase().includes('current_role')
        );
        if (about) {
            console.log('Special-case summary match:', about.section, about.content);
            return about.content;
        }
    }
    // Special-case for company/project/interest/article/blog/medium queries
    const specialMatches = [
        {keyword: 'toast', sectionMatch: 'toast'},
        {keyword: 'mastercard', sectionMatch: 'mastercard'},
        {keyword: 'sap', sectionMatch: 'sap'},
        {keyword: 'nitor', sectionMatch: 'nitor'},
        {keyword: 'corona-warn', sectionMatch: 'corona-warn'},
        {keyword: 'digital', sectionMatch: 'digital aged'},
        {keyword: 'internationalization', sectionMatch: 'internationalization'},
        {keyword: 'payment', sectionMatch: 'payment gateway'},
        {keyword: 'project', sectionMatch: 'project'},
        {keyword: 'interests', sectionMatch: 'interests'},
        {keyword: 'interest', sectionMatch: 'interests'},
        {keyword: 'article', sectionMatch: 'article'},
        {keyword: 'blog', sectionMatch: 'blog'},
        {keyword: 'medium', sectionMatch: 'medium'},
    ];
    for (const {keyword, sectionMatch} of specialMatches) {
        if (keywords.some(k => k.startsWith(keyword))) {
            // pick all matching items for content-rich queries
            const matches = contextFlat.filter(
                item =>
                    item.section.toLowerCase().includes(sectionMatch) ||
                    item.content.toLowerCase().includes(sectionMatch)
            );
            if (matches.length) {
                console.log('Special-case article/blog/medium match:', sectionMatch, matches.map(m => m.content));
                return matches.map(m => m.content).join("\n---\n");
            }
        }
    }
    let results = [];
    for (const item of contextFlat) {
        const target = (item.content + ' ' + item.section).toLowerCase();
        console.log('Section:', item.section, '| Content:', item.content);
        let scores = 0;
        for (const kw of keywords) {
            if (target.includes(kw)) scores++;
        }
        // Optionally, boost score for 'rituraj' + 'experience' asked together
        if (target.includes('rituraj') && target.includes('experience')) scores += 1;
        if (scores > 0) results.push({...item, scores});
    }
    results = results.sort((a, b) => b.scores - a.scores).slice(0, 3);
    results.forEach(res => console.log('Match:', res.section, '/', res.scores, '/', res.content));
    // Patch to match any variant starting with 'rituraj' for robust interest queries
    if ((keywords.some(kw => kw.startsWith('rituraj')) && keywords.some(kw => ['interest', 'interests'].some(ik => kw.startsWith(ik))))
        || keywords.some(kw => ['interest', 'interests'].some(ik => kw.startsWith(ik)))) {
        // Find all related personal interest sections
        const interestSectionNames = [
            'interest', 'interests', 'pc_building', 'gaming', 'motorcycle_adventure', 'dog_training', 'home_automation'
        ];
        const allInterests = contextFlat.filter(item =>
            interestSectionNames.includes(item.section.toLowerCase())
        );
        if (allInterests.length) {
            return `Rituraj Sambherao's personal interests:\n` +
                allInterests.map(m => `• ${m.content}`).join("\n\n");
        }
    }
    // Fallback threshold: any match is enough
    return results.length > 0
        ? results.map(r => r.content).join("\n---\n")
        : '';
}

// Suggested tile prompts for 'rituraj' or broad queries
export function getSuggestedQueries() {
    return [
        "Rituraj's experience",
        "About Rituraj",
        "Rituraj's blog articles",
        "Rituraj's company history",
        "Rituraj's technical skills",
        "Rituraj's open source work",
        "Rituraj's education & certifications",
        "Rituraj's interests"
    ];
}

export async function generateResponseOpenAI({userMessage, contextSnippet, apiKey}) {
    if (!isInScope(userMessage)) {
        return "I’m here to answer questions about Rituraj Sambherao’s professional work, experience, projects, or articles.";
    }
    if (!contextSnippet || contextSnippet.length < 10) {
        return "I can only answer questions related to Rituraj Sambherao's experience, projects, and articles.";
    }
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const body = {
        model: 'gpt-4o-mini',
        messages: [
            {role: 'system', content: SYSTEM_PROMPT},
            {role: 'user', content: `Context:\n${contextSnippet}`},
            {role: 'user', content: userMessage}
        ],
        max_tokens: 380,
        temperature: 0.7,
    };
    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!resp.ok) return "Sorry, I couldn't reach the assistant service.";
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";
}
