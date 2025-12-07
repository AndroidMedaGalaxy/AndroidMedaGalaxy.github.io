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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
                        Android · Kotlin · Jetpack Compose
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                        {profile.name}
                    </h1>
                    <p className="mt-1 text-lg text-slate-200">{profile.title}</p>
                    <p className="mt-3 text-sm text-slate-300">
                        {profile.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                        <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl px-4 py-2 font-semibold text-white border-2 border-cyan-400 shadow-[0_0_12px_#22d3ee,0_0_32px_#0ea5e9] hover:bg-cyan-400/10 hover:text-cyan-200 transition backdrop-blur-md"
                        >
                            View LinkedIn →
                        </a>
                        <a
                            href="/assets/Rituraj_Sambherao_CV.pdf"
                            download="Rituraj-Sambherao-CV.pdf"
                            className="rounded-xl px-4 py-2 font-semibold text-white border-2 border-cyan-400 shadow-[0_0_12px_#22d3ee,0_0_32px_#0ea5e9] hover:bg-cyan-400/10 hover:text-cyan-200 transition backdrop-blur-md flex items-center"
                            style={{marginLeft: '0.5rem'}}
                        >
                            Download CV
                        </a>
                    </div>
                </div>
                <div className="relative flex items-center justify-center">
                    {/* Animated Code Snippet Terminal with dino, hoops, and progress bar */}
                    <div
                        className="h-56 w-56 max-w-[95vw] flex flex-col justify-end items-center bg-black/40 rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_24px_#22d3ee,0_0_32px_#0ea5e9] ring-2 ring-cyan-400/20 backdrop-blur-md"
                        style={{minHeight: '12rem'}}>
                        {/* Hoops Row (hide at final) */}
                        {!showFinal && (
                            <div className="flex justify-between items-end w-full px-5 pt-5" style={{height: '1.4rem'}}>
                                {Array.from({length: totalMilestones}).map((_, i) => (
                                    <span key={i}
                                          className={`inline-block rounded-full border-[2.5px] mx-[2px] ${i < currentStep ? 'border-cyan-400 bg-cyan-400/30' : 'border-cyan-900 bg-cyan-950/10'} duration-200`}
                                          style={{width: '11px', height: '11px'}}/>
                                ))}
                            </div>
                        )}
                        {/* Progress Bar (hide at final) */}
                        {!showFinal && (
                            <div
                                className="w-[84%] mt-2 mb-2 h-2 bg-cyan-900/50 rounded-full overflow-hidden flex items-center">
                                <div className="h-full transition-all duration-300 bg-cyan-400 rounded-full"
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
                                        <rect width="40" height="34" rx="6" fill="#171a22"/>
                                        {/* Body - subtle breathing */}
                                        <g className="dino-body-breathe">
                                            <rect x="6" y="18" width="8" height="4" fill="#aef9fb"/>
                                            <rect x="14" y="14" width="14" height="8" fill="#71e0ed"/>
                                            <rect x="28" y="18" width="6" height="4" fill="#58c2e8"/>
                                            <rect x="22" y="10" width="6" height="12" fill="#29a8dd"/>
                                            <rect x="16" y="22" width="10" height="6" fill="#23bcbc"/>
                                        </g>
                                        {/* Head - subtle tilt */}
                                        <g className="dino-head-tilt">
                                            <rect x="18" y="6" width="10" height="8" fill="#2ec2c9"/>
                                            {/* Eye with blink */}
                                            <rect x="24" y="13" width="2" height="2" fill="#161c21" className="dino-eye-blink"/>
                                        </g>
                                        {/* Feather/crest details - subtle wave */}
                                        <g className="dino-feather-wave">
                                            <rect x="20" y="4" width="2" height="3" fill="#43e2d5" opacity="0.7"/>
                                            <rect x="23" y="3" width="2" height="4" fill="#43e2d5" opacity="0.8"/>
                                            <rect x="26" y="4" width="2" height="3" fill="#43e2d5" opacity="0.7"/>
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
                                            <rect x="11" y="2" width="14" height="10" rx="3" fill="#43e2d5"/>
                                            <rect x="14" y="9" width="8" height="3" fill="#23bcbc"/>
                                            {/* Eyes with blink */}
                                            <rect x="15" y="7" width="2" height="2" fill="#161c21" className="dino-eye-blink"/>
                                            <rect x="19" y="7" width="2" height="2" fill="#161c21" className="dino-eye-blink"/>
                                            {/* Crest feathers - wave animation */}
                                            <g className="dino-crest-wave">
                                                <rect x="13" y="0" width="2" height="3" fill="#43e2d5" opacity="0.6"/>
                                                <rect x="17" y="-1" width="2" height="4" fill="#43e2d5" opacity="0.8"/>
                                                <rect x="21" y="0" width="2" height="3" fill="#43e2d5" opacity="0.6"/>
                                            </g>
                                        </g>
                                        {/* Body with breathing */}
                                        <g className="dino-body-breathe">
                                            <rect x="7" y="12" width="22" height="17" rx="4" fill="#6df6ed"/>
                                            <rect x="14" y="29" width="8" height="12" rx="2" fill="#20a7c6"/>
                                            <rect x="8" y="38" width="20" height="7" rx="3" fill="#2ed2c9"/>
                                        </g>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {/* Terminal text */}
                        <div className="w-full flex-1 flex flex-col justify-center">
                            <div
                                className="font-mono text-cyan-200 text-sm leading-6 tracking-tight p-6 min-h-[3rem] overflow-y-auto break-words text-center">
                                {showFinal ? (
                                    <span className="text-green-400 animate-blink-slow block text-center mt-6">Next level loading…<span
                                        className="ml-1 animate-pulse">▍</span></span>
                                ) : contentLine}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-100">Mobile</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.mobile.map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-100">CI/CD & Testing</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skills.ciCd.map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <h2 className="text-sm font-semibold text-slate-100">Tooling & More</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {[...skills.tooling, ...skills.other].map((s) => (
                            <span
                                key={s}
                                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200"
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
