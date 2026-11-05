import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { computeOutputSize } from '@/lib/convert/image';

export const DEFAULT_SETTINGS = {
  resize: { mode: 'original', width: '', height: '', percent: 100, maintainAspect: true },
  quality: 90,
  background: '#ffffff',
  maxSizeKB: '',
};

export default function AdvancedSettings({ settings, onChange, capabilities, targetLabel, previewDims, openByDefault = false }) {
  const [open, setOpen] = useState(openByDefault);
  const set = (patch) => onChange({ ...settings, ...patch });
  const setResize = (patch) => onChange({ ...settings, resize: { ...settings.resize, ...patch } });

  const output = previewDims ? computeOutputSize(previewDims, settings.resize) : null;
  const modes = [
    { value: 'original', label: 'Keep original size' },
    { value: 'width', label: 'Set width' },
    { value: 'height', label: 'Set height' },
    { value: 'both', label: 'Set width and height' },
    { value: 'percent', label: 'Scale by percentage' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Settings2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          Advanced settings
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {output ? <>output {output.width} × {output.height}px</> : 'optional'}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="space-y-6 border-t border-border px-4 py-5">
          {capabilities.resize && (
            <section className="space-y-3">
              <div>
                <Label htmlFor="resize-mode" className="text-sm font-medium">Resize output image</Label>
                <p className="text-xs text-muted-foreground">Leave on “Keep original size” to preserve the source dimensions.</p>
              </div>
              <Select value={settings.resize.mode} onValueChange={(value) => setResize({ mode: value })}>
                <SelectTrigger id="resize-mode" className="w-full sm:w-72">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-3 sm:max-w-md sm:grid-cols-2">
                {(settings.resize.mode === 'width' || settings.resize.mode === 'both') && (
                  <div>
                    <Label htmlFor="resize-width" className="text-xs text-muted-foreground">Width (px)</Label>
                    <Input
                      id="resize-width"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={settings.resize.width}
                      onChange={(event) => setResize({ width: event.target.value })}
                      placeholder="1920"
                      className="mt-1"
                    />
                  </div>
                )}
                {(settings.resize.mode === 'height' || settings.resize.mode === 'both') && (
                  <div>
                    <Label htmlFor="resize-height" className="text-xs text-muted-foreground">Height (px)</Label>
                    <Input
                      id="resize-height"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={settings.resize.height}
                      onChange={(event) => setResize({ height: event.target.value })}
                      placeholder="1080"
                      className="mt-1"
                    />
                  </div>
                )}
                {settings.resize.mode === 'percent' && (
                  <div>
                    <Label htmlFor="resize-percent" className="text-xs text-muted-foreground">Scale (%)</Label>
                    <Input
                      id="resize-percent"
                      type="number"
                      min="1"
                      max="400"
                      inputMode="numeric"
                      value={settings.resize.percent}
                      onChange={(event) => setResize({ percent: event.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {settings.resize.mode === 'both' && (
                <div className="flex items-center gap-3">
                  <Switch
                    id="aspect"
                    checked={settings.resize.maintainAspect !== false}
                    onCheckedChange={(checked) => setResize({ maintainAspect: checked })}
                  />
                  <Label htmlFor="aspect" className="text-sm">
                    Maintain aspect ratio
                    <span className="block text-xs font-normal text-muted-foreground">
                      Off stretches the image to exactly the width and height you set.
                    </span>
                  </Label>
                </div>
              )}

              {output && (
                <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  Expected output: <span className="font-medium text-foreground">{output.width} × {output.height}px</span> — shown from your first selected file.
                </p>
              )}
            </section>
          )}

          {capabilities.quality && (
            <section className="space-y-3 border-t border-border pt-5">
              <div>
                <Label htmlFor="quality" className="text-sm font-medium">Image compression</Label>
                <p className="text-xs text-muted-foreground">
                  {targetLabel} is a lossy format, so a lower quality makes a smaller file and softens fine detail.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Smallest (50)', value: 50 },
                  { label: 'Balanced (75)', value: 75 },
                  { label: 'High (90)', value: 90 },
                  { label: 'Maximum (100)', value: 100 },
                ].map((preset) => (
                  <Button
                    key={preset.value}
                    type="button"
                    size="sm"
                    variant={Number(settings.quality) === preset.value ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => set({ quality: preset.value })}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="sm:max-w-md">
                <Slider
                  id="quality"
                  value={[Number(settings.quality) || 90]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => set({ quality: value[0] })}
                  aria-label="Output quality"
                />
                <p className="mt-2 text-xs text-muted-foreground">Quality {settings.quality}</p>
              </div>
              <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                Not every conversion gets smaller. Converting to a lossless format such as PNG usually produces a
                larger file — Convertly shows both sizes after each conversion so nothing is hidden.
              </p>
            </section>
          )}

          {capabilities.maxSize && (
            <section className="space-y-3 border-t border-border pt-5">
              <div>
                <Label htmlFor="max-size" className="text-sm font-medium">Target maximum file size (optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Convertly will lower the quality automatically to try to fit. If your image cannot get that small, you
                  get the smallest result it managed.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:max-w-xs">
                <Input
                  id="max-size"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={settings.maxSizeKB}
                  onChange={(event) => set({ maxSizeKB: event.target.value })}
                  placeholder="e.g. 200"
                />
                <span className="text-sm text-muted-foreground">KB</span>
              </div>
            </section>
          )}

          {capabilities.background && (
            <section className="space-y-3 border-t border-border pt-5">
              <div>
                <Label htmlFor="background" className="text-sm font-medium">Background colour</Label>
                <p className="text-xs text-muted-foreground">
                  This format has no transparency, so transparent areas are filled with this colour.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="background"
                  type="color"
                  value={settings.background}
                  onChange={(event) => set({ background: event.target.value })}
                  className="h-9 w-14 cursor-pointer rounded-lg border border-border bg-card p-1"
                  aria-label="Background colour"
                />
                <span className="font-mono text-xs uppercase text-muted-foreground">{settings.background}</span>
              </div>
            </section>
          )}

          <section className="space-y-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            <p>These settings apply to every file in the queue. Images are re-rendered through your browser’s canvas, so file metadata such as camera details and GPS positions is not carried into the output.</p>
            <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => onChange({ ...DEFAULT_SETTINGS })}>
              <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset settings
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}