import React from 'react';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FORMATS } from '@/lib/formats';
import { formatBytes } from '@/lib/convert/files';

export default function FileQueue({ files, onRemove, onClear, running }) {
  if (!files.length) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-sm font-medium">
          {files.length} {files.length === 1 ? 'file' : 'files'} in the queue
        </p>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={running} className="rounded-full">
          Clear all
        </Button>
      </div>
      <ul className="divide-y divide-border">
        {files.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              {item.status === 'working' && <Loader2 className="h-4 w-4 animate-spin text-violet-600" />}
              {item.status === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {item.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
              {item.status === 'ready' && <span className="text-xs font-semibold text-muted-foreground">{item.detected ? FORMATS[item.detected].label : '?'}</span>}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>{formatBytes(item.size)}</span>
                {item.detected && <span aria-hidden="true">·</span>}
                {item.detected && <span>{FORMATS[item.detected].label} detected</span>}
                {item.status === 'working' && item.stage && <span aria-hidden="true">·</span>}
                {item.status === 'working' && item.stage && <span>{item.stage}…</span>}
                {item.status === 'done' && item.result && <span aria-hidden="true">·</span>}
                {item.status === 'done' && item.result && <span>saved as {item.result.name}</span>}
              </p>
              {item.error && <p className="mt-1 text-xs text-destructive">{item.error}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} disabled={running} aria-label={`Remove ${item.name}`}>
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}