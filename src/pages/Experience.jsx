import { useEffect, useRef, useState } from 'react';
import ExperienceCard from '../components/ExperienceCard.jsx';
import { experience, education, certifications } from '../data/cv';

export default function Experience() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const observerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    // Initialize cards that are immediately visible on mount
    const initializeVisibleCards = () => {
      const cards = document.querySelectorAll('.timeline-card');
      const initialVisible = new Set();

      cards.forEach((card) => {
        const index = card.dataset.index;
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          initialVisible.add(index);

          // Set the first visible card as active (for desktop timeline indicator)
          if (initialVisible.size === 1) {
            setActiveCardIndex(parseInt(index));
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            setIndicatorTop(cardTop + (cardHeight / 2));
          }
        }
      });

      setVisibleCards(initialVisible);
    };

    // Small delay to ensure DOM is ready
    setTimeout(initializeVisibleCards, 100);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index;
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]));

            // Update active card and indicator position
            const cardElement = entry.target;
            const cardTop = cardElement.offsetTop;
            const cardHeight = cardElement.offsetHeight;
            setActiveCardIndex(parseInt(index));
            // Position indicator at vertical center of card
            setIndicatorTop(cardTop + (cardHeight / 2));
          } else {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    const cards = document.querySelectorAll('.timeline-card');
    cardRefs.current = Array.from(cards);
    cards.forEach((card) => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 relative z-10">
      {/* Header Section */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent animate-gradient">
          Experience
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Over a decade of building production-grade Android apps, SDKs and platforms across fintech,
          healthcare and POS.
        </p>
        <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full glow-cyan"></div>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {/* Desktop Layout */}
        <div className="hidden md:block relative">
          {/* Vertical Timeline Spine - extends to cover all cards */}
          <div className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-cyan-600 via-teal-500 to-emerald-600 dark:from-cyan-500 dark:via-teal-400 dark:to-emerald-400 glow-timeline" style={{height: '100%', minHeight: '100%'}}></div>

          {/* Single Scrolling Timeline Indicator - Millennium Falcon */}
          <div
            className="absolute left-8 -ml-[40px] z-10 transition-all duration-500 ease-out falcon-timeline-hover"
            style={{
              top: `${indicatorTop - 40}px`, // Offset to center the falcon
              opacity: visibleCards.size > 0 ? 1 : 0,
              transform: visibleCards.size > 0 ? 'scale(1)' : 'scale(0.3)'
            }}
          >
            {/* Millennium Falcon SVG - top-down view */}
            <svg width="80" height="80" viewBox="0 0 56 56" className="drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] dark:drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)) drop-shadow(0 0 12px rgba(6,182,212,0.5))'}}>
              {/* Main disc body */}
              <g className="falcon-body-subtle-tilt">
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
              <g className="falcon-cockpit-pulse">
                <ellipse cx="38" cy="26" rx="5" ry="4" className="fill-cyan-500 dark:fill-cyan-400"/>
                <ellipse cx="38" cy="26" rx="3.5" ry="3" className="fill-sky-300 dark:fill-sky-200" opacity="0.8"/>
                <ellipse cx="38" cy="26" rx="2" ry="1.5" className="fill-cyan-200 dark:fill-cyan-100 animate-pulse"/>
              </g>

              {/* Front mandibles/prongs */}
              <g>
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
              <g className="falcon-thrusters-pulse">
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
              <g className="falcon-dish-rotate">
                <circle cx="22" cy="30" r="3" className="fill-slate-400 dark:fill-slate-500" opacity="0.8"/>
                <circle cx="22" cy="30" r="2" className="fill-cyan-400 dark:fill-cyan-300 animate-pulse" opacity="0.6"/>
              </g>
            </svg>
          </div>

          {/* Experience Cards */}
          <div className="space-y-16 pl-24 pb-16">
            {experience.map((item, index) => (
              <div
                key={item.company + item.period}
                className="timeline-card relative"
                data-index={index}
              >
                {/* Connecting Line - only visible when card is active */}
                <div className={`absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-teal-500/60 to-transparent dark:from-teal-400/50 dark:to-transparent transition-all duration-500 ${
                  activeCardIndex === index ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`} style={{ transformOrigin: 'left' }}></div>

                {/* Card */}
                <div className={`transition-all duration-700 ${
                  visibleCards.has(String(index)) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-12'
                }`}>
                  <ExperienceCard item={item} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-8">
          {experience.map((item, index) => (
            <div
              key={item.company + item.period}
              className="timeline-card"
              data-index={index}
            >
              <div className={`transition-all duration-700 ${
                visibleCards.has(String(index)) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <ExperienceCard item={item} index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications */}
      <section className="mt-24 grid gap-6 md:grid-cols-2">
        <div className="cyber-card group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300 bg-clip-text text-transparent">
              Education
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {education.map((e) => (
                <li key={e.degree} className="border-l-2 border-cyan-500/40 dark:border-cyan-500/30 pl-4 hover:border-cyan-600/70 dark:hover:border-cyan-500/60 transition-colors">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{e.degree}</p>
                  <p className="text-slate-600 dark:text-slate-400">{e.institution}</p>
                  {e.note && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{e.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cyber-card group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
              Certifications & Awards
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {certifications.map((c) => (
                <li key={c} className="text-slate-700 dark:text-slate-300 flex items-start gap-2 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  <span className="text-cyan-600 dark:text-cyan-400 mt-1">▹</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Millennium Falcon animations */}
      <style>{`
        @keyframes falcon-timeline-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes falcon-body-subtle-tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-0.5deg); }
          75% { transform: rotate(0.5deg); }
        }
        
        @keyframes falcon-dish-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .falcon-timeline-hover {
          animation: falcon-timeline-hover 2.5s ease-in-out infinite;
        }
        
        .falcon-body-subtle-tilt {
          animation: falcon-body-subtle-tilt 5s ease-in-out infinite;
          transform-origin: center;
        }
        
        .falcon-dish-rotate {
          animation: falcon-dish-rotate 8s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </main>
  );
}
