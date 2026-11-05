import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ToolShell({ tool, children, footnote }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo title={`${tool.title} — Free & Private | Convertly`} description={tool.description} path={`/${tool.slug}`} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tools', to: '/tools' }, { label: tool.title }]} />
      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{tool.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{tool.description}</p>
      <div className="mt-8 space-y-6">{children}</div>
      {footnote && <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{footnote}</p>}
      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
        This tool runs entirely inside your browser. Any file you add is processed on your own device and never
        uploaded anywhere, so there is no account to create and no daily limit to hit.
      </p>
    </div>
  );
}