import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {generateResponseOpenAI, getSuggestedQueries} from '../utils/openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {soundEffects} from '../utils/soundEffects';

// Mascot image path
const mascotImg = import.meta.env.BASE_URL + 'images/droidmeda/mascot_jetpack_flipped_transparent_light.png';
// User image path (add your preferred user/avatar image to public/images/user.png)
// const userImg = import.meta.env.BASE_URL + 'images/user.png';

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

// ChatBubble: shows both user and assistant avatars and stylings based on role
function ChatBubble({role, text, timestamp, type, file}) {
    // Common class names
    const isAssistant = role === 'assistant';
    const isUser = role === 'user';
    if (type === "cv-download") {
        return (
            <div
                className="cv-download-tile flex flex-col items-start p-4 my-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border-2 border-[#0A66C2]">
                <p className="mb-2 text-slate-700 dark:text-slate-200 font-semibold">{text}</p>
                <a
                    href={file}
                    download="Rituraj_Sambherao_CV.pdf"
                    className="download-btn px-5 py-2.5 rounded-md text-[#0A66C2] dark:text-white bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold border-2 border-[#0A66C2] dark:border-cyan-400 shadow-md hover:shadow-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download CV
                </a>
            </div>
        );
    }
    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.36}}
            className={`flex items-end gap-3 group ${isAssistant ? 'justify-start' : 'justify-end'}`}
        >
            {isAssistant && (
                <img src={mascotImg} alt="Assistant"
                     className="w-8 h-8 rounded-full shadow-lg dark:shadow-[0_0_10px_#a855f7,0_0_8px_#0ea5e9] bg-white dark:bg-black/70 border-2 border-purple-400 dark:border-purple-500 ml-2 flex-shrink-0"/>
            )}
            <div className={`relative px-4 py-2 rounded-xl text-base ml-1 ${
                isAssistant
                    ? 'bg-purple-100 dark:bg-black/70 text-slate-900 dark:text-white border border-purple-300 dark:border-purple-500 shadow-md dark:shadow-[0_0_12px_#a855f7]/30'
                    : 'bg-cyan-100 dark:bg-black/50 text-slate-900 dark:text-white border border-cyan-400 shadow-md dark:shadow-lg'
            }`}>
                {isAssistant ? (
                    <MarkdownWithSpacing>{text}</MarkdownWithSpacing>
                ) : (
                    <MarkdownWithSpacing>{text}</MarkdownWithSpacing>
                )}
            </div>
            {isUser && (
                <span
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-cyan-600 dark:border-cyan-400 shadow-lg dark:shadow-[0_0_14px_#22d3ee,0_0_16px_#0ea5e9] ml-2 bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-500/20 dark:to-blue-500/20 dark:bg-black/60 flex-shrink-0">
                    {/* 8-bit or emoji face SVG */}
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="dark:[&_circle]:fill-[#293347] [&_circle]:fill-white">
                        <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="1.5" className="text-cyan-600 dark:text-cyan-400"/>
                        <ellipse cx="9.5" cy="10.6" rx="1" ry="1.5" className="fill-slate-700 dark:fill-white"/>
                        <ellipse cx="16.5" cy="10.6" rx="1" ry="1.5" className="fill-slate-700 dark:fill-white"/>
                        <ellipse cx="9.5" cy="10.8" rx=".45" ry=".6" className="fill-slate-900 dark:fill-slate-900"/>
                        <ellipse cx="16.5" cy="10.8" rx=".45" ry=".6" className="fill-slate-900 dark:fill-slate-900"/>
                        <path d="M9.8 16c.7 1.2 5.7 1.2 6.4 0" stroke="currentColor" strokeWidth="1.1"
                              strokeLinecap="round" className="text-cyan-700 dark:text-cyan-400"/>
                    </svg>
                </span>
            )}
        </motion.div>
    );
}

// Typing indicator
function TypingIndicator() {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center gap-2 mb-2 ml-2">
            <img src={mascotImg} alt="Assistant"
                 className="w-8 h-8 rounded-full shadow-lg dark:shadow-[0_0_10px_#a855f7,0_0_8px_#0ea5e9] bg-white dark:bg-black/70 border-2 border-purple-400 dark:border-purple-500"/>
            <span className="flex gap-1">
        {[0, 1, 2].map(i => (
            <motion.span key={i} className="inline-block w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                         animate={{y: [0, -5, 0], opacity: [1, 0.6, 1]}}
                         transition={{duration: 0.8, repeat: Infinity, repeatDelay: 0.2, delay: i * 0.2}}/>
        ))}
      </span>
        </motion.div>
    );
}


export default function MascotFloating() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Initialize sound effects and show initial greeting with typing animation
    useEffect(() => {
        if (open && initialLoad) {
            soundEffects.init();

            // Show typing indicator
            setTyping(true);

            // Simulate loading/typing for 1.2 seconds before showing greeting
            const timer = setTimeout(() => {
                setMessages([{
                    role: 'assistant',
                    text: 'Hello! How can I help you today?',
                    timestamp: new Date()
                }]);
                setTyping(false);
                setInitialLoad(false);

                // Play sound when greeting appears
                soundEffects.playAIResponse();
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [open, initialLoad]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [contextData, setContextData] = useState(null);
    const [activeSuggestions, setActiveSuggestions] = useState([
        ...getSuggestedQueries(),
    ]);
    // Shooting star arc state
    const [showArc, setShowArc] = useState(true);
    useEffect(() => {
        // Hide arc after animation or when user opens chat
        if (!open && showArc) {
            const timeout = setTimeout(() => {
                setShowArc(false);
            }, 2300);
            return () => clearTimeout(timeout);
        } else if (open) {
            setShowArc(false);
        }
    }, [open, showArc]);

    // Load context from /data/context.json once
    useEffect(() => {
        if (!contextData) {
            fetch('/data/context.json')
                .then(r => {
                    if (!r.ok) {
                        throw new Error(`Status ${r.status}`);
                    }
                    return r.json();
                })
                .then(setContextData)
                .catch(() => {
                    setContextData([]);
                });
        }
    }, [contextData]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages, typing, open]);

    // Auto-focus input when typing completes
    useEffect(() => {
        if (!typing && open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [typing, open]);

    const isContextLoaded = contextData && Array.isArray(contextData) && contextData.length > 0;

    // Show suggestions if input blank or only "rituraj" (stopword immune)
    const cleanedInput = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const showSuggestions = !cleanedInput || cleanedInput === 'rituraj';

    async function sendMessage(evt, overrideText = null) {
        if (evt) evt.preventDefault();
        const msg = overrideText !== null ? overrideText : input.trim();
        if (!msg) return;
        const now = new Date();
        setMessages(msgs => [...msgs, {role: 'user', text: msg, timestamp: now}]);
        setInput('');
        setTyping(true);
        let respText = '';
        try {
            // All context retrieval and OpenAI calls happen securely on the server
            respText = await generateResponseOpenAI({
                userMessage: msg
            });
        } catch (e) {
            respText = "Sorry, there was an error contacting the assistant.";
        }
        setTyping(false);
        if (respText.trim() === "<<DOWNLOAD_CV>>") {
            setMessages(msgs => [...msgs, {
                type: "cv-download",
                text: "You can download Rituraj's CV below.",
                file: "/assets/Rituraj_Sambherao_CV.pdf"
            }]);
            // Play cyberpunk notification sound
            soundEffects.playAIResponse();
            return;
        }
        setMessages(msgs => [...msgs, {role: 'assistant', text: respText, timestamp: new Date()}]);
        // Play cyberpunk notification sound for AI response
        soundEffects.playAIResponse();
    }

    function handleSuggestionClick(sugg) {
        if (sugg === "Download his CV") {
            // Update the path if your PDF lives elsewhere
            const link = document.createElement('a');
            link.href = import.meta.env.BASE_URL + 'cv.pdf';
            link.download = 'Rituraj_Sambherao_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            sendMessage(null, sugg);
        }
        setActiveSuggestions(suggestions => suggestions.filter(s => s !== sugg));
    }

    const mascotScale = open ? 1.08 : 1;

    return (
        <>
            {/* Mascot floating button only when chat closed */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={false}
                        animate={{scale: mascotScale}}
                        whileHover={{scale: 1.14}}
                        exit={{opacity: 0, scale: 0.7, y: 24}}
                        transition={{type: "spring", stiffness: 530, damping: 30}}
                        className="fixed bottom-24 right-10 z-[51] w-20 h-20 rounded-full shadow-2xl border-[3px] border-cyan-400 dark:border-cyan-400 flex items-center justify-center bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/40 hover:from-purple-200 hover:to-cyan-200 dark:hover:from-purple-800/50 dark:hover:to-cyan-800/50 transition-all overflow-visible ring-4 ring-cyan-300/30 dark:ring-cyan-400/20"
                        style={{
                            pointerEvents: 'auto',
                            boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(14, 165, 233, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)'
                        }}
                        aria-label={open ? "Hide Chat" : "Open chat"}
                        onClick={() => setOpen(true)}
                    >
                        {/* Neon pop sparkles background effect (Disney like) */}
                        {showArc && (
                            <span
                                className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none select-none">
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 200 200"
                                    className="block"
                                >
                                    {/* Large main sparkle offset so it peeks around the mascot */}
                                    <g style={{opacity: 0, animation: 'spark-pop-strong 1.1s 0.15s forwards'}}>
                                        <polygon
                                            points="120,40 132,88 180,100 132,112 120,160 108,112 60,100 108,88"
                                            fill="url(#spark0)"
                                            filter="url(#sparkGlow0)"
                                        />
                                    </g>
                                    {/* Top-right medium sparkle */}
                                    <g style={{opacity: 0, animation: 'spark-pop 1s 0.32s forwards'}}>
                                        <polygon
                                            points="145,70 149,86 166,92 149,96 145,112 141,96 124,92 141,86"
                                            fill="url(#spark1)"
                                            filter="url(#sparkGlow1)"
                                        />
                                    </g>
                                    {/* Top-left medium sparkle */}
                                    <g style={{opacity: 0, animation: 'spark-pop 0.95s 0.42s forwards'}}>
                                        <polygon
                                            points="55,55 58,69 72,73 58,77 55,91 51,77 38,73 51,69"
                                            fill="url(#spark2)"
                                            filter="url(#sparkGlow2)"
                                        />
                                    </g>
                                    {/* Lower-right small sparkle */}
                                    <g style={{opacity: 0, animation: 'spark-pop 0.9s 0.58s forwards'}}>
                                        <polygon
                                            points="145,135 147,144 157,148 147,151 145,161 142,151 133,148 142,144"
                                            fill="url(#spark3)"
                                            filter="url(#sparkGlow3)"
                                        />
                                    </g>
                                    {/* Lower-left small sparkle */}
                                    <g style={{opacity: 0, animation: 'spark-pop 0.85s 0.7s forwards'}}>
                                        <polygon
                                            points="60,135 62,143 71,146 62,149 60,158 58,149 49,146 58,143"
                                            fill="url(#spark4)"
                                            filter="url(#sparkGlow4)"
                                        />
                                    </g>
                                    {/* Tiny center sparkle / flare */}
                                    <g style={{opacity: 0, animation: 'spark-pop 0.8s 0.82s forwards'}}>
                                        <polygon
                                            points="100,35 102,44 111,47 102,50 100,59 98,50 89,47 98,44"
                                            fill="url(#spark1)"
                                            filter="url(#sparkGlow1)"
                                        />
                                    </g>

                                    <defs>
                                        <linearGradient id="spark0" x1="80" y1="35" x2="150" y2="165" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#67f9ff"/>
                                            <stop offset="0.6" stopColor="#22d3ee"/>
                                            <stop offset="1" stopColor="#0ea5e9"/>
                                        </linearGradient>
                                        <linearGradient id="spark1" x1="135" y1="60" x2="175" y2="115" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#38bdf8"/>
                                            <stop offset="1" stopColor="#0ea5e9"/>
                                        </linearGradient>
                                        <linearGradient id="spark2" x1="45" y1="50" x2="78" y2="95" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#22d3ee"/>
                                            <stop offset="1" stopColor="#21afff"/>
                                        </linearGradient>
                                        <linearGradient id="spark3" x1="135" y1="130" x2="165" y2="165" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#67f9ff"/>
                                            <stop offset="1" stopColor="#0ea5e9"/>
                                        </linearGradient>
                                        <linearGradient id="spark4" x1="50" y1="130" x2="75" y2="165" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#0ea5e9"/>
                                            <stop offset="1" stopColor="#00fff7"/>
                                        </linearGradient>

                                        <filter id="sparkGlow0" x="40" y="20" width="140" height="160">
                                            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                        <filter id="sparkGlow1" x="115" y="50" width="80" height="80">
                                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                        <filter id="sparkGlow2" x="30" y="45" width="60" height="60">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                        <filter id="sparkGlow3" x="120" y="120" width="60" height="60">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                        <filter id="sparkGlow4" x="40" y="120" width="55" height="55">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    <style>{`
                                    @keyframes spark-pop {
                                        0% { opacity: 0; transform: scale(0.5) translate3d(0, 8px, 0); }
                                        25% { opacity: 0.9; transform: scale(1.1) translate3d(0, 0, 0); }
                                        70% { opacity: 0.95; transform: scale(1); }
                                        100% { opacity: 0; transform: scale(1.08) translate3d(0, -4px, 0); }
                                    }
                                    @keyframes spark-pop-strong {
                                        0% { opacity: 0; transform: scale(0.4) translate3d(-4px, 10px, 0); }
                                        20% { opacity: 1; transform: scale(1.15) translate3d(0, 0, 0); }
                                        60% { opacity: 1; transform: scale(1); }
                                        100% { opacity: 0; transform: scale(1.12) translate3d(4px, -6px, 0); }
                                    }
                                    `}</style>
                                </svg>
                            </span>
                        )}
                        <img
                            src={mascotImg}
                            alt="DroidMeda Mascot"
                            width={68}
                            height={68}
                            className="object-contain relative z-50"
                            style={{
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))'
                            }}
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
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[96vw] h-[640px] rounded-[20px] shadow-2xl border border-slate-300 dark:border-transparent bg-gradient-to-br from-purple-100 via-cyan-50 to-blue-100 dark:from-purple-900/40 dark:via-slate-900/60 dark:to-blue-900/40 overflow-hidden backdrop-blur-md flex flex-col"
                    >
                        {/* Mascot + Name in Header */}
                        <div
                            className="relative h-20 sm:h-24 rounded-t-[18px] sm:rounded-t-[20px] border-b border-slate-300 dark:border-white/10 bg-gradient-to-r from-purple-200 via-cyan-100 to-blue-200 dark:from-purple-900/60 dark:via-slate-900/80 dark:to-blue-900/60 flex items-center px-3 sm:px-6"
                        >
                            <span className="flex items-center gap-4 z-10">
                                <img
                                    src={mascotImg}
                                    alt="AndroidMeda Mascot"
                                    className="w-14 h-14 rounded-full shadow-lg dark:shadow-[0_0_22px_#a855f7,0_0_20px_#0ea5e9] bg-white dark:bg-black/30 border-2 border-purple-400 dark:border-purple-500"
                                />
                                <span className="flex flex-col">
                                    <span className="font-bold text-slate-900 dark:text-white text-lg md:text-xl drop-shadow-sm">Ask me anything</span>
                                    <span
                                        className="text-xs md:text-sm text-slate-700 dark:text-white/90">…as long as it's about Rituraj!</span>
                                </span>
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
                                className="ml-auto z-10 bg-slate-200 dark:bg-black/30 hover:bg-slate-300 dark:hover:bg-white/10 p-2 rounded-full transition"
                                aria-label="Close Chat"
                            >
                                <svg width={22} height={22} viewBox="0 0 22 22">
                                    <path d="M6 6l10 10M16 6L6 16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-slate-700 dark:text-white"/>
                                </svg>
                            </button>
                        </div>
                        {/* Messages Area */}
                        <div
                            className="flex-1 overflow-y-auto"
                            style={{scrollBehavior: 'smooth'}}
                        >
                            <div
                                className="flex flex-col gap-2 px-5 py-6 bg-white/80 dark:bg-black/60 backdrop-blur-lg h-full overflow-y-auto">
                                {messages.map((msg, idx) => (
                                    <ChatBubble {...msg} key={idx}/>
                                ))}
                                {typing && <TypingIndicator/>}
                                <span ref={messagesEndRef}/>
                            </div>
                        </div>
                        {/* Input Bar */}
                        <form onSubmit={sendMessage}
                              className="px-5 py-4 bg-slate-100 dark:bg-black/80 border-t border-slate-300 dark:border-white/10 flex flex-col gap-2">
                            <div className="flex w-full gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    type="text"
                                    placeholder={typing ? 'Responding. Please wait…' : 'Type your message…'}
                                    className="flex-grow bg-white dark:bg-black/40 border border-slate-300 dark:border-transparent rounded-full px-5 py-2 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/50 outline-none transition focus:border-purple-500 shadow-sm focus:shadow-purple-500/50"
                                    autoFocus={open}
                                    disabled={typing}
                                />
                                <button
                                    type="submit"
                                    className="rounded-full p-3 text-xl shadow-lg bg-cyan-500 dark:bg-black/20 border-2 border-cyan-600 dark:border-cyan-400 transition hover:scale-105 active:scale-95 hover:bg-cyan-600 dark:hover:bg-cyan-500/20"
                                    aria-label="Send"
                                    disabled={typing}
                                >
                                    <svg width="24" height="24" fill="none" className="dark:drop-shadow-[0_0_8px_#22d3ee]">
                                        <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" stroke="white" className="dark:stroke-[url(#neon-linear)]"
                                              strokeWidth={2}/>
                                        <defs>
                                            <linearGradient id="neon-linear" x1="4" y1="12" x2="18" y2="5"
                                                            gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#22d3ee"/>
                                                <stop offset="0.55" stopColor="#21afff"/>
                                                <stop offset="1" stopColor="#0ea5e9"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                            {showSuggestions && activeSuggestions.length > 0 && (
                                <div
                                    className="flex flex-row gap-3 pt-2 pb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-200 dark:scrollbar-track-black/20">
                                    {activeSuggestions.map((sugg, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="px-4 py-2 whitespace-nowrap rounded-full border-2 border-purple-400 dark:border-gradient-to-r dark:from-purple-500 dark:to-cyan-400 bg-white dark:bg-black/60 text-slate-900 dark:text-white font-semibold text-sm shadow hover:bg-purple-50 dark:hover:bg-gradient-to-r dark:hover:from-purple-600 dark:hover:to-cyan-400 transition"
                                            onClick={() => handleSuggestionClick(sugg)}
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
