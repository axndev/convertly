import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqSection from '@/components/FaqSection';

const SUPPORTED = [
  'JPG ⇄ PNG, WebP, ICO and BMP conversion, in both directions',
  'HEIC, HEIF, AVIF, SVG, TIFF, JFIF, GIF and BMP as inputs wherever your browser can decode them',
  'Resizing by width, height, both dimensions or percentage, with aspect-ratio control',
  'Quality control and target file size for lossy outputs',
  'Batch conversion with individual downloads or a single ZIP',
  'Favicon generation, metadata reading and removal, colour picking, hashing and text tools',
];

const NOT_SUPPORTED = [
  'Audio conversion — transcoding MP3, FLAC and friends needs a decoder the browser does not have',
  'Video conversion and compression — the same reason, at much larger scale',
  'PDF tools and PDF compression',
  'Archive creation and extraction beyond the ZIP of your own converted files',
  'Writing AVIF, HEIC or TIFF — browsers can read some of these but cannot encode them',
];

const FAQS = [
  {
    q: 'Why is Convertly free?',
    a: 'Because there is nothing to pay for. The expensive part of an online converter is the server doing the work and the storage holding your files. Convertly has neither: the work happens in your browser, so the running cost is a static page.',
  },
  {
    q: 'How does Convertly make money?',
    a: 'It does not need to. There is no subscription, no advertising network and no premium tier, and no data is collected from your files — there is nothing to collect, since they never reach a server.',
  },
  {
    q: 'Can I trust that my files are not uploaded?',
    a: 'You do not have to take our word for it: load a converter page, then switch off your network connection and convert a file. It will still work, which is only possible if the conversion never needed a server.',
  },
  {
    q: 'Will Convertly add paid tiers later?',
    a: 'The promise on the box is “Convert Anything. Completely Free.” Every tool listed in the menus is free and unimpeded, and Convertly never shows a locked format or an export fee.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo
        title="About Convertly — Free, Private, Browser-Based File Conversion"
        description="Convertly converts files inside your browser: no uploads, no accounts, no limits and no paid tiers. Here is exactly what it can and cannot do."
        path="/about"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Convert Anything. Completely Free.</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Convertly is a file utility site built on a simple idea: most file conversion does not need a server at all.
        Your browser already knows how to read and write images, so Convertly lets it do the work and skips the upload
        step entirely. No account, no queue, no quota and — most importantly — no copy of your files on someone else’s
        disk.
      </p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <p className="flex items-center gap-2 font-heading text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" /> How the conversion actually works
        </p>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            Your file is decoded with the browser’s own image engine, so EXIF orientation is honoured and animation,
            colour profiles and transparency are handled the way the browser handles them everywhere else.
          </li>
          <li>
            Settings are applied on an off-screen canvas: resizing, background filling for formats without
            transparency, and quality selection for lossy encoders.
          </li>
          <li>
            The output is written by the browser where it can, and by Convertly’s own code where it cannot — a 24-bit
            BMP writer, a real multi-size ICO builder, an EXIF reader and a ZIP writer, all included on the page.
          </li>
          <li>
            Files are validated by their actual bytes before conversion, so a mis-labelled or broken file is reported
            instead of silently producing nonsense.
          </li>
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-heading text-base font-semibold">What works today</p>
          <ul className="mt-3 space-y-2">
            {SUPPORTED.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-heading text-base font-semibold">What Convertly does not offer</p>
          <ul className="mt-3 space-y-2">
            {NOT_SUPPORTED.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            These are left out on purpose. Adding a button that quietly uploads your file somewhere, or that renames a
            file and calls it a conversion, would be worse than admitting the limit.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">What Convertly will never do</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            'Ask you to create an account to unlock a format',
            'Charge for a download, a batch size or a file size',
            'Show a fake progress bar for work that is not happening',
            'Send your files anywhere, for any reason',
            'Return a renamed copy of your file as a “conversion”',
            'Add a watermark, a queue or a daily cap',
          ].map((promise) => (
            <li key={promise} className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {promise}
            </li>
          ))}
        </ul>
      </section>

      <FaqSection faqs={FAQS} title="About Convertly" />

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/image-converter" className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700">
          Start converting
        </Link>
        <Link to="/tools" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-300 hover:text-violet-700">
          Browse the tools
        </Link>
      </div>
    </div>
  );
}