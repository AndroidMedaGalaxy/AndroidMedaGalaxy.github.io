export default function ExperienceCard({ item }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{item.role}</h2>
          <p className="text-sm text-slate-300">{item.company}</p>
        </div>
        <p className="text-xs text-slate-400">
          {item.period} · {item.location}
        </p>
      </header>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
        {item.bullets.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
      {item.tech && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-teal-500/40 bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-200"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
