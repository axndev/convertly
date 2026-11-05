import React, { useEffect, useState } from 'react';
import { Download, FlipHorizontal2, FlipVertical2, Loader2, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FileInput from './FileInput';
import { decodeImage, encodeCanvas, makeCanvas } from '@/lib/convert/image';
import { downloadBlob, outputName } from '@/lib/convert/files';
import { formatBytes } from '@/lib/convert/files';
import { FORMATS, IMAGE_ACCEPT, canEncode } from '@/lib/formats';

export default function ImageTransformTool({ mode }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState('png');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const onFile = (selected) => {
    setFile(selected);
    setResult(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPreviewUrl(URL.createObjectURL(selected));
    setFormat(mode === 'flip' ? (canEncode('png') ? 'png' : 'jpg') : 'png');
  };

  const render = async () => {
    if (!file) return;
    setBusy(true);
    setResult(null);
    try {
      const decoded = await decodeImage(file);
      try {
        const swap = rotation % 180 !== 0;
        const width = swap ? decoded.height : decoded.width;
        const height = swap ? decoded.width : decoded.height;
        const canvas = makeCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (format === 'jpg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(decoded.source, -decoded.width / 2, -decoded.height / 2);
        const blob = await encodeCanvas(canvas, format, { quality: 92 });
        const stem = file.name.replace(/\.[^.]+$/, '');
        const name = `${stem}-${mode === 'flip' ? (flipH ? 'flipped-h' : 'flipped-v') : `rotated-${rotation}`}.${FORMATS[format].ext}`;
        setResult({ blob, url: URL.createObjectURL(blob), name, width: canvas.width, height: canvas.height });
      } finally {
        decoded.release && decoded.release();
      }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResult(null);
  };

  return (
    <div className="space-y-5">
      {!file && <FileInput onFile={onFile} accept={IMAGE_ACCEPT} label="Choose an image" hint="Drag an image here, or choose one from your device." />}

      {file && (
        <>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            </div>
            <div className="mt-4 flex justify-center overflow-hidden rounded-xl bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] p-3">
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                className="max-h-72 w-auto max-w-full transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'rotate' ? (
              <>
                <Button variant="outline" className="rounded-full" onClick={() => setRotation((rotation + 90) % 360)}>
                  <RotateCw className="mr-2 h-4 w-4" /> Rotate 90° right
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setRotation((rotation + 270) % 360)}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Rotate 90° left
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setRotation((rotation + 180) % 360)}>
                  Rotate 180°
                </Button>
              </>
            ) : (
              <>
                <Button variant={flipH ? 'default' : 'outline'} className="rounded-full" onClick={() => setFlipH(!flipH)}>
                  <FlipHorizontal2 className="mr-2 h-4 w-4" /> Flip horizontally
                </Button>
                <Button variant={flipV ? 'default' : 'outline'} className="rounded-full" onClick={() => setFlipV(!flipV)}>
                  <FlipHorizontal2 className="mr-2 h-4 w-4 rotate-90" /> Flip vertically
                </Button>
              </>
            )}
            <Button variant="ghost" className="rounded-full" onClick={reset}>
              Reset
            </Button>
          </div>

          <div className="grid gap-3 sm:max-w-md">
            <div>
              <Label htmlFor="out-format" className="text-sm font-medium">Save as</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="out-format" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['png', 'jpg', 'webp'].map((key) => (
                    <SelectItem key={key} value={key}>
                      {FORMATS[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={render} disabled={busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === 'rotate' ? 'Rotate and download' : 'Flip and download'}
            </Button>
            {result && (
              <Button variant="outline" className="rounded-full" onClick={() => downloadBlob(result.blob, result.name)}>
                <Download className="mr-2 h-4 w-4" /> Download {result.name}
              </Button>
            )}
          </div>

          {result && <p className="text-xs text-muted-foreground">{result.width} × {result.height}px · {formatBytes(result.blob.size)}</p>}
        </>
      )}
    </div>
  );
}