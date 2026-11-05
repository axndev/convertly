import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CopyButton from './CopyButton';

export default function UrlCodecTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const run = (mode) => {
    setError(null);
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input.replace(/\+/g, ' ')));
    } catch {
      setOutput('');
      setError('That is not valid percent-encoded text — check for a stray “%” followed by non-hexadecimal characters.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div>
          <label htmlFor="url-input" className="text-sm font-medium">Input</label>
          <Textarea
            id="url-input"
            rows={6}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://example.com/search?q=red shoes&page=2"
            className="mt-2 font-mono text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={() => run('encode')} disabled={!input}>
            Encode
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => run('decode')} disabled={!input}>
            Decode
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setInput(output);
              setOutput(input);
              setError(null);
            }}
            disabled={!output}
          >
            Swap
          </Button>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="url-output" className="text-sm font-medium">Output</label>
            <CopyButton value={output} />
          </div>
          <Textarea id="url-output" readOnly rows={6} value={output} className="mt-2 break-all font-mono text-xs" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Encoding percent-escapes everything that is not safe in a URL, which is what you want inside a query value.
        Decoding turns “%20” back into a space and “+” into a space, so an encoded form value reads normally again.
      </p>
    </div>
  );
}