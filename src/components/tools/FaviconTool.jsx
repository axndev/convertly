import React, { useEffect, useState } from 'react';
import { Download, FileArchive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileInput from './FileInput';
import CopyButton from './CopyButton';
import { decodeImage } from '@/lib/convert/image';
import { encodeICO, squareCanvas } from '@/lib/convert/ico';
import { createZip } from '@/lib/convert/zip';
import { downloadBlob, formatBytes } from '@/lib/convert/files';
import { IMAGE_ACCEPT } from '@/lib/formats';

const PNG_SIZES = [16, 32, 48, 180, 192, 512];

const SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

const toBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

export default function FaviconTool() {
  const [source, setSource] = useState(null);
  const [pngs, setPngs] = useState([]);
  const [ico, setIco] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [zipping, setZipping] = useState(false);

  useEffect(
    () => () => {
      pngs.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [pngs]
  );

  const build = async (file) => {
    setBusy(true);
    setError(null);
    setPngs([]);
    setIco(null);
    try {
      const decoded = await decodeImage(file);
      try {
        const results = [];
        for (const size of PNG_SIZES) {
          const canvas = squareCanvas(decoded.source, decoded.width, decoded.height, size);
          const blob = await toBlob(canvas);
          if (!blob) continue;
          results.push({ size, blob, url: URL.createObjectURL(blob) });
        }
        const square = squareCanvas(decoded.source, decoded.width, decoded.height, 256);
        const icoBlob = await encodeICO(square);
        setPngs(results);
        setIco({ blob: icoBlob, url: URL.createObjectURL(icoBlob) });
        setSource({ name: file.name, size: file.size, width: decoded.width, height: decoded.height });
      } finally {
        decoded.release && decoded.release();
      }
    } catch (err) {
      setError(err.message || 'This image could not be processed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    if (!ico || !pngs.length) return;
    setZipping(true);
    try {
      const entries = [
        { name: 'favicon.ico', blob: ico.blob },
        ...pngs.map((item) => ({
          name: item.size === 180 ? 'apple-touch-icon.png' : `favicon-${item.size}x${item.size}.png`,
          blob: item.blob,
        })),
        {
          name: 'site.webmanifest',
          blob: new Blob(
            [
              JSON.stringify(
                {
                  name: '',
                  short_name: '',
                  icons: [
                    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
                  ],
                  theme_color: '#ffffff',
                  background_color: '#ffffff',
                  display: 'standalone',
                },
                null,
                2
              ),
            ],
            { type: 'application/json' }
          ),
        },
        { name: 'favicon-head-tags.html', blob: new Blob([SNIPPET], { type: 'text/html' }) },
      ];
      const zip = await createZip(entries);
      downloadBlob(zip, 'convertly-favicon-pack.zip');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileInput onFile={build} accept={IMAGE_ACCEPT} label="Choose a square image" hint="A square logo works best — 512 × 512px or larger. Everything is generated locally." />

      {busy && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Rendering every icon size…
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!!pngs.length && ico && (
        <>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="truncate text-sm font-medium">{source.name}</p>
                <p className="text-xs text-muted-foreground">
                  {source.width} × {source.height}px source · {pngs.length + 1} files generated
                </p>
              </div>
              <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={downloadAll} disabled={zipping}>
                {zipping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileArchive className="mr-2 h-4 w-4" />}
                Download icon pack (ZIP)
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                <img src={ico.url} alt="favicon.ico preview" className="mx-auto h-12 w-12" />
                <p className="mt-2 text-xs font-medium">favicon.ico</p>
                <p className="text-xs text-muted-foreground">16, 32, 48, 256px</p>
                <Button size="sm" variant="ghost" className="mt-1 rounded-full" onClick={() => downloadBlob(ico.blob, 'favicon.ico')}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Save
                </Button>
              </div>
              {pngs.map((item) => {
                const name = item.size === 180 ? 'apple-touch-icon.png' : `favicon-${item.size}x${item.size}.png`;
                return (
                  <div key={item.size} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                    <img src={item.url} alt={`${item.size}px preview`} className="mx-auto" style={{ width: Math.min(48, item.size), height: Math.min(48, item.size) }} />
                    <p className="mt-2 text-xs font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(item.blob.size)}</p>
                    <Button size="sm" variant="ghost" className="mt-1 rounded-full" onClick={() => downloadBlob(item.blob, name)}>
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">Add these tags to your &lt;head&gt;</p>
              <CopyButton value={SNIPPET} label="Copy tags" />
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-3 font-mono text-xs leading-relaxed">{SNIPPET}</pre>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Upload the files to the root of your site. Modern browsers use the .ico for the tab icon and the PNG sizes
              for home-screen shortcuts; the 180px version is what iOS uses for an “Add to Home Screen” bookmark.
            </p>
          </div>
        </>
      )}
    </div>
  );
}