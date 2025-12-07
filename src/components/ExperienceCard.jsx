import { useState } from 'react';
import TechPopup from './TechPopup';

export default function ExperienceCard({ item, index }) {
  const [selectedTech, setSelectedTech] = useState(null);
  const glowColors = [
    'from-cyan-500/10 to-teal-500/10',
    'from-teal-500/10 to-emerald-500/10',
    'from-sky-500/10 to-cyan-500/10',
    'from-emerald-500/10 to-teal-500/10',
  ];

  const borderGlows = [
    'hover:shadow-cyan-500/20',
    'hover:shadow-teal-500/20',
    'hover:shadow-sky-500/20',
    'hover:shadow-emerald-500/20',
  ];

  // Company logos mapping - using files from public/images/company_logos
  const companyLogos = {
    'Toast': '/images/company_logos/toast_logo.png',
    'Mastercard': '/images/company_logos/mastercard_logo.svg',
    'SAP': '/images/company_logos/sap_logo.png',
    'Nitor Infotech': '/images/company_logos/nitor_logo.webp'
  };

  // Extract years from period (e.g., "Feb 2021 – May 2024" -> "2021-2024")
  const extractYears = (period) => {
    const yearMatches = period.match(/\d{4}/g);
    if (yearMatches && yearMatches.length >= 2) {
      return `${yearMatches[0]}-${yearMatches[yearMatches.length - 1]}`;
    } else if (yearMatches && yearMatches.length === 1) {
      return `${yearMatches[0]}-Present`;
    }
    return period;
  };

  const glowColor = glowColors[index % glowColors.length];
  const borderGlow = borderGlows[index % borderGlows.length];
  const yearsRange = extractYears(item.period);

  return (
    <article className={`group relative rounded-2xl transition-all duration-500 hover:scale-[1.01] ${borderGlow}`}>
      {/* Outer glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${glowColor} rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {/* Glassmorphism card */}
      <div className="relative rounded-2xl border border-cyan-500/20 dark:border-cyan-500/20 bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl overflow-hidden">
        {/* Subtle inner gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-50 transition-opacity duration-500`}></div>

        {/* Card content */}
        <div className="relative z-10">
          <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-300 dark:to-teal-200 mb-1">
                {item.role}
              </h2>
              <div className="flex items-center gap-3">
                {companyLogos[item.company] && (
                  <div className="flex-shrink-0 w-8 h-8 p-1 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <img
                      src={companyLogos[item.company]}
                      alt={`${item.company} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <p className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  {item.company}
                  <span className="inline-block w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10 dark:from-cyan-500/20 dark:to-teal-500/20 border border-cyan-500/30 dark:border-cyan-500/40 mb-1">
                <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 font-mono">
                  {yearsRange}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-cyan-400/70 mt-1">
                {item.location}
              </p>
            </div>
          </header>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 dark:via-cyan-500/30 to-transparent mb-4"></div>

          {/* Responsibilities */}
          <ul className="space-y-2 mb-5">
            {item.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 group/item">
                <span className="text-cyan-700 dark:text-cyan-400 mt-1 text-xs group-hover/item:text-teal-600 dark:group-hover/item:text-teal-300 transition-colors font-bold">▹</span>
                <span className="flex-1">{b}</span>
              </li>
            ))}
          </ul>

          {/* Tech stack tags */}
          {item.tech && (
            <div className="flex flex-wrap gap-2">
              {item.tech.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTech(t)}
                  className="group/tag relative px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 dark:border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/5 backdrop-blur-sm hover:bg-cyan-500/25 dark:hover:bg-cyan-500/20 hover:border-cyan-500/60 dark:hover:border-cyan-400/50 hover:text-cyan-800 dark:hover:text-cyan-200 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer active:scale-95"
                >
                  {/* Tag glow on hover */}
                  <span className="absolute inset-0 rounded-lg bg-cyan-400/0 group-hover/tag:bg-cyan-400/10 blur transition-all"></span>
                  <span className="relative">
                    {t}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 dark:from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Tech Popup */}
      <TechPopup
        techName={selectedTech}
        isOpen={selectedTech !== null}
        onClose={() => setSelectedTech(null)}
      />
    </article>
  );
}
