import { profile, skills } from '../data/cv';

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-12 pt-8">
      <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
        <div>
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
              href={`mailto:${profile.linkedin}`}
              className="rounded-lg bg-teal-500 px-4 py-2 font-medium text-slate-950 shadow-lg shadow-teal-500/40 hover:bg-teal-400"
            >
              View LinkedIn →
            </a>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="h-40 w-40 rounded-3xl overflow-hidden border border-slate-700">
            <img
              src={`${import.meta.env.BASE_URL}images/droidmeda_welding.png`}
              alt="DroidMeda Welding"
              className="h-full w-full object-cover object-center"
            />
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
    </main>
  );
}
