// src/utils/openai.js
// CLIENT-SIDE utility for chat interactions
// NO sensitive data or API keys here - all handled by /api/chat serverless function

// Suggested query prompts for quick access
export function getSuggestedQueries() {
    return [
        "Hello there",
        "About Rituraj Sambherao",
        "Rituraj's experience",
        "Skills and technologies he uses",
        "Companies he has worked for",
        "Education and certifications",
        "Show his interests",
        "What is BigBang Android Starter?",
        "View blog articles",
        "Download CV"
    ];
}

// Main function to send message to secure serverless API
// All context retrieval and OpenAI calls happen server-side
export async function generateResponseOpenAI({userMessage}) {
    // CV trigger: Recognize requests for CV, resume, download CV
    if (/download cv|cv|resume/i.test(userMessage)) {
        return "<<DOWNLOAD_CV>>";
    }

    // Compute a lightweight local time-of-day hint from the browser (if available)
    let userLocalTimeOfDay;
    try {
        if (typeof window !== 'undefined' && window?.Intl && typeof Date !== 'undefined') {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) userLocalTimeOfDay = 'morning';
            else if (hour >= 12 && hour < 17) userLocalTimeOfDay = 'afternoon';
            else if (hour >= 17 && hour < 22) userLocalTimeOfDay = 'evening';
            else userLocalTimeOfDay = 'night';
        }
    } catch (_) {
        // If anything goes wrong, just skip this hint
        userLocalTimeOfDay = undefined;
    }

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
                message: userMessage,
                userLocalTimeOfDay,
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
