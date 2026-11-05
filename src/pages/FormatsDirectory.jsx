import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MinusCircle } from 'lucide-react';
import Seo from '@/components/Seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FORMATS, SOURCE_KEYS, TARGET_KEYS } from '@/lib/formats';
import { conversionsFrom, conversionsTo } from '@/lib/conversions';

export default function FormatsDirectory() {
  const formats = SOURCE_KEYS.map((key) => FORMATS[key]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      <Seo
        title="Format Directory — Every Format Convertly Supports | Convertly"
        description="The full list of image formats Convertly can read and write in your browser, with extensions, MIME types and honest notes on browser support."
        path="/formats"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Format Directory' }]} />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Format Directory</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        Every format here has its own converter page listing exactly which conversions work. Formats marked as
        “not available as output” are genuinely impossible to write from a browser — Convertly says so rather than
        offering a button that quietly renames your file.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Format</th>
              <th className="px-4 py-3 font-semibold">Extensions</th>
              <th className="px-4 py-3 font-semibold">MIME type</th>
              <th className="px-4 py-3 font-semibold">Read here</th>
              <th className="px-4 py-3 font-semibold">Write here</th>
              <th className="px-4 py-3 font-semibold">Converter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {formats.map((format) => {
              const inbound = conversionsTo(format.key).length;
              const outbound = conversionsFrom(format.key).length;
              return (
                <tr key={format.key} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{format.label}</p>
                    <p className="mt-0.5 max-w-xs text-xs leading-relaxed text-muted-foreground">{format.tagline}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    .{format.ext}
                    {format.altExts.map((ext) => (
                      <span key={ext}>, .{ext}</span>
                    ))}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{format.mime}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      {format.decode === 'yes' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Yes
                        </>
                      ) : (
                        <>
                          <MinusCircle className="h-3.5 w-3.5 text-amber-500" /> Browser dependent
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      {TARGET_KEYS.includes(format.key) ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Yes
                        </>
                      ) : (
                        <>
                          <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" /> Not available as output
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/${format.key}-converter`} className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
                      {format.label} converter
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {outbound ? `${outbound} out` : ''}
                      {outbound && inbound ? ' · ' : ''}
                      {inbound ? `${inbound} in` : ''}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'Everything is local',
            text: 'Reading and writing happens through your browser’s own image engine, plus Convertly’s own BMP, ICO, EXIF and ZIP code. No conversion service is contacted.',
          },
          {
            title: 'Content, not extensions',
            text: 'When you add a file, Convertly checks its actual bytes. A PNG that has been renamed to .jpg is reported honestly instead of being converted as a JPG.',
          },
          {
            title: 'No fake conversions',
            text: 'Formats that cannot be encoded in a browser are shown as unavailable. Convertly will never hand back a renamed copy of your file.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-heading text-base font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}