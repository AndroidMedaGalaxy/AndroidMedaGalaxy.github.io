import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';

const MEDIUM_USERNAME = 'androidmeda'; // ← change this

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [state, setState] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    async function load() {
      try {
        const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (!data.items) throw new Error('No items in feed');
        setArticles(data.items);
        setState('ready');
      } catch (e) {
        setState('error');
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Articles</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        A feed of my latest writing from Medium. This updates automatically via the public RSS feed.
      </p>

      {state === 'loading' && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading Medium feed…</p>
      )}

      {state === 'error' && (
        <p className="mt-6 text-sm text-rose-600 dark:text-rose-300">
          Couldn&apos;t load the Medium feed. Double-check the username in{' '}
          <code className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-xs">MEDIUM_USERNAME</code> in
          <code className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-xs">src/pages/Articles.jsx</code>.
        </p>
      )}

      {state === 'ready' && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.guid} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
