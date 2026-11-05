import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqSection from '@/components/FaqSection';
import LinkGrid from '@/components/LinkGrid';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';
import { FORMATS, SOURCE_KEYS, TARGET_KEYS } from '@/lib/formats';

export default function FormatPage({ page }) {
  const format = FORMATS[page.key];
  const isTarget = TARGET_KEYS.includes(page.key);
  const acceptedSources = isTarget ? SOURCE_KEYS : [page.key];
  const label = acceptedSources.map((key) => FORMATS[key].label).join(', ');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo title={page.metaTitle} description={page.metaDescription} path={`/${page.slug}`} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Format Directory', to: '/formats' }, { label: `${format.label} Converter` }]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{page.h1}</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{page.intro}</p>

      <div className="mt-8">
        <ConverterWorkspace
          target={isTarget ? page.key : 'png'}
          allowTargetSelect={!isTarget}
          targetOptions={isTarget ? undefined : TARGET_KEYS}
          acceptKeys={acceptedSources}
          hint={
            isTarget
              ? `Add ${label} files and get ${format.label} back. Batch conversion and ZIP download included.`
              : `Add your ${format.label} files, then choose the format you want.`
          }
          capabilities={{ resize: true, quality: !isTarget || format.output.lossy, background: !isTarget || !format.output.transparency, maxSize: !isTarget || format.output.lossy }}
        />
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format details</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Extensions</dt>
              <dd className="font-medium">.{format.ext}{format.altExts.map((ext) => `, .${ext}`).join('')}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">MIME type</dt>
              <dd className="font-mono text-xs">{format.mime}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Transparency</dt>
              <dd className="font-medium">{format.output && format.output.transparency ? 'Supported' : 'Not supported'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Read in browser</dt>
              <dd className="font-medium">{format.decode === 'yes' ? 'Yes' : 'Depends on browser'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Write in browser</dt>
              <dd className="font-medium">{format.output ? 'Yes — in Convertly' : 'Not available'}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Good to know</p>
          <ul className="mt-3 space-y-2">
            {format.facts.map((fact) => (
              <li key={fact} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {!!page.outbound.length && (
        <LinkGrid
          className="mt-14"
          title={`Convert ${format.label} to another format`}
          links={page.outbound.map((item) => ({ to: `/${item.slug}`, label: `${item.sourceLabel} to ${item.targetLabel}` }))}
          columns={4}
        />
      )}
      {!!page.inbound.length && (
        <LinkGrid
          className="mt-14"
          title={`Convert another format to ${format.label}`}
          links={page.inbound.map((item) => ({ to: `/${item.slug}`, label: `${item.sourceLabel} to ${item.targetLabel}` }))}
          columns={4}
        />
      )}

      <FaqSection faqs={page.faqs} title={`${format.label} questions`} />
    </div>
  );
}