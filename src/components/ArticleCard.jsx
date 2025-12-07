export default function ArticleCard({ article }) {
  const date = article.pubDate ? new Date(article.pubDate) : null;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4 transition hover:border-teal-500/60 dark:hover:border-teal-400/60 hover:bg-slate-50 dark:hover:bg-slate-900"
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-teal-600 dark:group-hover:text-teal-200">
        {article.title}
      </h2>
      {date && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      )}
      <p className="line-clamp-3 text-sm text-slate-700 dark:text-slate-200">
        {article.description?.replace(/<[^>]+>/g, '')}
      </p>
      <span className="mt-1 text-xs font-medium text-teal-600 dark:text-teal-300">Read on Medium →</span>
    </a>
  );
}
