import React from 'react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqSection from '@/components/FaqSection';
import LinkGrid from '@/components/LinkGrid';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';
import { FORMATS, TARGET_KEYS } from '@/lib/formats';
import { CONVERSIONS } from '@/lib/conversions';

const FAQS = [
  {
    q: 'What can the Convertly image converter do?',
    a: 'It converts image files between JPG, PNG, WebP, ICO and BMP, reading sources as varied as HEIC from an iPhone, AVIF, SVG, TIFF, JFIF, GIF, BMP and ICO. It resizes, sets quality and writes the result locally.',
  },
  {
    q: 'How is this different from the individual conversion pages?',
    a: 'Each pair — JPG to WebP, PNG to ICO and so on — has its own page with that format’s guides, answers and examples. This page is the general workspace for when you just want to drop files in and pick an output format.',
  },
  {
    q: 'Do I have to install anything?',
    a: 'No. There is no extension, no desktop app, no API key and no account. The converter is a web page that uses the image engine already inside your browser.',
  },
  {
    q: 'What happens to my files when I close the tab?',
    a: 'They are gone. Convertly holds them only in memory for the length of your visit, and since nothing was uploaded there is no copy anywhere to delete.',
  },
];

export default function GenericImageConverter() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo
        title="Image Converter — Convert Any Image Format Free | Convertly"
        description="Free browser image converter. Convert JPG, PNG, WebP, HEIC, AVIF, SVG, TIFF, BMP, GIF, JFIF and ICO files with batch conversion and resizing. No uploads, no sign-up, no limits."
        path="/image-converter"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Image Converter' }]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Image Converter</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        One workspace for every image conversion Convertly supports. Add as many files as you like, choose the output
        format, adjust size and quality, and download the results — all processed on your own device.
      </p>

      <div className="mt-8">
        <ConverterWorkspace
          target="webp"
          allowTargetSelect
          hint="Drop any images — JPG, PNG, WebP, HEIC, HEIF, AVIF, SVG, TIFF, BMP, GIF, JFIF or ICO."
          capabilities={{ resize: true, quality: true, background: true, maxSize: true }}
        />
      </div>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Every supported conversion</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {CONVERSIONS.length} conversion pairs, each with its own page, settings and answers. Nothing here is a
          doorway — every link below converts real files.
        </p>
        <div className="mt-6 space-y-8">
          {TARGET_KEYS.map((target) => (
            <LinkGrid
              key={target}
              title={`Convert to ${FORMATS[target].label}`}
              links={CONVERSIONS.filter((conversion) => conversion.to === target).map((conversion) => ({
                to: `/${conversion.slug}`,
                label: `${conversion.sourceLabel} to ${conversion.targetLabel}`,
              }))}
              columns={4}
            />
          ))}
        </div>
      </section>

      <FaqSection faqs={FAQS} title="Image converter questions" />
    </div>
  );
}