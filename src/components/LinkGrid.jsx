import React from 'react';
import { Link } from 'react-router-dom';

export default function LinkGrid({ title, subtitle, links, columns = 3, className = '' }) {
  if (!links || !links.length) return null;
  const columnClass = columns === 2 ? 'sm:grid-cols-2' : columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <section className={className}>
      {title && <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>}
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      <div className={`mt-5 grid gap-2 ${columnClass}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-violet-300"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}