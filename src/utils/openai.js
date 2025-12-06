// src/utils/openai.js
// CLIENT-SIDE utility for chat interactions
// NO sensitive data or API keys here - all handled by /api/chat serverless function

// Suggested query prompts for quick access
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

// Main function to send message to secure serverless API
// All context retrieval and OpenAI calls happen server-side
export async function generateResponseOpenAI({userMessage}) {
    // Call Vercel serverless function - handles everything server-side
    // Use relative URL so it works on any port (vercel dev uses dynamic ports)
    const apiUrl = '/api/chat';

    try {
        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            }),
        });

        if (!resp.ok) {
            console.error('API error:', resp.status, await resp.text());
            return "Sorry, I couldn't reach the assistant service.";
        }

        const data = await resp.json();
        return data.reply || "Sorry, I couldn't find an answer.";
    } catch (error) {
        console.error('Fetch error:', error);
        return "Sorry, there was an error contacting the assistant.";
    }
}
