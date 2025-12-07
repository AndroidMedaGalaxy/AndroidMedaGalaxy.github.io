import React from 'react';
import {projects} from '../data/projects.js';

export default function Projects() {
    return (
        <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Projects</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                A showcase of my apps, SDKs, and experiments. Click on a project to visit GitHub, Play Store, or live
                demo.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => {
                    const mainLink = project.info || project.github;
                    const TileWrapper = mainLink ? 'a' : 'div';
                    const wrapperProps = mainLink ? {
                        href: mainLink,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    } : {};

                    return (
                        <TileWrapper
                            key={project.name}
                            {...wrapperProps}
                            className="flex flex-col rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-teal-500/20 dark:shadow-teal-500/40 shadow-lg hover:scale-[1.025] transition-transform cursor-pointer"
                        >
                            <div
                                className="h-40 w-full overflow-hidden rounded-t-xl border-b border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                                <img src={import.meta.env.BASE_URL + project.image} alt={project.name}
                                     className="object-cover h-full w-full"/>
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                            <h2 className="text-lg font-bold text-teal-600 dark:text-teal-300 mb-1">{project.name}</h2>
                            <p className="text-sm text-slate-700 dark:text-slate-200 mb-3 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {project.tech.map(tech => (
                                    <span key={tech}
                                          className="rounded-full border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">{tech}</span>
                                ))}
                            </div>
                            {/* Optional articles list */}
                            {Array.isArray(project.articles) && project.articles.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-teal-600 dark:text-teal-400 mb-1 font-semibold">Featured Articles:</p>
                                    <div className="rounded-lg border border-teal-400/80 bg-slate-100 dark:bg-slate-900/80 p-3">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {project.articles.map((article, idx) => (
                                                <li key={idx} className="text-xs">
                                                    <a
                                                        href={article.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-teal-600 dark:text-teal-300 underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                                                    >
                                                        {article.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 mt-auto">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-800 px-3 py-2 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg hover:scale-105 z-10 relative"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                        </svg>
                                        GitHub
                                    </a>
                                )}
                                {project.info && (
                                    <a
                                        href={project.info}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 px-3 py-2 text-white hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 transition-all shadow-md hover:shadow-lg hover:scale-105 z-10 relative"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                        Info
                                    </a>
                                )}
                            </div>
                        </div>
                    </TileWrapper>
                    );
                })}
            </div>
        </main>
    );
}
