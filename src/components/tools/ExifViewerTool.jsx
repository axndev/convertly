import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import FileInput from './FileInput';
import { probeSize } from '@/lib/convert/image';
import { sniffFormat } from '@/lib/convert/sniff';
import { readExif } from '@/lib/convert/exif';
import { formatBytes } from '@/lib/convert/files';
import { FORMATS, IMAGE_ACCEPT } from '@/lib/formats';

export default function ExifViewerTool() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const onFile = async (selected) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setLoading(true);
    setInfo(null);
    try {
      const detected = await sniffFormat(selected);
      let dimensions = null;
      try {
        dimensions = await probeSize(selected);
      } catch {
        dimensions = null;
      }
      const exif = await readExif(selected);
      const entries = exif ? Object.entries(exif) : [];
      if (dimensions) {
        entries.push(['Pixel dimensions', `${dimensions.width} × ${dimensions.height}`]);
      }
      setInfo({ detected, dimensions, entries, lastModified: selected.lastModified ? new Date(selected.lastModified).toLocaleString() : null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file && <FileInput onFile={onFile} accept={IMAGE_ACCEPT} label="Choose an image" hint="EXIF data is written by cameras into JPG files. Add a photo to see what it reveals." />}

      {file && (
        <>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatBytes(file.size)} · {info && info.detected ? FORMATS[info.detected].label : file.type || 'unknown type'}
                  {info && info.lastModified ? ` · modified ${info.lastModified}` : ''}
                </p>
              </div>
              <button type="button" className="text-xs font-medium text-violet-600 hover:text-violet-700" onClick={() => { setFile(null); setPreviewUrl(null); setInfo(null); }}>
                Choose another
              </button>
            </div>
            <img src={previewUrl} alt={`Preview of ${file.name}`} className="mt-4 max-h-56 w-auto rounded-xl border border-border" />
          </div>

          {loading && <p className="text-sm text-muted-foreground">Reading metadata…</p>}

          {!loading && info && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {info.entries.length ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {info.entries.map(([key, value]) => (
                      <tr key={key}>
                        <th scope="row" className="w-1/2 px-4 py-2.5 text-left font-medium text-muted-foreground">{key}</th>
                        <td className="px-4 py-2.5 font-mono text-xs">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-4 py-4 text-sm text-muted-foreground">
                  No readable EXIF metadata was found in this file. That is normal for PNG, WebP, screenshots and images
                  that have already been cleaned.
                </p>
              )}
            </div>
          )}

          <p className="flex items-start gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
            Convertly reads the EXIF segment directly from the file bytes on your device. If you would rather remove
            this data before sharing a photo, use the Metadata Remover tool.
          </p>
        </>
      )}
    </div>
  );
}