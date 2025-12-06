import React, {useState, useRef, useEffect} from 'react';
import {HiOutlineChatBubbleOvalLeft} from 'react-icons/hi2';
import {motion, AnimatePresence} from 'framer-motion';
import {retrieveRelevantContext, generateResponseOpenAI, getSuggestedQueries} from '../utils/openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mascot image path
const mascotImg = import.meta.env.BASE_URL + 'images/droidmeda/mascot_jetpack_flipped_transparent_light.png';

// Helper to preserve multiple newlines as visible space
function MarkdownWithSpacing({children}) {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>,
            p: ({node, ...props}) => <p style={{marginBottom: '1.1em'}} {...props} />
        }}
    >
        {children}
    </ReactMarkdown>;
}

// ChatBubble: shows mascot avatar if role = assistant
function ChatBubble({role, text, timestamp}) {
    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.36}}
            className={`flex items-end gap-2 group ${role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
            {role === 'assistant' && (
                <img src={mascotImg} alt="Assistant"
                     className="w-8 h-8 rounded-full shadow-[0_0_10px_#a855f7,0_0_8px_#0ea5e9] bg-black/70 border-2 border-purple-500"/>
            )}
            <div className={`relative pl-8 px-4 py-2 rounded-xl text-white text-base ${role === 'assistant'
                ? 'bg-black/70 border border-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_12px_#a855f7]/30'
                : 'bg-black/50'}
            `}>
                {role === 'assistant'
                    ? <MarkdownWithSpacing>{text}</MarkdownWithSpacing>
                    : text}
                <span
                    className="absolute bottom-[-1.2em] left-0 opacity-0 group-hover:opacity-90 text-xs text-slate-400 transition pointer-events-none">{timestamp && new Date(timestamp).toLocaleTimeString()}</span>
            </div>
        </motion.div>
    );
}

// Typing indicator
function TypingIndicator() {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center gap-2 mb-2 ml-2">
            <img src={mascotImg} alt="Assistant"
                 className="w-8 h-8 rounded-full shadow-[0_0_10px_#a855f7,0_0_8px_#0ea5e9] bg-black/70 border-2 border-purple-500"/>
            <span className="flex gap-1">
        {[0, 1, 2].map(i => (
            <motion.span key={i} className="inline-block w-2 h-2 bg-purple-500 rounded-full"
                         animate={{y: [0, -5, 0], opacity: [1, 0.6, 1]}}
                         transition={{duration: 0.8, repeat: Infinity, repeatDelay: 0.2, delay: i * 0.2}}/>
        ))}
      </span>
        </motion.div>
    );
}

const SYSTEM_PROMPT = `You are the AndroidMeda Assistant. You must ONLY answer questions using the provided context: experience, projects, skills, and blog summaries. If the user asks anything unrelated, politely decline. Be concise, clear, and professional.`;

function getOpenAIKeyFromEnvFile() {
    try {
        // Works in dev/Node: fetch ai_env file from public
        return fetch('/ai_env')
            .then(r => r.text())
            .then(text => {
                const match = text.match(/AI_OPENAI_API_KEY=(\S+)/);
                return match ? match[1] : '';
            });
    } catch (e) {
        return Promise.resolve('');
    }
}

export default function MascotFloating() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {role: 'assistant', text: 'Hello! How can I help you today?', timestamp: new Date()},
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [contextData, setContextData] = useState(null);
    const [aiKey, setAIKey] = useState('');

    // Load context from /data/context.json once
    useEffect(() => {
        if (!contextData) {
            fetch('/data/context.json')
                .then(r => {
                    console.log('Fetching /data/context.json. HTTP status:', r.status);
                    if (!r.ok) {
                        throw new Error(`Status ${r.status}`);
                    }
                    return r.json();
                })
                .then(setContextData)
                .catch((e) => {
                    setContextData([]);
                    setMessages(msgs => [...msgs, {
                        role: 'assistant',
                        text: "Unable to load or find /data/context.json. Please ensure your context file is placed in the public/data/ folder and accessible.",
                        timestamp: new Date(),
                    }]);
                    console.error('Error loading /data/context.json:', e);
                });
        }
    }, [contextData]);

    // Fetch OpenAI key from ai_env
    useEffect(() => {
        if (!aiKey) {
            getOpenAIKeyFromEnvFile().then(setAIKey);
        }
    }, [aiKey]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages, typing, open]);

    const isContextLoaded = contextData && Array.isArray(contextData) && contextData.length > 0;

    // Show suggestions if input blank or only "rituraj" (stopword immune)
    const cleanedInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const showSuggestions = !cleanedInput || cleanedInput === 'rituraj';
    const suggestions = [
        ...getSuggestedQueries(),
        "Interests",
        "Show interests"
    ];

    async function sendMessage(evt, overrideText = null) {
        if (evt) evt.preventDefault();
        if (!isContextLoaded) {
            setMessages(msgs => [...msgs, {
                role: 'assistant',
                text: "I'm still loading my background info. Please wait a moment and try again.",
                timestamp: new Date()
            }]);
            setTyping(false);
            return;
        }
        const msg = overrideText !== null ? overrideText : input.trim();
        if (!msg) return;
        const now = new Date();
        setMessages(msgs => [...msgs, {role: 'user', text: msg, timestamp: now}]);
        setInput('');
        setTyping(true);
        let respText = '';
        try {
            const contextSnippet = retrieveRelevantContext(contextData, msg);
            console.log('User Q:', msg, '\nContext snippet:', contextSnippet, '\nContext length:', contextSnippet.length, '\nAPI Key:', aiKey);
            console.log('Before calling OpenAI API');
            respText = await generateResponseOpenAI({
                userMessage: msg,
                contextSnippet,
                apiKey: aiKey
            });
        } catch (e) {
            respText = "Sorry, there was an error contacting the assistant.";
        }
        setMessages(msgs => [...msgs, {role: 'assistant', text: respText, timestamp: new Date()}]);
        setTyping(false);
    }

    const mascotScale = open ? 1.08 : 1;

    return (
        <>
            {/* Mascot floating button only when chat closed */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={false}
                        animate={{scale: mascotScale, boxShadow: "0 0 16px #a855f7, 0 0 20px #0ea5e9"}}
                        whileHover={{scale: 1.14, boxShadow: "0 0 42px #a855f7, 0 0 40px #0ea5e9"}}
                        exit={{opacity: 0, scale: 0.7, y: 24}}
                        transition={{type: "spring", stiffness: 530, damping: 30}}
                        className="fixed bottom-12 right-10 z-[51] w-20 h-20 rounded-full shadow-xl border-[2.5px] border-transparent flex items-center justify-center bg-black/20 transition-all"
                        style={{pointerEvents: 'auto'}}
                        aria-label={open ? "Hide Chat" : "Open chat"}
                        onClick={() => setOpen(true)}
                    >
                        <img
                            src={mascotImg}
                            alt="DroidMeda Mascot"
                            width={68}
                            height={68}
                            className="object-contain drop-shadow-xl"
                            style={{pointerEvents: 'none'}}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Animate chat panel (Framer Motion) */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chat-panel"
                        initial={{opacity: 0, y: 40, scale: 0.97}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 40, scale: 0.96}}
                        transition={{type: "spring", stiffness: 330, damping: 30}}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[96vw] h-[640px] md:h-[540px] rounded-[20px] shadow-2xl border border-transparent overflow-hidden backdrop-blur-md"
                    >
                        {/* Mascot + Name in Header */}
                        <div
                            className="relative h-24 bg-gradient-to-br from-purple-600 via-purple-400 to-cyan-400 rounded-t-[20px] border-b border-white/10 flex items-center px-6"
                        >
                            <span className="flex items-center gap-4 z-10">
                                <img
                                    src={mascotImg}
                                    alt="AndroidMeda Mascot"
                                    className="w-14 h-14 rounded-full shadow-[0_0_22px_#a855f7,0_0_20px_#0ea5e9] bg-black/30 border-2 border-purple-500"
                                />
                                <span className="font-bold text-white text-xl drop-shadow-md">AndroidMeda</span>
                            </span>
                            {/* Subtle stars -- minimal for visual */}
                            <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                                <span
                                    className="absolute left-12 top-3 w-1 h-1 bg-white/80 rounded-full opacity-60 blur-[2px]"
                                />
                                <span
                                    className="absolute left-40 top-8 w-1.5 h-1.5 bg-white/60 rounded-full opacity-70 blur-[3px]"
                                />
                                <span
                                    className="absolute right-20 top-6 w-1 h-1 bg-white/70 rounded-full opacity-60 blur-[2px]"
                                />
                                <span
                                    className="absolute right-28 bottom-2 w-1 h-1 bg-white/40 rounded-full opacity-40 blur-[3px]"
                                />
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className="ml-auto z-10 bg-black/30 hover:bg-white/10 p-2 rounded-full transition"
                                aria-label="Close Chat"
                            >
                                <svg width={22} height={22} viewBox="0 0 22 22">
                                    <path d="M6 6l10 10M16 6L6 16" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        {/* Messages Area */}
                        <div
                            className="flex flex-col gap-2 px-5 py-6 h-[410px] md:h-[310px] overflow-y-auto bg-black/60 backdrop-blur-lg"
                            style={{scrollBehavior: 'smooth'}}
                        >
                            {messages.map((msg, idx) => (
                                <ChatBubble role={msg.role} text={msg.text} timestamp={msg.timestamp} key={idx}/>
                            ))}
                            {typing && <TypingIndicator/>}
                            <span ref={messagesEndRef}/>
                        </div>
                        {/* Input Bar */}
                        <form onSubmit={sendMessage}
                              className="px-5 py-4 bg-black/80 border-t border-white/10 flex flex-col gap-2">
                            <div className="flex w-full gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    type="text"
                                    placeholder="Type your message…"
                                    className="flex-grow bg-black/40 border border-transparent rounded-full px-5 py-2 text-white placeholder:text-white/50 outline-none transition focus:border-purple-500 shadow-sm focus:shadow-purple-500/50"
                                    autoFocus={open}
                                    disabled={!isContextLoaded || typing}
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full p-3 text-white text-xl shadow-[0_0_14px_#a855f7] hover:scale-105 transition active:scale-95"
                                    style={{boxShadow: "0 0 16px 1px #a855f7, 0 0 8px #0ea5e9"}}
                                    aria-label="Send"
                                    disabled={!isContextLoaded || typing}
                                >
                                    <svg width="24" height="24" fill="none">
                                        <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" stroke="#fff" strokeWidth={2}/>
                                    </svg>
                                </button>
                            </div>
                            {showSuggestions && (
                                <div className="flex flex-wrap gap-3 pt-2 justify-start">
                                    {suggestions.map((sugg, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="px-4 py-2 rounded-full border-2 border-gradient-to-r from-purple-500 to-cyan-400 bg-black/60 text-white font-semibold text-sm shadow hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-400 hover:text-white transition"
                                            onClick={() => sendMessage(null, sugg)}
                                            disabled={typing}
                                        >
                                            {sugg}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
