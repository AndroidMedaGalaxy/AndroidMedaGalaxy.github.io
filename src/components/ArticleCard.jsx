export default function ArticleCard({ article }) {
  const date = article.pubDate ? new Date(article.pubDate) : null;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-teal-400/60 hover:bg-slate-900"
    >
      <h2 className="text-base font-semibold text-slate-50 group-hover:text-teal-200">
        {article.title}
      </h2>
      {date && (
        <p className="text-xs text-slate-400">
          {date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      )}
      <p className="line-clamp-3 text-sm text-slate-200">
        {article.description?.replace(/<[^>]+>/g, '')}
      </p>
      <span className="mt-1 text-xs font-medium text-teal-300">Read on Medium →</span>
    </a>
  );
}
