import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqSection from '@/components/FaqSection';
import LinkGrid from '@/components/LinkGrid';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';
import { FORMATS, TARGET_KEYS, isOpaque, isLossy } from '@/lib/formats';
import { CONVERSION_BY_SLUG, conversionsTo } from '@/lib/conversions';

export default function ConversionPage({ conversion }) {
  const source = FORMATS[conversion.from];
  const target = FORMATS[conversion.to];
  const related = conversion.related.map((slug) => CONVERSION_BY_SLUG[slug]).filter(Boolean);
  const allToTarget = conversionsTo(conversion.to).map((item) => ({ to: `/${item.slug}`, label: `${item.sourceLabel} to ${item.targetLabel}` }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo title={conversion.metaTitle} description={conversion.metaDescription} path={`/${conversion.slug}`} />
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Image Converter', to: '/image-converter' },
          { label: `${target.label} Converter`, to: `/${conversion.to}-converter` },
          { label: `${source.label} to ${target.label}` },
        ]}
      />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {source.label} to {target.label} Converter
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{conversion.intro}</p>

      <div className="mt-8">
        <ConverterWorkspace
          target={conversion.to}
          acceptKeys={[conversion.from]}
          hint={`Add one or many ${source.label} files — ${source.accept.replace(/,/g, ' ')}. Batch conversion and ZIP download included.`}
          capabilities={conversion.settings}
        />
      </div>

      {conversion.decodeNote && (
        <p className="mt-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {conversion.decodeNote}
        </p>
      )}

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">How to convert {source.label} to {target.label}</h2>
        <ol className="mt-5 space-y-3">
          {conversion.howTo.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 space-y-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">About this conversion</h2>
        {conversion.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
        ))}
        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          {[
            { format: source, caption: `Source · ${source.label}` },
            { format: target, caption: `Output · ${target.label}` },
          ].map(({ format, caption }) => (
            <div key={caption} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{caption}</p>
              <p className="mt-2 font-heading text-lg font-semibold">{format.label} <span className="text-sm font-normal text-muted-foreground">.{format.ext}</span></p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{format.blurb}</p>
              <ul className="mt-3 space-y-2">
                {format.facts.map((fact) => (
                  <li key={fact} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                    {fact}
                  </li>
                ))}
              </ul>
              <Link to={`/${format.key}-converter`} className="mt-4 inline-block text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
                More {format.label} conversions →
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {isLossy(conversion.to)
            ? `${target.label} uses lossy compression, so a lower quality setting means a smaller file. Convertly reports the exact before and after sizes after every conversion.`
            : `${target.label} encoding here is lossless — the pixels you get back are the pixels that went in.`}
          {isOpaque(conversion.to) ? ` ${target.label} has no transparency channel, so cut-outs are filled with your chosen background colour.` : ''}
        </p>
      </section>

      <FaqSection faqs={conversion.faqs} title={`${source.label} to ${target.label}: common questions`} />

      {!!related.length && (
        <LinkGrid
          className="mt-14"
          title="Related conversions"
          subtitle="Other conversions that start from the same format or land on the same one."
          links={related.map((item) => ({ to: `/${item.slug}`, label: `${item.sourceLabel} to ${item.targetLabel}` }))}
          columns={4}
        />
      )}

      <LinkGrid className="mt-14" title={`All conversions to ${target.label}`} links={allToTarget} columns={4} />

      <section className="mt-14 rounded-2xl border border-border bg-muted/40 p-5">
        <h2 className="font-heading text-lg font-semibold">Convert from another format?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Jump straight to any supported target format.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TARGET_KEYS.filter((key) => key !== conversion.to).map((key) => (
            <Link key={key} to={`/${key}-converter`} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-violet-300 hover:text-violet-700">
              {FORMATS[key].label} converter
            </Link>
          ))}
          <Link to="/formats" className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-violet-300 hover:text-violet-700">
            Format directory
          </Link>
        </div>
      </section>
    </div>
  );
}