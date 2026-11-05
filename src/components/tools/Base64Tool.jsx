import React, { useEffect, useState } from 'react';
import { ArrowDownUp, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileInput from './FileInput';
import CopyButton from './CopyButton';
import { downloadBlob, formatBytes } from '@/lib/convert/files';

const encodeBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeBase64 = (value) => {
  const clean = value.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return { bytes, text: new TextDecoder().decode(bytes) };
};

export default function Base64Tool({ variant = 'text' }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [extension, setExtension] = useState('png');

  useEffect(() => () => image && image.url && URL.revokeObjectURL(image.url), [image]);

  const run = (mode) => {
    setError(null);
    try {
      setOutput(mode === 'encode' ? encodeBase64(input) : decodeBase64(input).text);
    } catch {
      setOutput('');
      setError(
        mode === 'decode'
          ? 'That does not look like valid Base64. Remove any stray characters and try again.'
          : 'This text could not be encoded.'
      );
    }
  };

  const onImage = (file) => {
    setBusy(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ name: file.name, size: file.size, dataUrl: String(reader.result), type: file.type });
      setBusy(false);
    };
    reader.onerror = () => {
      setError('This file could not be read.');
      setBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const decodeToImage = () => {
    setError(null);
    setImage(null);
    try {
      const { bytes } = decodeBase64(input);
      const blob = new Blob([bytes]);
      setImage({ name: `decoded-image.${extension}`, size: blob.size, blob, url: URL.createObjectURL(blob) });
    } catch {
      setError('That does not look like valid Base64 image data.');
    }
  };

  if (variant === 'image') {
    return (
      <div className="space-y-5">
        <FileInput onFile={onImage} accept="image/*" label="Choose an image" hint="The image is read on your device and turned into a Base64 data URI." />
        {busy && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Reading the file…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {image && image.dataUrl && (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="truncate text-sm font-medium">{image.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(image.size)} → {formatBytes(Math.round(image.dataUrl.length * 0.75))} of Base64 text
                </p>
              </div>
              <CopyButton value={image.dataUrl} label="Copy data URI" />
            </div>
            {image.type && image.type.startsWith('image/') && (
              <img src={image.dataUrl} alt={`Preview of ${image.name}`} className="max-h-48 w-auto rounded-xl border border-border" />
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Use it in CSS</p>
              <Textarea readOnly rows={3} className="mt-1 font-mono text-xs" value={`background-image: url("${image.dataUrl.slice(0, 80)}…");`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Base64 data ({image.dataUrl.length.toLocaleString()} characters, showing the start)</p>
              <Textarea readOnly rows={6} className="mt-1 break-all font-mono text-xs" value={image.dataUrl.slice(0, 4000)} />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Inline data URIs make HTML and CSS heavier and stop browsers caching the image separately, so use them for
              small icons and logos rather than photographs.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'decode-image') {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <label htmlFor="b64-image" className="text-sm font-medium">Paste Base64 image data</label>
          <Textarea
            id="b64-image"
            rows={7}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgo…"
            className="mt-2 font-mono text-xs"
          />
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="w-40">
              <Select value={extension} onValueChange={setExtension}>
                <SelectTrigger aria-label="File extension">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['png', 'jpg', 'webp', 'gif', 'svg', 'ico'].map((key) => (
                    <SelectItem key={key} value={key}>
                      .{key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={decodeToImage} disabled={!input.trim()}>
              Decode to image
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            You can also drop a .txt file containing the Base64 text onto the field above, or paste a data URI straight
            from your code editor.
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {image && image.url && (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <img src={image.url} alt="Decoded result" className="max-h-72 w-auto rounded-xl border border-border" />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-muted-foreground">{formatBytes(image.size)}</p>
              <Button variant="outline" className="rounded-full" onClick={() => downloadBlob(image.blob, image.name)}>
                <Download className="mr-2 h-4 w-4" /> Download {image.name}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div>
          <label htmlFor="b64-input" className="text-sm font-medium">Input</label>
          <Textarea
            id="b64-input"
            rows={6}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type or paste text, or paste Base64 to decode…"
            className="mt-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={() => run('encode')} disabled={!input}>
            <ArrowDownUp className="mr-2 h-4 w-4" /> Encode to Base64
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => run('decode')} disabled={!input}>
            Decode from Base64
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
            Use output as input
          </Button>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="b64-output" className="text-sm font-medium">Output</label>
            <CopyButton value={output} />
          </div>
          <Textarea id="b64-output" readOnly rows={6} value={output} className="mt-2 break-all font-mono text-xs" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Encode a file</p>
        <p className="mt-1 text-xs text-muted-foreground">Any file can be turned into Base64 text — useful for certificates, fonts and small assets.</p>
        <div className="mt-3">
          <FileInput
            onFile={(file) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = String(reader.result);
                setOutput(result.slice(result.indexOf(',') + 1));
                setError(null);
              };
              reader.readAsDataURL(file);
            }}
            label="Choose any file"
            hint="The file is read locally, never uploaded."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <p className="text-sm font-medium">Decode Base64 straight to a file</p>
        <p className="mt-1 text-xs text-muted-foreground">Paste Base64 data (a data URI is fine), then download the exact bytes it represents.</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste Base64 to save as a file"
            className="min-w-[240px] flex-1 font-mono text-xs"
            aria-label="Base64 to save as a file"
          />
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!input}
            onClick={() => {
              try {
                const { bytes } = decodeBase64(input);
                downloadBlob(new Blob([bytes]), 'decoded-file.bin');
                setError(null);
              } catch {
                setError('That does not look like valid Base64.');
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Save as file
          </Button>
        </div>
      </div>
    </div>
  );
}