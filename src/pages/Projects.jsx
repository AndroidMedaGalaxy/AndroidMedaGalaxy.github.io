import React from 'react';
import {projects} from '../data/projects.js';

export default function Projects() {
    return (
        <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
            <h1 className="text-3xl font-bold text-slate-50">My Projects</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
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
                            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 shadow-teal-500/40 shadow-lg hover:scale-[1.025] transition-transform cursor-pointer"
                        >
                            <div
                                className="h-40 w-full overflow-hidden rounded-t-xl border-b border-slate-800 bg-slate-950 flex items-center justify-center">
                                <img src={import.meta.env.BASE_URL + project.image} alt={project.name}
                                     className="object-cover h-full w-full"/>
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                            <h2 className="text-lg font-bold text-teal-300 mb-1">{project.name}</h2>
                            <p className="text-sm text-slate-200 mb-3 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {project.tech.map(tech => (
                                    <span key={tech}
                                          className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200">{tech}</span>
                                ))}
                            </div>
                            {/* Optional articles list */}
                            {Array.isArray(project.articles) && project.articles.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-teal-400 mb-1 font-semibold">Featured Articles:</p>
                                    <div className="rounded-lg border border-teal-400/80 bg-slate-900/80 p-3">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {project.articles.map((article, idx) => (
                                                <li key={idx} className="text-xs">
                                                    <a
                                                        href={article.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-teal-300 underline underline-offset-2 hover:text-teal-400 transition-colors"
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
                                        className="text-xs font-medium rounded bg-teal-500 px-3 py-1 text-slate-950 hover:bg-teal-400 transition z-10 relative"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {project.info && (
                                    <a
                                        href={project.info}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs font-medium rounded bg-slate-800 px-3 py-1 text-teal-300 hover:bg-teal-500 transition z-10 relative"
                                    >
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
