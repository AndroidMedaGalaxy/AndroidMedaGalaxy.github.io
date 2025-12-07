import { profile } from '../data/cv';

export default function Contact() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Contact</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        The fastest way to reach me is via LinkedIn.
      </p>

      <div className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
        <p>
          Work permission:{' '}
          <span className="font-medium text-teal-600 dark:text-teal-300">
            {profile.work_permission}
          </span>
        </p>
        <p>Location: {profile.location}</p>
        <p>
          LinkedIn:{' '}
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-300 hover:underline">
            {profile.linkedin}
          </a>
        </p>
      </div>
    </main>
  );
}
