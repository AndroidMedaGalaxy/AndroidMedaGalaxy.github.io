import { profile } from '../data/cv';

export default function Contact() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
      <h1 className="text-3xl font-bold text-slate-50">Contact</h1>
      <p className="mt-2 text-sm text-slate-300">
        The fastest way to reach me is via LinkedIn.
      </p>

      <div className="mt-6 space-y-3 text-sm text-slate-200">
        <p>
          Work permission:{' '}
          <span className="font-medium text-teal-300">
            {profile.work_permission}
          </span>
        </p>
        <p>Location: {profile.location}</p>
        <p>
          LinkedIn:{' '}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {profile.linkedin}
          </a>
        </p>
      </div>
    </main>
  );
}
