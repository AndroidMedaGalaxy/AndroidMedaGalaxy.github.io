import { profile, skills } from '../data/cv';
import {useEffect, useState} from 'react';
import MascotFloating from '../components/MascotFloating.jsx';

export default function Home() {
    // Code journey milestone data (loaded from JSON)
    const [journeySteps, setJourneySteps] = useState(null);
    // Default fallback journey in case JSON fetch fails or is missing
    const fallbackJourney = [
        '$ Initializing Android runtime...',
        '$ Kotlin compiler & coroutines loaded',
        '$ Jetpack Compose UI toolkit mounted',
        '$ ViewModel & navigation graph ready',
        '$ All systems green • Ready to compose'
    ];

    useEffect(() => {
        fetch('/data/journey.json')
            .then(r => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(setJourneySteps)
            .catch(() => {
                setJourneySteps(fallbackJourney);
            });
    }, []);

    // CODE SNIPPET LOOP ANIMATION
    const [snippetIndex, setSnippetIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [typing, setTyping] = useState(false);
    // Dino jump effect
    const [dinoJump, setDinoJump] = useState(false);
    const [showFinal, setShowFinal] = useState(false);

    useEffect(() => {
        if (!journeySteps || !Array.isArray(journeySteps)) return;

        // If we're at the last (final) message, do not loop again, just blink
        if (snippetIndex >= journeySteps.length) return;

        let timeout;
        let animation;
        setTyping(true);
        let char = 0;
        function typeNextChar() {
            setDisplayed(journeySteps[snippetIndex].slice(0, char + 1));
            char++;
            if (char < journeySteps[snippetIndex].length) {
                animation = setTimeout(typeNextChar, 26 + Math.random() * 30);
            } else {
                setTyping(false);
                // Trigger dino jump when a milestone completes
                setDinoJump(true);
                setTimeout(() => setDinoJump(false), 430);
                // If not at last step, move to next after pause
                if (snippetIndex < journeySteps.length - 1) {
                    timeout = setTimeout(() => {
                        setSnippetIndex(i => i + 1);
                    }, 1050 + Math.random() * 950);
                } else {
                    // At last step, after pause, show final message and don't repeat
                    timeout = setTimeout(() => {
                        setShowFinal(true);
                    }, 1250);
                }
            }
        }
        typeNextChar();
        return () => {
            clearTimeout(timeout);
            clearTimeout(animation);
        };
    }, [snippetIndex, journeySteps]);

    // For the terminal rendering
    let contentLine;
    if (!showFinal) {
        contentLine = (
            <span>{displayed}<span className="ml-1 animate-pulse">▍</span></span>
        );
    } else {
        contentLine = (
            <span className="text-green-400 animate-blink-slow">$ Looking for next challenge… <span
                className="ml-1 animate-pulse">▍</span></span>
        );
    }

    // Dino/hoops/progress render logic
    const totalMilestones = journeySteps ? journeySteps.length : 0;
    const currentStep = showFinal ? totalMilestones : snippetIndex + 1;
    // Progress bar percentage
    const progressPercent = totalMilestones > 1 ? ((currentStep - 1) / (totalMilestones - 1)) * 100 : 100;
    // Dino's position in px (it tracks the progress bar visually)
    const dinoLeft = showFinal
        ? '50%'
        : `calc(${Math.max(0, (currentStep - 1) / (totalMilestones - 1) * 80)}%)`;
    // Handle center of bar for final state

    return (
        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-12 pt-8">
            <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
                <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-500 dark:text-teal-400">
                        Android · Kotlin · Jetpack Compose
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                        {profile.name}
                    </h1>
                    <p className="mt-1 text-lg text-slate-700 dark:text-slate-200">{profile.title}</p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {profile.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                        <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md px-5 py-2.5 font-semibold text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            View LinkedIn
                        </a>
                        <a
                            href="/assets/Rituraj_Sambherao_CV.pdf"
                            download="Rituraj-Sambherao-CV.pdf"
                            className="rounded-md px-5 py-2.5 font-semibold text-[#0A66C2] bg-white hover:bg-gray-100 border-2 border-[#0A66C2] dark:bg-slate-800 dark:hover:bg-slate-600 dark:text-[#4A9FE8] dark:border-[#4A9FE8] transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download CV
                        </a>
                    </div>
                </div>
                <div className="relative flex items-center justify-center">
                    {/* Animated Code Snippet Terminal with dino, hoops, and progress bar */}
                    <div
                        className="h-56 w-56 max-w-[95vw] flex flex-col justify-end items-center bg-white dark:bg-black/40 rounded-3xl overflow-hidden border-2 border-cyan-500 dark:border-cyan-400 shadow-lg dark:shadow-[0_0_24px_#22d3ee,0_0_32px_#0ea5e9] ring-2 ring-cyan-400/40 dark:ring-cyan-400/20 backdrop-blur-md"
                        style={{minHeight: '12rem'}}>
                        {/* Hoops Row (hide at final) */}
                        {!showFinal && (
                            <div className="flex justify-between items-end w-full px-5 pt-5" style={{height: '1.4rem'}}>
                                {Array.from({length: totalMilestones}).map((_, i) => (
                                    <span key={i}
                                          className={`inline-block rounded-full border-[2.5px] mx-[2px] ${i < currentStep ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-400/50 dark:bg-cyan-400/30' : 'border-slate-300 dark:border-cyan-900 bg-slate-200 dark:bg-cyan-950/10'} duration-200`}
                                          style={{width: '11px', height: '11px'}}/>
                                ))}
                            </div>
                        )}
                        {/* Progress Bar (hide at final) */}
                        {!showFinal && (
                            <div
                                className="w-[84%] mt-2 mb-2 h-2 bg-slate-200 dark:bg-cyan-900/50 rounded-full overflow-hidden flex items-center">
                                <div className="h-full transition-all duration-300 bg-cyan-500 dark:bg-cyan-400 rounded-full"
                                     style={{width: `${progressPercent}%`}}/>
                            </div>
                        )}
                        {/* Dino Row */}
                        <div className="relative flex items-end justify-center w-full flex-col flex-1">
                            {/* Moving Dino (final state: center vertically) */}
                            {!showFinal ? (
                                <div
                                    className={`absolute bottom-0 duration-200 transition-all dino-side-walk`} style={{
                                    left: `calc(${progressPercent}% - 18px)`,
                                    transitionTimingFunction: 'cubic-bezier(.55,1.55,.4,1)'
                                }}>
                                    {/* 8-bit sideways dino SVG with natural movements */}
                                    <svg width="36" height="28" viewBox="0 0 40 34" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="40" height="34" rx="6" className="fill-slate-100 dark:fill-[#171a22]"/>
                                        {/* Body - subtle breathing */}
                                        <g className="dino-body-breathe">
                                            <rect x="6" y="18" width="8" height="4" className="fill-cyan-300 dark:fill-[#aef9fb]"/>
                                            <rect x="14" y="14" width="14" height="8" className="fill-cyan-400 dark:fill-[#71e0ed]"/>
                                            <rect x="28" y="18" width="6" height="4" className="fill-cyan-500 dark:fill-[#58c2e8]"/>
                                            <rect x="22" y="10" width="6" height="12" className="fill-cyan-600 dark:fill-[#29a8dd]"/>
                                            <rect x="16" y="22" width="10" height="6" className="fill-cyan-500 dark:fill-[#23bcbc]"/>
                                        </g>
                                        {/* Head - subtle tilt */}
                                        <g className="dino-head-tilt">
                                            <rect x="18" y="6" width="10" height="8" className="fill-cyan-400 dark:fill-[#2ec2c9]"/>
                                            {/* Eye with blink */}
                                            <rect x="24" y="13" width="2" height="2" className="fill-slate-800 dark:fill-[#161c21] dino-eye-blink"/>
                                        </g>
                                        {/* Feather/crest details - subtle wave */}
                                        <g className="dino-feather-wave">
                                            <rect x="20" y="4" width="2" height="3" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.7"/>
                                            <rect x="23" y="3" width="2" height="4" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.8"/>
                                            <rect x="26" y="4" width="2" height="3" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.7"/>
                                        </g>
                                    </svg>
                                </div>
                            ) : (
                                <div
                                    className="w-full flex items-center flex-col justify-center duration-300 dino-final-idle"
                                    style={{transform: 'scale(2.5)', transition: 'transform 0.7s'}}
                                >
                                    {/* Front-facing dino with natural movements */}
                                    <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
                                        {/* Head with subtle bob */}
                                        <g className="dino-head-bob">
                                            <rect x="11" y="2" width="14" height="10" rx="3" className="fill-cyan-400 dark:fill-[#43e2d5]"/>
                                            <rect x="14" y="9" width="8" height="3" className="fill-cyan-500 dark:fill-[#23bcbc]"/>
                                            {/* Eyes with blink */}
                                            <rect x="15" y="7" width="2" height="2" className="fill-slate-800 dark:fill-[#161c21] dino-eye-blink"/>
                                            <rect x="19" y="7" width="2" height="2" className="fill-slate-800 dark:fill-[#161c21] dino-eye-blink"/>
                                            {/* Crest feathers - wave animation */}
                                            <g className="dino-crest-wave">
                                                <rect x="13" y="0" width="2" height="3" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.6"/>
                                                <rect x="17" y="-1" width="2" height="4" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.8"/>
                                                <rect x="21" y="0" width="2" height="3" className="fill-cyan-400 dark:fill-[#43e2d5]" opacity="0.6"/>
                                            </g>
                                        </g>
                                        {/* Body with breathing */}
                                        <g className="dino-body-breathe">
                                            <rect x="7" y="12" width="22" height="17" rx="4" className="fill-cyan-300 dark:fill-[#6df6ed]"/>
                                            <rect x="14" y="29" width="8" height="12" rx="2" className="fill-cyan-600 dark:fill-[#20a7c6]"/>
                                            <rect x="8" y="38" width="20" height="7" rx="3" className="fill-cyan-400 dark:fill-[#2ed2c9]"/>
                                        </g>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {/* Terminal text */}
                        <div className="w-full flex-1 flex flex-col justify-center">
                            <div
                                className="font-mono text-green-700 dark:text-cyan-200 text-sm leading-6 tracking-tight p-6 min-h-[3rem] overflow-y-auto break-words text-center">
                                {showFinal ? (
                                    <span className="text-green-600 dark:text-green-400 animate-blink-slow block text-center mt-6">Next level loading…<span
                                        className="ml-1 animate-pulse">▍</span></span>
                                ) : contentLine}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mobile</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.mobile.map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">CI/CD & Testing</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.ciCd.map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tooling & More</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {[...skills.tooling, ...skills.other].map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
            <style>{`
        @keyframes mascot-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }
        @keyframes blink-slow {
          0%, 100% { opacity: 1; }
          47%, 53% { opacity: 0.1; }
        }
        .animate-blink-slow {
          animation: blink-slow 1.65s infinite linear;
        }
        
        /* Natural dino animations */
        @keyframes dino-breathe {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.02, 0.98); }
        }
        @keyframes dino-head-tilt {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-1deg) translateY(-0.5px); }
          75% { transform: rotate(1deg) translateY(0.5px); }
        }
        @keyframes dino-head-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes dino-feather-wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          33% { transform: translateY(-1px) scaleY(1.1); }
          66% { transform: translateY(0.5px) scaleY(0.95); }
        }
        @keyframes dino-crest-wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(1.15); }
        }
        @keyframes dino-eye-blink {
          0%, 90%, 100% { opacity: 1; transform: scaleY(1); }
          93%, 97% { opacity: 0.1; transform: scaleY(0.1); }
        }
        
        .dino-body-breathe {
          animation: dino-breathe 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        .dino-head-tilt {
          animation: dino-head-tilt 4.5s ease-in-out infinite;
          transform-origin: center;
        }
        .dino-head-bob {
          animation: dino-head-bob 2.8s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .dino-feather-wave {
          animation: dino-feather-wave 2.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .dino-crest-wave {
          animation: dino-crest-wave 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .dino-eye-blink {
          animation: dino-eye-blink 5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
        </main>
    );
}
