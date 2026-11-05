import React, { useState } from 'react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileInput from './FileInput';
import CopyButton from './CopyButton';
import { formatBytes } from '@/lib/convert/files';

const ALGORITHMS = [
  { value: 'SHA-256', label: 'SHA-256 (recommended)' },
  { value: 'SHA-1', label: 'SHA-1 (legacy)' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
];

const toHex = (buffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

export default function HashTool() {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [result, setResult] = useState(null);
  const [subject, setSubject] = useState(null);
  const [busy, setBusy] = useState(false);

  const hashText = async () => {
    setBusy(true);
    try {
      const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
      setResult(toHex(digest));
      setSubject(`${text.length} characters of text`);
    } finally {
      setBusy(false);
    }
  };

  const hashFile = async (file) => {
    setBusy(true);
    setResult(null);
    try {
      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest(algorithm, buffer);
      setResult(toHex(digest));
      setSubject(`${file.name} · ${formatBytes(file.size)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="hash-input" className="text-sm font-medium">Text to hash</label>
        <Textarea
          id="hash-input"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type or paste the value you want to hash…"
          className="mt-2 font-mono text-xs"
        />
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="w-64">
            <Select value={algorithm} onValueChange={(value) => { setAlgorithm(value); setResult(null); }}>
              <SelectTrigger aria-label="Hash algorithm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={hashText} disabled={!text || busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
            Generate hash
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Hash a file</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Checksums are how you prove a download arrived intact. Large files are read in one pass on your device.
        </p>
        <div className="mt-3">
          <FileInput onFile={hashFile} accept="*" label="Choose any file" hint="The file is read locally to compute its digest." disabled={busy} />
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{algorithm} digest</p>
          {subject && <p className="mt-1 text-xs text-muted-foreground">{subject}</p>}
          <p className="mt-3 break-all rounded-xl bg-muted/60 p-3 font-mono text-xs">{result}</p>
          <div className="mt-3">
            <CopyButton value={result} label="Copy hash" />
          </div>
        </div>
      )}
    </div>
  );
}