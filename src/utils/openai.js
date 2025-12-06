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
    // Adjust apiUrl: use absolute URL so requests work from GitHub Pages/static host
    // TODO: Replace this with your actual deployed backend URL (e.g. Vercel serverless function)
    const apiUrl = 'https://android-meda-galaxy-github-io.vercel.app/api/chat'; // <-- Fill in with your deployed backend endpoint
    // Optionally auto-detect localhost for local dev
    // const apiUrl = window.location.hostname === 'localhost' 
    //     ? '/api/chat' : 'https://YOUR_BACKEND_DOMAIN/api/chat';

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
            console.error("Assistant service response not OK", {
                status: resp.status,
                statusText: resp.statusText,
                url: apiUrl
            });
            try {
                const errorBody = await resp.text();
                console.error("Error body:", errorBody);
            } catch (e) {
                console.error("Unable to parse error body");
            }
            return "Sorry, I couldn't reach the assistant service. This may be due to a temporary network issue or possible misconfiguration. Please try again later, and contact the site owner if the problem persists.";
        }

        try {
            const data = await resp.json();
            return data.reply || "Sorry, I couldn't find an answer.";
        } catch (e) {
            console.error("Error parsing assistant service JSON:", e);
            return "Sorry, there was an error processing the assistant's response.";
        }
    } catch (error) {
        console.error("Network or fetch error:", error);
        return "Sorry, there was an error contacting the assistant.";
    }
}
