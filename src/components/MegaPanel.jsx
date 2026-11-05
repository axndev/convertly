import React from 'react';
import { Link } from 'react-router-dom';

export default function MegaPanel({ columns, onNavigate, footer }) {
    return (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-border bg-card/98 shadow-lg shadow-slate-900/5 backdrop-blur">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4">
                {columns.map((column) => (
                    <div key={column.title}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{column.title}</p>
                        <ul className="mt-3 space-y-1.5">
                            {column.links.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        onClick={onNavigate}
                                        className="block rounded-lg px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {footer && (
                <div className="border-t border-border bg-muted/40">
                    <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground sm:px-6">{footer}</div>
                </div>
            )}
        </div>
    );
}