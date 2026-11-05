import React from 'react';
import { Info } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqSection from '@/components/FaqSection';
import LinkGrid from '@/components/LinkGrid';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';
import { FORMATS } from '@/lib/formats';

const FAQS = [
  {
    q: 'Does compressing an image reduce its quality?',
    a: 'Compression here works by re-encoding to a lossy format at a quality you choose. At 90 the difference is usually invisible; at 50 the file can be several times smaller but fine detail softens. Convertly always shows the original and output sizes so the trade-off is visible.',
  },
  {
    q: 'Why can’t I shrink a PNG losslessly?',
    a: 'Lossless formats such as PNG and GIF need a specialised optimiser to get smaller without changing pixels. Convertly does not offer that as a “compressor”, because showing a button that quietly re-encodes or resizes your file would be misleading. If you need a much smaller file, converting to WebP or JPG is the honest route — and both are free here.',
  },
  {
    q: 'Which format should I choose for photographs?',
    a: 'WebP usually wins: it is typically 25–35% smaller than JPG at the same visible quality, and every current browser displays it. Choose JPG when the file has to open in older software.',
  },
  {
    q: 'Is there a limit on how many files I can compress?',
    a: 'No. There is no daily cap and no account. The only ceiling is your device’s memory, so on a phone it is best to work in batches of a few images.',
  },
];

export default function CompressPage({ target }) {
  const single = Boolean(target);
  const label = single ? FORMATS[target].label : null;
  const title = single ? `${label} Compressor` : 'Image Compressor';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo
        title={`${title} — Compress Images Free, In Your Browser | Convertly`}
        description={`${single ? `Reduce ${label} file size` : 'Compress JPG and WebP images'} free, directly in your browser. Choose a quality level or set a target file size. No uploads, no account, no limits.`}
        path={single ? `/${target}-compressor` : '/image-compressor'}
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Image Compressor', to: '/image-compressor' }, ...(single ? [{ label: `${label} Compressor` }] : [])]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {single
          ? `Re-encode your ${label} images at a quality level you control — or set a maximum file size and let Convertly find the smallest version that fits.`
          : 'Make your images smaller by re-encoding them to WebP or JPG at a quality level you control, or by setting a maximum file size for the result.'}{' '}
        Everything happens in your browser, so there is nothing to upload and nothing to wait for.
      </p>

      <div className="mt-8">
        <ConverterWorkspace
          mode="compress"
          target={single ? target : 'webp'}
          allowTargetSelect={!single}
          targetOptions={['webp', 'jpg']}
          hint="Add JPG, PNG, WebP, AVIF, HEIC, BMP, GIF, TIFF, SVG, JFIF or ICO images to compress."
          capabilities={{ resize: true, quality: true, background: false, maxSize: true }}
          ctaLabel="Compress images"
        />
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
        Not every result is smaller, and Convertly will not pretend otherwise. Photographs normally shrink a lot;
        screenshots, logos and flat graphics often grow when re-encoded to a lossy format. After each conversion you
        see the exact before-and-after size, and lossless PNG output is always available from the converter pages when
        you need it.
      </p>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">How to compress an image without uploading it</h2>
        <ol className="mt-5 space-y-3">
          {[
            'Add your images — drag them onto the panel or pick them with “Choose files”.',
            'Open “Advanced settings” and either choose a preset (Smallest, Balanced, High) or type a target size in kilobytes.',
            'Press “Compress images”. Each file is decoded, re-rendered and re-encoded on your device.',
            'Compare the before and after sizes, then download the results individually or together as a ZIP.',
          ].map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <LinkGrid
        className="mt-14"
        title="Other ways to shrink a file"
        links={[
          { to: '/image-compressor', label: 'Image Compressor' },
          { to: '/jpg-compressor', label: 'JPG Compressor' },
          { to: '/webp-compressor', label: 'WebP Compressor' },
          { to: '/png-to-webp', label: 'PNG to WebP' },
          { to: '/jpg-to-webp', label: 'JPG to WebP' },
          { to: '/image-resizer', label: 'Image Resizer' },
        ]}
        columns={3}
      />

      <FaqSection faqs={FAQS} title="Compression questions" />
    </div>
  );
}