export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Rituraj Sambherao</span>
        <span>Built with React, Vite & Tailwind · Deployed on GitHub Pages</span>
      </div>
    </footer>
  );
}
