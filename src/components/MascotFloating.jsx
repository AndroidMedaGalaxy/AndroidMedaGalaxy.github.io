import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {generateResponseOpenAI, getSuggestedQueries} from '../utils/openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mascot image path
const mascotImg = import.meta.env.BASE_URL + 'images/droidmeda/mascot_jetpack_flipped_transparent_light.png';
// User image path (add your preferred user/avatar image to public/images/user.png)
const userImg = import.meta.env.BASE_URL + 'images/user.png';

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
                className="cv-download-tile flex flex-col items-start p-4 my-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 shadow-md border-2 border-purple-400">
                <p className="mb-2 text-white font-semibold">{text}</p>
                <a
                    href={file}
                    download="Rituraj-Sambherao-CV.pdf"
                    className="download-btn px-4 py-2 rounded-full bg-black/80 text-white font-semibold border border-cyan-400 shadow-lg hover:bg-cyan-700 hover:text-white transition drop-shadow"
                >
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
                     className="w-8 h-8 rounded-full shadow-[0_0_10px_#a855f7,0_0_8px_#0ea5e9] bg-black/70 border-2 border-purple-500 ml-2 flex-shrink-0"/>
            )}
            <div className={`relative px-4 py-2 rounded-xl text-white text-base ml-1 ${
                isAssistant
                    ? 'bg-black/70 border border-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_12px_#a855f7]/30'
                    : 'bg-black/50 border border-cyan-400 shadow-lg'
            }`}>
                {isAssistant ? (
                    <MarkdownWithSpacing>{text}</MarkdownWithSpacing>
                ) : (
                    <MarkdownWithSpacing>{text}</MarkdownWithSpacing>
                )}
            </div>
            {isUser && (
                <img src={userImg} alt="User"
                     className="w-8 h-8 rounded-full shadow-lg bg-slate-900 border-2 border-cyan-400 ml-2 flex-shrink-0"/>
            )}
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


export default function MascotFloating() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {role: 'assistant', text: 'Hello! How can I help you today?', timestamp: new Date()},
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [contextData, setContextData] = useState(null);
    const [activeSuggestions, setActiveSuggestions] = useState([
        ...getSuggestedQueries(),
    ]);

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
            return;
        }
        setMessages(msgs => [...msgs, {role: 'assistant', text: respText, timestamp: new Date()}]);
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
                        animate={{scale: mascotScale, boxShadow: "0 0 16px #a855f7, 0 0 20px #0ea5e9"}}
                        whileHover={{scale: 1.14, boxShadow: "0 0 42px #a855f7, 0 0 40px #0ea5e9"}}
                        exit={{opacity: 0, scale: 0.7, y: 24}}
                        transition={{type: "spring", stiffness: 530, damping: 30}}
                        className="fixed bottom-24 right-10 z-[51] w-20 h-20 rounded-full shadow-xl border-[2.5px] border-transparent flex items-center justify-center bg-black/20 transition-all"
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
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[96vw] h-[640px] rounded-[20px] shadow-2xl border border-transparent overflow-hidden backdrop-blur-md flex flex-col"
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
                                <span className="flex flex-col">
                                    <span className="font-bold text-white text-lg md:text-xl drop-shadow-md">Ask me anything</span>
                                    <span
                                        className="text-xs md:text-sm text-white/90">…as long as it's about Rituraj!</span>
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
                            className="flex-1 overflow-y-auto"
                            style={{scrollBehavior: 'smooth'}}
                        >
                            <div
                                className="flex flex-col gap-2 px-5 py-6 bg-black/60 backdrop-blur-lg h-full overflow-y-auto">
                                {messages.map((msg, idx) => (
                                    <ChatBubble {...msg} key={idx}/>
                                ))}
                                {typing && <TypingIndicator/>}
                                <span ref={messagesEndRef}/>
                            </div>
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
                                    disabled={typing}
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full p-3 text-white text-xl shadow-[0_0_14px_#a855f7] hover:scale-105 transition active:scale-95"
                                    style={{boxShadow: "0 0 16px 1px #a855f7, 0 0 8px #0ea5e9"}}
                                    aria-label="Send"
                                    disabled={typing}
                                >
                                    <svg width="24" height="24" fill="none">
                                        <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" stroke="#fff" strokeWidth={2}/>
                                    </svg>
                                </button>
                            </div>
                            {showSuggestions && activeSuggestions.length > 0 && (
                                <div
                                    className="flex flex-row gap-3 pt-2 pb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-black/20">
                                    {activeSuggestions.map((sugg, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="px-4 py-2 whitespace-nowrap rounded-full border-2 border-gradient-to-r from-purple-500 to-cyan-400 bg-black/60 text-white font-semibold text-sm shadow hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-400 hover:text-white transition"
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
