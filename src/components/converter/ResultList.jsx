import React from 'react';
import { Download, FileArchive, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FORMATS } from '@/lib/formats';
import { formatBytes, sizeChange } from '@/lib/convert/files';

export default function ResultList({ files, onDownload, onDownloadAll, zipping }) {
  const done = files.filter((item) => item.result);
  if (!done.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-base font-semibold">
            {done.length} {done.length === 1 ? 'file' : 'files'} converted
          </p>
          <p className="text-xs text-muted-foreground">Created in your browser and ready to download.</p>
        </div>
        <Button onClick={onDownloadAll} disabled={zipping} className="rounded-full">
          {zipping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileArchive className="mr-2 h-4 w-4" />}
          {done.length === 1 ? 'Download file' : 'Download all as ZIP'}
        </Button>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {done.map((item) => {
          const change = sizeChange(item.size, item.result.size);
          return (
            <li key={item.id} className="flex gap-3 rounded-2xl border border-border bg-background p-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                {item.result.format === 'ico' ? (
                  <span className="text-xs font-semibold text-muted-foreground">ICO</span>
                ) : (
                  <img src={item.result.url} alt={`Preview of ${item.result.name}`} className="h-full w-full object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.result.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {FORMATS[item.result.format] ? FORMATS[item.result.format].label : item.result.format.toUpperCase()} ·{' '}
                  {item.result.width} × {item.result.height}px · {formatBytes(item.result.size)}
                </p>
                {change && (
                  <p className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${change.smaller ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                    {change.smaller ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {change.smaller ? `${Math.abs(change.pct)}% smaller` : `${change.pct}% larger`} than {formatBytes(item.size)}
                  </p>
                )}
                <div className="mt-2">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => onDownload(item)}>
                    <Download className="mr-2 h-3.5 w-3.5" /> Download {item.result.name.split('.').pop().toUpperCase()}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}