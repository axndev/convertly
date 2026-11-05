import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, FileSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileInput from './FileInput';
import CopyButton from './CopyButton';
import { MIME_TYPES, extensionOf } from '@/lib/mimeTypes';
import { sniffFormat } from '@/lib/convert/sniff';
import { FORMATS } from '@/lib/formats';
import { formatBytes } from '@/lib/convert/files';

export default function MimeCheckerTool() {
  const [extension, setExtension] = useState('webp');
  const [inspected, setInspected] = useState(null);

  const lookup = MIME_TYPES[extension.replace(/^\./, '').toLowerCase()];
  const options = Object.keys(MIME_TYPES).sort();

  useEffect(() => () => {
    /* nothing to revoke — no object URLs are created here */
  }, []);

  const inspect = async (file) => {
    const detected = await sniffFormat(file);
    const ext = extensionOf(file.name);
    const declared = MIME_TYPES[ext];
    const truth = detected ? FORMATS[detected] : null;
    const matches = detected
      ? ext === detected || (FORMATS[detected].altExts || []).includes(ext)
      : null;
    setInspected({
      name: file.name,
      size: file.size,
      extension: ext,
      browserType: file.type || 'not reported by the browser',
      declared: declared ? declared.mime : null,
      detectedKey: detected,
      detectedMime: truth ? truth.mime : null,
      detectedLabel: truth ? truth.label : null,
      matches,
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Look up a MIME type by extension</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="w-64">
            <label htmlFor="mime-ext" className="text-xs text-muted-foreground">Choose or type an extension</label>
            <Select value={extension} onValueChange={setExtension}>
              <SelectTrigger id="mime-ext" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((key) => (
                  <SelectItem key={key} value={key}>
                    .{key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <label htmlFor="mime-custom" className="text-xs text-muted-foreground">Or type one</label>
            <Input id="mime-custom" value={extension} onChange={(event) => setExtension(event.target.value)} className="mt-1" placeholder="svg" />
          </div>
        </div>

        {lookup ? (
          <div className="mt-4 rounded-xl bg-muted/60 p-4">
            <p className="font-mono text-base font-semibold">{lookup.mime}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {lookup.label} · {lookup.kind}
            </p>
            <div className="mt-3">
              <CopyButton value={lookup.mime} label="Copy MIME type" />
            </div>
          </div>
        ) : (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" /> No standard MIME type is listed for “.{extension.replace(/^\./, '')}” in
            this reference.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <FileSearch className="h-4 w-4 text-violet-600 dark:text-violet-400" /> Detect the real type of a file
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          A file’s extension is only a label. Convertly reads the first bytes of the file — its signature — and reports
          what it really contains.
        </p>
        <div className="mt-3">
          <FileInput onFile={inspect} accept="*" label="Choose any file" hint="The file is read locally to inspect its signature." />
        </div>
      </div>

      {inspected && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="truncate text-sm font-medium">{inspected.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatBytes(inspected.size)}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Extension</dt>
              <dd className="font-mono text-xs">.{inspected.extension || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">MIME type the browser reports</dt>
              <dd className="font-mono text-xs">{inspected.browserType}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">MIME type for that extension</dt>
              <dd className="font-mono text-xs">{inspected.declared || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">MIME type detected from content</dt>
              <dd className="font-mono text-xs">{inspected.detectedMime || 'not recognised'}</dd>
            </div>
          </dl>
          {inspected.matches === true && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              The content matches the extension — this file is what it claims to be ({inspected.detectedLabel}).
            </p>
          )}
          {inspected.matches === false && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Mismatch: the file is named .{inspected.extension} but its contents are {inspected.detectedLabel}. This is
              exactly how a renamed file hides its true format.
            </p>
          )}
          {inspected.matches === null && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Convertly does not recognise this signature. That is expected for plain text, some document and archive
              types, and any proprietary format.
            </p>
          )}
        </div>
      )}
    </div>
  );
}