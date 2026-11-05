import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock, Unlock, Zap } from 'lucide-react';
import Seo from '@/components/Seo';
import FaqSection from '@/components/FaqSection';
import LinkGrid from '@/components/LinkGrid';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';
import { FORMATS, TARGET_KEYS } from '@/lib/formats';
import { CONVERSION_BY_SLUG } from '@/lib/conversions';
import { TOOLS } from '@/lib/toolCatalog';

const POPULAR = [
  'jpg-to-png',
  'png-to-jpg',
  'jpg-to-webp',
  'png-to-webp',
  'webp-to-jpg',
  'webp-to-png',
  'jfif-to-jpg',
  'heic-to-jpg',
  'avif-to-jpg',
  'svg-to-png',
  'gif-to-png',
  'png-to-ico',
];

const FAQS = [
  {
    q: 'Is Convertly really free?',
    a: 'Yes. There are no paid tiers, no premium formats, no export fees and no daily conversion limits. Convertly exists to be the free option — nothing is held back behind a paywall.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There is no sign-up, no email address to enter and no API key to configure. Open a page and start converting.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. Convertly is a set of browser pages: your image is decoded and re-encoded by your own browser. Nothing is transmitted anywhere, which also means the site keeps working with your connection switched off once the page has loaded.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'There is no quota enforced by Convertly. The practical limit is your device’s memory — very large images are best converted a few at a time on a phone.',
  },
  {
    q: 'Which formats can’t Convertly handle?',
    a: 'Audio, video, PDF and archive conversions are not offered, because doing them properly needs processing that browsers cannot do reliably offline. Convertly would rather show fewer tools than fake a conversion — a page that only renamed your file would be worthless to you.',
  },
  {
    q: 'Does Convertly work offline?',
    a: 'Once a page has loaded, the conversion itself never needs the network. That is only possible because no file ever leaves your device.',
  },
];

export default function Home() {
  const popular = POPULAR.map((slug) => CONVERSION_BY_SLUG[slug])
    .filter(Boolean)
    .map((conversion) => ({ to: `/${conversion.slug}`, label: `${conversion.sourceLabel} to ${conversion.targetLabel}` }));
  const toolLinks = TOOLS.slice(0, 6).map((tool) => ({ to: `/${tool.slug}`, label: tool.title }));

  return (
    <div>
      <Seo
        title="Convertly — Convert Anything. Completely Free."
        description="Free browser-based file conversion. Convert JPG, PNG, WebP, HEIC, AVIF, SVG, BMP, GIF and ICO images, resize and compress them — no uploads, no account, no limits."
        path="/"
      />

      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(124,58,237,0.12),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:pb-20 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
              <Lock className="h-3.5 w-3.5" /> Free forever · No sign-up · No uploads
            </p>
            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Convert Anything.
              <span className="block bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">Completely Free.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Convertly turns images between JPG, PNG, WebP, ICO, BMP, HEIC, AVIF, SVG, TIFF, JFIF and GIF — resizing,
              compressing and batch-processing them right here in your browser. Your files never leave your device.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <ConverterWorkspace
              target="jpg"
              allowTargetSelect
              hint={`Drop any image — JPG, PNG, WebP, HEIC, AVIF, SVG, TIFF, BMP, GIF, JFIF or ICO.`}
              capabilities={{ resize: true, quality: true, background: true, maxSize: true }}
            />
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: Lock, title: 'Private by design', text: 'Every file is read and written on your own device. Nothing is transmitted, stored or logged.' },
              { icon: Unlock, title: 'No limits at all', text: 'No daily caps, no accounts, no watermarks, no “upgrade to export”. Convert as much as you like.' },
              { icon: Zap, title: 'Instant and offline', text: 'No upload time and no queue. Local processing means results appear as fast as your device can work.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-heading text-base font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <LinkGrid title="Popular conversions" subtitle="Every conversion below is a real page with its own settings, guides and answers — not a redirect." links={popular} columns={4} />

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Converters by format</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick the format you are starting from or aiming for, and see exactly which conversions are supported.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TARGET_KEYS.map((key) => (
              <Link
                key={key}
                to={`/${key}-converter`}
                className="group rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300"
              >
                <p className="font-heading text-lg font-semibold">{FORMATS[key].label} converter</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{FORMATS[key].tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                  Open converter <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <Link to="/formats" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
            See the full format directory <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Free file tools</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Resize, rotate, strip metadata, generate favicons, format JSON, hash files — all local, all free.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.slice(0, 9).map((tool) => (
              <Link
                key={tool.slug}
                to={`/${tool.slug}`}
                className="group flex gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-violet-600 dark:text-violet-400">
                  <tool.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-medium">{tool.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{tool.description}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link to="/tools" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
            Browse every tool <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">How Convertly converts your files</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { step: '1', title: 'You choose files', text: 'Drag them in or pick them from your device. Convertly checks the actual bytes, not just the extension.' },
              { step: '2', title: 'Your browser does the work', text: 'Images are decoded, resized and re-encoded with the same engine that renders them on screen.' },
              { step: '3', title: 'You download the result', text: 'Save files one by one, or take a whole batch as a single ZIP archive.' },
            ].map((item) => (
              <li key={item.step} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">{item.step}</span>
                <p className="mt-3 font-medium">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <LinkGrid className="mt-14" title="Quick tools" links={toolLinks} columns={3} />
        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}