import React, {useEffect, useState, useRef} from 'react';

export default function MascotFloating() {
    const [floatPhase, setFloatPhase] = useState(0);
    const [showBubble, setShowBubble] = useState(false);
    const [entered, setEntered] = useState(false); // for first entrance
    const [showSparkle, setShowSparkle] = useState(false);
    const mascotRef = useRef(null);

    useEffect(() => {
        // Delayed entrance for the mascot
        setTimeout(() => {
            setEntered(true);
            setShowSparkle(true);
            setTimeout(() => setShowSparkle(false), 1700);
        }, 850);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFloatPhase(prev => (prev + 0.03) % (Math.PI * 2)); // Cycle from 0 to 2π
        }, 16); // ~60fps
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!showBubble) return;
        const handle = (e) => {
            // close bubble if click outside mascot or the chat bubble
            if (
                mascotRef.current &&
                !mascotRef.current.contains(e.target)
            ) {
                setShowBubble(false);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [showBubble]);

    // Floating up+down independent of scroll
    const mascotScale = showBubble ? 0.35 : 1.15;
    // Animate in from top-right using transform and opacity
    const baseX = 40;
    const baseY = 100 + 60 * Math.sin(floatPhase);
    const enterX = entered ? 0 : -60;
    const enterY = entered ? 0 : -100;
    const opacity = entered ? 1 : 0;
    const mascotStyle = {
        position: 'fixed',
        zIndex: 1500,
        right: baseX + enterX,
        bottom: baseY + enterY,
        transform: `translateY(${16 * Math.sin(floatPhase * 1.2)}px) scale(${mascotScale})`,
        cursor: 'pointer',
        opacity,
        transition: 'transform 0.21s cubic-bezier(.41,1.51,.36,.88), bottom 0.7s cubic-bezier(.45,1.34,.36,.88), right 0.7s cubic-bezier(.45,1.34,.36,.88), opacity 0.4s',
    };

    return (
        <div style={{
            pointerEvents: 'auto',
            position: 'fixed',
            zIndex: 1500,
            right: mascotStyle.right,
            bottom: mascotStyle.bottom,
            opacity: mascotStyle.opacity,
            transition: mascotStyle.transition
        }} ref={mascotRef}>
            {/* SPARKLE ANIMATION OVERLAY */}
            {showSparkle && (
                <div className="pointer-events-none absolute -top-4 -right-3 w-16 h-16 z-10 animate-fade-in">
                    <svg width="60" height="60" fill="none" viewBox="0 0 60 60">
                        <g style={{mixBlendMode: 'screen'}}>
                            <circle cx="30" cy="30" r="12" fill="#ffffb4" fillOpacity=".18">
                                <animate attributeName="r" from="6" to="18" dur="1.1s" repeatCount="1"/>
                                <animate attributeName="opacity" values=".45;0" dur="1.2s" repeatCount="1"/>
                            </circle>
                            <g>
                                <g>
                                    <circle cx="30" cy="19" r="2" fill="#ffe680"/>
                                    <circle cx="30" cy="41" r="1.2" fill="#ffcc80"/>
                                    <circle cx="41" cy="30" r="1.4" fill="#ffe680"/>
                                    <circle cx="19" cy="30" r="1.1" fill="#ffd180"/>
                                </g>
                                <circle cx="30" cy="30" r="3.5" fill="#fffbee"/>
                                <circle cx="33" cy="28" r="1.1" fill="#fff6d8"/>
                                <circle cx="25" cy="32" r="0.7" fill="#fffde0"/>
                            </g>
                        </g>
                    </svg>
                </div>
            )}
            {showBubble && (
                <div
                    className="animate-fade-in absolute right-[100%] bottom-10 mb-4 w-[280px] bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-4 shadow-xl font-sans text-sm before:content-[''] before:absolute before:-right-3 before:bottom-6 before:border-8 before:border-transparent before:border-l-slate-900 before:z-[-1]"
                    style={{pointerEvents: 'auto', minWidth: 230}}
                >
                    <span className="font-bold text-teal-300">Hi, I am Droidmeda!</span>
                    <div className="mt-1 text-slate-100 leading-relaxed">
                        I&apos;m in charge of making sure the <span className="text-teal-400 font-semibold">Rocket Ship Apps</span> are
                        developed, launched, and maintained across the <span className="text-indigo-300 font-semibold">Androimeda Galaxy</span>.
                        Whenever you need technical help, project navigation, or a friendly byte of cosmic advice, just
                        click me! 🚀🪐
                    </div>
                </div>
            )}
            <img
                src={import.meta.env.BASE_URL + 'images/droidmeda/mascot_jetpack_flipped_transparent_light.png'}
                alt="Mascot Hovering"
                style={mascotStyle}
                width={84}
                height={84}
                aria-hidden="true"
                loading="lazy"
                onClick={() => setShowBubble(b => !b)}
            />
        </div>
    );
}
