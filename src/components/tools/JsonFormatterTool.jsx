import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Minimize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CopyButton from './CopyButton';
import { formatBytes } from '@/lib/convert/files';

function locate(text, message) {
  const match = /position (\d+)/.exec(message);
  if (!match) return null;
  const position = Number(match[1]);
  const before = text.slice(0, position);
  const line = before.split('\n').length;
  const column = position - before.lastIndexOf('\n');
  return { line, column };
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);

  const parse = (text) => {
    try {
      return { value: JSON.parse(text), error: null };
    } catch (error) {
      return { value: null, error };
    }
  };

  const format = (indent) => {
    const { value, error } = parse(input);
    if (error) {
      const at = locate(input, error.message);
      setOutput('');
      setStatus({ ok: false, message: `${error.message}${at ? ` (line ${at.line}, column ${at.column})` : ''}` });
      return;
    }
    setOutput(JSON.stringify(value, null, indent));
    setStatus({ ok: true, message: indent ? 'Valid JSON — formatted with 2-space indentation.' : 'Valid JSON — minified onto one line.' });
  };

  const validate = () => {
    const { error } = parse(input);
    if (error) {
      const at = locate(input, error.message);
      setStatus({ ok: false, message: `${error.message}${at ? ` (line ${at.line}, column ${at.column})` : ''}` });
      return;
    }
    setStatus({ ok: true, message: 'Valid JSON. Nothing was changed.' });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="json-input" className="text-sm font-medium">JSON input</label>
            <span className="text-xs text-muted-foreground">{input ? formatBytes(new Blob([input]).size) : '0 B'}</span>
          </div>
          <Textarea
            id="json-input"
            rows={10}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='{"name":"Convertly","free":true,"limits":null}'
            className="mt-2 font-mono text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={() => format(2)} disabled={!input.trim()}>
            <Sparkles className="mr-2 h-4 w-4" /> Format
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => format(0)} disabled={!input.trim()}>
            <Minimize2 className="mr-2 h-4 w-4" /> Minify
          </Button>
          <Button variant="ghost" className="rounded-full" onClick={validate} disabled={!input.trim()}>
            Validate only
          </Button>
        </div>
        {status && (
          <p className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs leading-relaxed ${status.ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>
            {status.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {status.message}
          </p>
        )}
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="json-output" className="text-sm font-medium">Result</label>
            <CopyButton value={output} />
          </div>
          <Textarea id="json-output" readOnly rows={10} value={output} className="mt-2 font-mono text-xs" />
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Your JSON is parsed with the browser’s own parser and never leaves the page, which matters when the document
        contains keys, tokens or customer records.
      </p>
    </div>
  );
}