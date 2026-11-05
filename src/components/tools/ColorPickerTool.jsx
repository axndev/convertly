import React, { useEffect, useRef, useState } from 'react';
import { Pipette } from 'lucide-react';
import FileInput from './FileInput';
import CopyButton from './CopyButton';
import { IMAGE_ACCEPT } from '@/lib/formats';

const toHex = (r, g, b) => `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;

const toHsl = (r, g, b) => {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const lightness = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let saturation = 0;
    if (delta !== 0) {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));
        if (max === rr) hue = 60 * (((gg - bb) / delta) % 6);
        else if (max === gg) hue = 60 * ((bb - rr) / delta + 2);
        else hue = 60 * ((rr - gg) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
};

export default function ColorPickerTool() {
    const canvasRef = useRef(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [picked, setPicked] = useState(null);
    const [manual, setManual] = useState('#7c3aed');

    useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

    const onFile = (selected) => {
        setFile(selected);
        setPicked(null);
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const maxWidth = 900;
            const scale = Math.min(1, maxWidth / img.naturalWidth);
            canvas.width = Math.round(img.naturalWidth * scale);
            canvas.height = Math.round(img.naturalHeight * scale);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = url;
    };

    const sample = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
        const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
        const data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        const hex = toHex(data[0], data[1], data[2]);
        setPicked({ hex, rgb: `rgb(${data[0]}, ${data[1]}, ${data[2]})`, hsl: toHsl(data[0], data[1], data[2]), alpha: data[3] });
    };

    const manualRgb = (() => {
        const value = manual.replace('#', '');
        return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2) || '0', 16));
    })();

    return (
        <div className="space-y-5">
            {!file && <FileInput onFile={onFile} accept={IMAGE_ACCEPT} label="Choose an image" hint="Add an image, then click anywhere on it to read the exact colour of that pixel." />}

            {file && (
                <>
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium">{file.name}</p>
                            <button type="button" className="text-xs font-medium text-violet-600 hover:text-violet-700" onClick={() => { setFile(null); setPreviewUrl(null); setPicked(null); }}>
                                Choose another
                            </button>
                        </div>
                        <canvas
                            ref={canvasRef}
                            onClick={sample}
                            className="mt-4 h-auto w-full cursor-crosshair rounded-xl border border-border"
                            aria-label="Click the image to sample a colour"
                        />
                        <p className="mt-2 text-xs text-muted-foreground">Click any pixel to read its colour.</p>
                    </div>

                    {picked && (
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
                            <span className="h-14 w-14 rounded-xl border border-border" style={{ backgroundColor: picked.hex }} />
                            <div className="text-sm">
                                <p className="font-mono text-base font-semibold uppercase">{picked.hex}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{picked.rgb}</p>
                                <p className="text-xs text-muted-foreground">{picked.hsl}</p>
                                <p className="text-xs text-muted-foreground">alpha {picked.alpha}/255</p>
                            </div>
                            <CopyButton value={picked.hex} label="Copy HEX" />
                            <CopyButton value={picked.rgb} label="Copy RGB" />
                        </div>
                    )}
                </>
            )}

            <div className="rounded-2xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                    <Pipette className="h-4 w-4 text-violet-600 dark:text-violet-400" /> Pick a colour by value
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <input
                        type="color"
                        value={manual}
                        onChange={(event) => setManual(event.target.value)}
                        aria-label="Choose a colour"
                        className="h-12 w-20 cursor-pointer rounded-xl border border-border bg-card p-1"
                    />
                    <div className="text-sm">
                        <p className="font-mono text-base font-semibold uppercase">{manual}</p>
                        <p className="text-xs text-muted-foreground">rgb({manualRgb.join(', ')})</p>
                        <p className="text-xs text-muted-foreground">{toHsl(manualRgb[0], manualRgb[1], manualRgb[2])}</p>
                    </div>
                    <CopyButton value={manual} label="Copy HEX" />
                </div>
            </div>
        </div>
    );
}