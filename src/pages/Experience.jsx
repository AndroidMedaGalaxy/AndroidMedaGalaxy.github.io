import ExperienceCard from '../components/ExperienceCard.jsx';
import { experience, education, certifications } from '../data/cv';

export default function Experience() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Experience</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Over a decade of building production-grade Android apps, SDKs and platforms across fintech,
        healthcare and POS.
      </p>

      <div className="mt-6 space-y-4">
        {experience.map((item) => (
          <ExperienceCard key={item.company + item.period} item={item} />
        ))}
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Education</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {education.map((e) => (
              <li key={e.degree}>
                <p className="font-medium">{e.degree}</p>
                <p className="text-slate-600 dark:text-slate-300">{e.institution}</p>
                {e.note && <p className="text-xs text-slate-500 dark:text-slate-400">{e.note}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Certifications & Awards</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-200">
            {certifications.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
