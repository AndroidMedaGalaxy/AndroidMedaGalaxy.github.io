import { profile, skills } from '../data/cv';
import {useEffect, useState} from 'react';

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
                        className="h-64 w-64 max-w-[95vw] flex flex-col justify-end items-center bg-white dark:bg-black/40 rounded-3xl overflow-hidden border-2 border-cyan-500 dark:border-cyan-400 shadow-lg dark:shadow-[0_0_24px_#22d3ee,0_0_32px_#0ea5e9] ring-2 ring-cyan-400/40 dark:ring-cyan-400/20 backdrop-blur-md"
                        style={{minHeight: '14rem'}}>
                        {/* Planets Row (hide at final) */}
                        {!showFinal && (
                            <div className="flex justify-between items-end w-full px-5 pt-6" style={{height: '1.8rem'}}>
                                {Array.from({length: totalMilestones}).map((_, i) => {
                                    // Define realistic planet styles
                                    const planets = [
                                        { name: 'Earth', colors: 'from-blue-500 to-green-500', darkColors: 'from-blue-400 to-green-400', detail: 'bg-green-400/60', detailDark: 'bg-green-300/50' },
                                        { name: 'Mars', colors: 'from-red-500 to-orange-600', darkColors: 'from-red-400 to-orange-500', detail: 'bg-orange-300/60', detailDark: 'bg-orange-200/50' },
                                        { name: 'Jupiter', colors: 'from-orange-400 to-amber-600', darkColors: 'from-orange-300 to-amber-500', detail: 'bg-amber-200/60', detailDark: 'bg-amber-100/50', hasStripes: true },
                                        { name: 'Saturn', colors: 'from-yellow-300 to-amber-400', darkColors: 'from-yellow-200 to-amber-300', detail: 'bg-yellow-100/60', detailDark: 'bg-yellow-50/50', hasRing: true },
                                        { name: 'Venus', colors: 'from-yellow-500 to-orange-500', darkColors: 'from-yellow-400 to-orange-400', detail: 'bg-yellow-300/60', detailDark: 'bg-yellow-200/50' },
                                    ];
                                    const planet = planets[i % planets.length];
                                    const isActive = i < currentStep;

                                    return (
                                        <div key={i} className="relative mx-[2px]">
                                            {/* Planet */}
                                            <div className={`rounded-full transition-all duration-200 relative overflow-hidden ${
                                                isActive 
                                                    ? `bg-gradient-to-br ${planet.colors} dark:${planet.darkColors} shadow-lg` 
                                                    : 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800'
                                            }`} style={{width: '16px', height: '16px'}}>
                                                {/* Planet surface details */}
                                                {isActive && (
                                                    <>
                                                        <div className={`absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full ${planet.detail} dark:${planet.detailDark}`}></div>
                                                        <div className={`absolute bottom-1 right-0.5 w-1 h-1 rounded-full ${planet.detail} dark:${planet.detailDark} opacity-70`}></div>
                                                        {planet.hasStripes && (
                                                            <>
                                                                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/20"></div>
                                                                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/20"></div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            {/* Saturn's ring */}
                                            {isActive && planet.hasRing && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-amber-300/50 dark:via-amber-200/40 to-transparent transform -rotate-12"></div>
                                            )}
                                        </div>
                                    );
                                })}
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
                            {/* Moving Spaceship (final state: center vertically) */}
                            {!showFinal ? (
                                <div
                                    className={`absolute bottom-2 duration-200 transition-all spaceship-hover`} style={{
                                    left: `calc(${progressPercent}% - 30px)`,
                                    transitionTimingFunction: 'cubic-bezier(.55,1.55,.4,1)'
                                }}>
                                    {/* Spaceship SVG - side view */}
                                    <svg width="60" height="50" viewBox="0 0 44 36" xmlns="http://www.w3.org/2000/svg">
                                        {/* Exhaust flame - animated */}
                                        <g className="spaceship-flame">
                                            <ellipse cx="6" cy="18" rx="4" ry="2.5" className="fill-orange-400 dark:fill-orange-300" opacity="0.8"/>
                                            <ellipse cx="4" cy="18" rx="3" ry="2" className="fill-yellow-400 dark:fill-yellow-300" opacity="0.9"/>
                                        </g>
                                        {/* Main body */}
                                        <ellipse cx="24" cy="18" rx="12" ry="6" className="fill-slate-200 dark:fill-slate-300"/>
                                        {/* Cockpit window */}
                                        <ellipse cx="28" cy="16" rx="4" ry="3" className="fill-sky-400 dark:fill-sky-300" opacity="0.8"/>
                                        <ellipse cx="28" cy="16" rx="2.5" ry="2" className="fill-slate-800 dark:fill-slate-900" opacity="0.3"/>
                                        {/* Nose cone */}
                                        <path d="M36 18 L40 16 L40 20 Z" className="fill-cyan-500 dark:fill-cyan-400"/>
                                        {/* Wings */}
                                        <g className="spaceship-wing-tilt">
                                            <path d="M20 12 L22 8 L26 12 Z" className="fill-cyan-500 dark:fill-cyan-400"/>
                                            <path d="M20 24 L22 28 L26 24 Z" className="fill-cyan-500 dark:fill-cyan-400"/>
                                        </g>
                                        {/* Details/panels */}
                                        <rect x="16" y="17" width="12" height="0.5" className="fill-slate-400 dark:fill-slate-500" opacity="0.5"/>
                                        <circle cx="18" cy="18" r="0.8" className="fill-cyan-400 dark:fill-cyan-300" opacity="0.6"/>
                                        <circle cx="22" cy="18" r="0.8" className="fill-cyan-400 dark:fill-cyan-300" opacity="0.6"/>
                                    </svg>
                                </div>
                            ) : (
                                <div
                                    className="w-full flex items-center flex-col justify-center duration-300 falcon-hover"
                                    style={{transform: 'scale(6.4)', transition: 'transform 0.7s', marginTop: '2rem'}}
                                >
                                    {/* Millennium Falcon inspired spaceship - top-down view */}
                                    <svg width="96" height="96" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] dark:drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)) drop-shadow(0 0 12px rgba(6,182,212,0.5))'}}>
                                        {/* Main disc body */}
                                        <g className="falcon-body-tilt">
                                            {/* Outer hull with border */}
                                            <ellipse cx="28" cy="30" rx="20.5" ry="16.5" className="fill-none stroke-slate-400 dark:stroke-slate-500" strokeWidth="1"/>
                                            <ellipse cx="28" cy="30" rx="20" ry="16" className="fill-slate-300 dark:fill-slate-400"/>

                                            {/* Panel details */}
                                            <ellipse cx="28" cy="30" rx="16" ry="12" className="fill-slate-200 dark:fill-slate-300"/>

                                            {/* Center circle detail */}
                                            <circle cx="28" cy="30" r="6" className="fill-slate-400 dark:fill-slate-500"/>
                                            <circle cx="28" cy="30" r="4" className="fill-slate-300 dark:fill-slate-400"/>

                                            {/* Panel lines */}
                                            <rect x="12" y="29" width="32" height="1" className="fill-slate-400 dark:fill-slate-500" opacity="0.5"/>
                                            <rect x="27" y="16" width="2" height="28" className="fill-slate-400 dark:fill-slate-500" opacity="0.5"/>

                                            {/* Side details */}
                                            <circle cx="16" cy="26" r="2" className="fill-slate-400 dark:fill-slate-500" opacity="0.7"/>
                                            <circle cx="40" cy="26" r="2" className="fill-slate-400 dark:fill-slate-500" opacity="0.7"/>
                                            <circle cx="16" cy="34" r="2" className="fill-slate-400 dark:fill-slate-500" opacity="0.7"/>
                                            <circle cx="40" cy="34" r="2" className="fill-slate-400 dark:fill-slate-500" opacity="0.7"/>
                                        </g>

                                        {/* Offset cockpit (distinctive Falcon feature) */}
                                        <g className="falcon-cockpit-glow">
                                            <ellipse cx="38" cy="26" rx="5" ry="4" className="fill-cyan-500 dark:fill-cyan-400"/>
                                            <ellipse cx="38" cy="26" rx="3.5" ry="3" className="fill-sky-300 dark:fill-sky-200" opacity="0.8"/>
                                            <ellipse cx="38" cy="26" rx="2" ry="1.5" className="fill-cyan-200 dark:fill-cyan-100">
                                                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                                            </ellipse>
                                        </g>

                                        {/* Front mandibles/prongs */}
                                        <g className="falcon-mandibles">
                                            {/* Left prong */}
                                            <path d="M 20 18 L 16 12 L 18 10 L 22 16 Z" className="fill-slate-300 dark:fill-slate-400"/>
                                            <rect x="17" y="11" width="3" height="6" className="fill-slate-400 dark:fill-slate-500" opacity="0.5"/>

                                            {/* Right prong */}
                                            <path d="M 36 18 L 40 12 L 38 10 L 34 16 Z" className="fill-slate-300 dark:fill-slate-400"/>
                                            <rect x="36" y="11" width="3" height="6" className="fill-slate-400 dark:fill-slate-500" opacity="0.5"/>

                                            {/* Center gap details */}
                                            <rect x="24" y="12" width="8" height="4" className="fill-slate-500 dark:fill-slate-600" opacity="0.6"/>
                                        </g>

                                        {/* Engine thrusters at back with enhanced afterburn */}
                                        <g className="falcon-thrusters">
                                            {/* Left engine */}
                                            <rect x="14" y="44" width="6" height="4" rx="1" className="fill-slate-400 dark:fill-slate-500"/>
                                            {/* Afterburn layers - multiple colors for realistic engine glow */}
                                            <ellipse cx="17" cy="51" rx="3.5" ry="4" className="fill-cyan-300 dark:fill-cyan-200" opacity="0.7">
                                                <animate attributeName="ry" values="4;6;4" dur="0.6s" repeatCount="indefinite"/>
                                                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>
                                            <ellipse cx="17" cy="50" rx="3" ry="3" className="fill-blue-300 dark:fill-blue-200" opacity="0.8">
                                                <animate attributeName="ry" values="3;4.5;3" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>
                                            <ellipse cx="17" cy="48.5" rx="2.5" ry="2" className="fill-white" opacity="0.9">
                                                <animate attributeName="ry" values="2;3;2" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>

                                            {/* Right engine */}
                                            <rect x="36" y="44" width="6" height="4" rx="1" className="fill-slate-400 dark:fill-slate-500"/>
                                            {/* Afterburn layers - multiple colors for realistic engine glow */}
                                            <ellipse cx="39" cy="51" rx="3.5" ry="4" className="fill-cyan-300 dark:fill-cyan-200" opacity="0.7">
                                                <animate attributeName="ry" values="4;6;4" dur="0.6s" repeatCount="indefinite"/>
                                                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>
                                            <ellipse cx="39" cy="50" rx="3" ry="3" className="fill-blue-300 dark:fill-blue-200" opacity="0.8">
                                                <animate attributeName="ry" values="3;4.5;3" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>
                                            <ellipse cx="39" cy="48.5" rx="2.5" ry="2" className="fill-white" opacity="0.9">
                                                <animate attributeName="ry" values="2;3;2" dur="0.6s" repeatCount="indefinite"/>
                                            </ellipse>
                                        </g>

                                        {/* Sensor dish (iconic Falcon feature) */}
                                        <g className="falcon-dish-spin">
                                            <circle cx="22" cy="30" r="3" className="fill-slate-400 dark:fill-slate-500" opacity="0.8"/>
                                            <circle cx="22" cy="30" r="2" className="fill-cyan-400 dark:fill-cyan-300" opacity="0.6">
                                                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                                            </circle>
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
        
        /* Spaceship and Robot animations */
        @keyframes spaceship-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes spaceship-flame {
          0%, 100% { transform: scaleY(1); opacity: 0.8; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
        @keyframes spaceship-wing-tilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg); }
        }
        @keyframes robot-breathe {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.02, 0.98); }
        }
        @keyframes robot-head-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes robot-arm-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes robot-eye-blink {
          0%, 90%, 100% { opacity: 1; }
          93%, 97% { opacity: 0.2; }
        }
        @keyframes antenna-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(-3deg); }
          75% { transform: translateY(1px) rotate(3deg); }
        }
        
        .spaceship-hover {
          animation: spaceship-hover 2s ease-in-out infinite;
        }
        .spaceship-flame {
          animation: spaceship-flame 0.5s ease-in-out infinite;
          transform-origin: center;
        }
        .spaceship-wing-tilt {
          animation: spaceship-wing-tilt 3s ease-in-out infinite;
          transform-origin: center;
        }
        .robot-body-breathe {
          animation: robot-breathe 3s ease-in-out infinite;
          transform-origin: center;
        }
        .robot-head-bob {
          animation: robot-head-bob 2.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .robot-arm-float {
          animation: robot-arm-float 2s ease-in-out infinite;
        }
        .robot-eye-blink {
          animation: robot-eye-blink 5s ease-in-out infinite;
        }
        .antenna-bob {
          animation: antenna-bob 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .robot-idle {
          animation: spaceship-hover 3s ease-in-out infinite;
        }
        
        /* Millennium Falcon animations */
        @keyframes falcon-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes falcon-body-tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }
        @keyframes falcon-dish-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .falcon-hover {
          animation: falcon-hover 3s ease-in-out infinite;
        }
        .falcon-body-tilt {
          animation: falcon-body-tilt 4s ease-in-out infinite;
          transform-origin: center;
        }
        .falcon-dish-spin {
          animation: falcon-dish-spin 6s linear infinite;
          transform-origin: center;
        }
      `}</style>
        </main>
    );
}
