import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/toolCatalog';

export default function ToolsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo
        title="Free File Tools — No Uploads, No Sign-up | Convertly"
        description="Resize and rotate images, strip metadata, build favicons, encode Base64, format JSON, generate hashes and more — every tool runs in your browser, free and private."
        path="/tools"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tools' }]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Free file tools</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {TOOLS.length} tools that run entirely on your device. Every one listed here is genuinely implemented — nothing
        on this page is a placeholder or a teaser for a paid feature.
      </p>

      <div className="mt-10 space-y-12">
        {TOOL_CATEGORIES.map((category) => {
          const tools = TOOLS.filter((tool) => tool.category === category.key);
          if (!tools.length) return null;
          return (
            <section key={category.key}>
              <h2 className="font-heading text-xl font-semibold tracking-tight">{category.label}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/${tool.slug}`}
                    className="group flex gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-violet-600 transition-colors group-hover:bg-violet-100 dark:text-violet-400 dark:group-hover:bg-violet-950/60">
                      <tool.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-medium">{tool.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{tool.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}