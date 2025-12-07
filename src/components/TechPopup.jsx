import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getTechInfo } from '../data/techInfo';

export default function TechPopup({ techName, isOpen, onClose }) {
  const popupRef = useRef(null);
  const techData = getTechInfo(techName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />

      {/* Popup - Centered with max dimensions to prevent overflow */}
      <div
        ref={popupRef}
        className="fixed z-50 animate-scale-in top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[80vh] overflow-auto"
      >
        <div className="relative">

          {/* Card */}
          <div className="relative rounded-xl border border-cyan-500/30 dark:border-cyan-500/40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
            {/* Gradient header */}
            <div className={`h-1.5 bg-gradient-to-r ${techData.color}`}></div>

            <div className="p-5">
              {/* Header with close button */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${techData.color}`}>
                    {techData.name}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-500/30">
                    {techData.category}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors group"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {techData.description}
              </p>
            </div>

            {/* Footer accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

