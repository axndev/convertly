import React, { useEffect, useState } from 'react';
import { Download, Eraser, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FileInput from './FileInput';
import { convertFile, probeSize } from '@/lib/convert/image';
import { sniffFormat } from '@/lib/convert/sniff';
import { downloadBlob, formatBytes, outputName } from '@/lib/convert/files';
import { FORMATS, IMAGE_ACCEPT } from '@/lib/formats';
import { readExif } from '@/lib/convert/exif';

export default function MetadataRemoverTool() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [format, setFormat] = useState('jpg');
    const [found, setFound] = useState(null);
    const [result, setResult] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

    const onFile = async (selected) => {
        setFile(selected);
        setResult(null);
        setPreviewUrl(URL.createObjectURL(selected));
        const detected = await sniffFormat(selected);
        setFormat(detected && ['jpg', 'png', 'webp'].includes(detected) ? detected : 'jpg');
        const exif = await readExif(selected);
        setFound(exif ? Object.keys(exif).length : 0);
    };

    const clean = async () => {
        if (!file) return;
        setBusy(true);
        setResult(null);
        try {
            const output = await convertFile(file, { target: format, settings: { quality: 92, resize: { mode: 'original' } } });
            setResult({ blob: output.blob, name: outputName(file.name, FORMATS[format].ext), width: output.width, height: output.height });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-5">
            {!file && <FileInput onFile={onFile} accept={IMAGE_ACCEPT} label="Choose an image" hint="JPG files usually carry camera, date and sometimes GPS data. Add one to strip it." />}

            {file && (
                <>
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="truncate text-sm font-medium">{file.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {formatBytes(file.size)} · {found === null ? 'checking metadata…' : found ? `${found} metadata fields found` : 'no readable metadata found'}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => { setFile(null); setResult(null); setPreviewUrl(null); }}>
                                Choose another
                            </Button>
                        </div>
                        {previewUrl && <img src={previewUrl} alt={`Preview of ${file.name}`} className="mt-4 max-h-56 w-auto rounded-xl border border-border" />}
                    </div>

                    <div className="grid gap-3 sm:max-w-md">
                        <div>
                            <Label htmlFor="clean-format" className="text-sm font-medium">Re-save as</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger id="clean-format" className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {['jpg', 'png', 'webp'].map((key) => (
                                        <SelectItem key={key} value={key}>
                                            {FORMATS[key].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={clean} disabled={busy}>
                            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eraser className="mr-2 h-4 w-4" />}
                            Remove metadata
                        </Button>
                        {result && (
                            <Button variant="outline" className="rounded-full" onClick={() => downloadBlob(result.blob, result.name)}>
                                <Download className="mr-2 h-4 w-4" /> Download {result.name}
                            </Button>
                        )}
                    </div>

                    {result && (
                        <p className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                            Cleaned copy created: {formatBytes(file.size)} → {formatBytes(result.blob.size)} ({result.width} × {result.height}px). The
                            image is re-rendered on a canvas, so camera details, timestamps, GPS positions and editing history are not
                            carried across.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}