import React, { useEffect, useRef, useState } from 'react';
import { Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FORMATS, IMAGE_ACCEPT, SOURCE_KEYS, TARGET_KEYS } from '@/lib/formats';
import { convertFile, probeSize, resolveTarget } from '@/lib/convert/image';
import { detectedMatches, sniffFormat } from '@/lib/convert/sniff';
import { downloadBlob, outputName, uniqueName } from '@/lib/convert/files';
import { createZip } from '@/lib/convert/zip';
import UploadPanel from './UploadPanel';
import FileQueue from './FileQueue';
import AdvancedSettings, { DEFAULT_SETTINGS } from './AdvancedSettings';
import ResultList from './ResultList';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export default function ConverterWorkspace({
  target = 'jpg',
  mode = 'convert',
  allowTargetSelect = false,
  targetOptions,
  acceptKeys,
  hint,
  capabilities,
  ctaLabel,
  settingsOpen = false,
}) {
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [running, setRunning] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [selectedTarget, setSelectedTarget] = useState(target);
  const [previewDims, setPreviewDims] = useState(null);
  const urlsRef = useRef([]);

  useEffect(() => () => urlsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const accepted = acceptKeys || SOURCE_KEYS;
  const accept = acceptKeys ? acceptKeys.map((key) => FORMATS[key].accept).join(',') : IMAGE_ACCEPT;
  const requested = mode === 'resize' ? 'same' : allowTargetSelect ? selectedTarget : target;

  const update = (id, patch) =>
    setFiles((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const addFiles = async (list) => {
    const incoming = Array.from(list || []).filter((file) => file && file.size > 0);
    if (!incoming.length) return;
    const expected = accepted.map((key) => FORMATS[key].label).join(', ');
    const prepared = [];
    for (const file of incoming) {
      const detected = await sniffFormat(file);
      let error = null;
      if (!detectedMatches(detected, accepted)) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        const byExtension = accepted.find((key) => key === ext || (FORMATS[key].altExts || []).includes(ext));
        if (detected) {
          error = `This file contains ${FORMATS[detected].label} data, but this tool works with ${expected} files.`;
        } else if (!byExtension) {
          error = `Convertly could not recognise this file as one of ${expected}.`;
        }
      }
      prepared.push({
        id: uid(),
        file,
        name: file.name,
        size: file.size,
        detected,
        status: error ? 'error' : 'ready',
        stage: null,
        error,
        result: null,
      });
    }
    setFiles((prev) => [...prev, ...prepared]);
    const firstReady = prepared.find((item) => item.status === 'ready');
    if (firstReady && !previewDims) {
      probeSize(firstReady.file)
        .then(setPreviewDims)
        .catch(() => setPreviewDims(null));
    }
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((item) => item.id !== id));

  const clearAll = () => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];
    setFiles([]);
    setProgress({ done: 0, total: 0 });
    setPreviewDims(null);
  };

  const run = async () => {
    const usable = files.filter((item) => item.status !== 'error');
    if (!usable.length) return;
    setRunning(true);
    setProgress({ done: 0, total: usable.length });
    const usedNames = new Set();
    for (let index = 0; index < usable.length; index += 1) {
      const item = usable[index];
      update(item.id, { status: 'working', stage: 'Reading', error: null, result: null });
      try {
        const effectiveTarget = resolveTarget(requested, item.detected);
        const output = await convertFile(item.file, {
          target: effectiveTarget,
          settings,
          onStage: (stage) => update(item.id, { stage }),
        });
        const url = URL.createObjectURL(output.blob);
        urlsRef.current.push(url);
        update(item.id, {
          status: 'done',
          stage: null,
          result: {
            url,
            blob: output.blob,
            name: uniqueName(outputName(item.name, FORMATS[effectiveTarget].ext), usedNames),
            size: output.blob.size,
            width: output.width,
            height: output.height,
            format: effectiveTarget,
          },
        });
      } catch (error) {
        update(item.id, { status: 'error', stage: null, error: error.message || 'Conversion failed.' });
      }
      setProgress({ done: index + 1, total: usable.length });
    }
    setRunning(false);
  };

  const downloadAll = async () => {
    const done = files.filter((item) => item.result);
    if (!done.length) return;
    if (done.length === 1) {
      downloadBlob(done[0].result.blob, done[0].result.name);
      return;
    }
    setZipping(true);
    try {
      const zip = await createZip(done.map((item) => ({ name: item.result.name, blob: item.result.blob })));
      downloadBlob(zip, `convertly-${done.length}-files.zip`);
    } finally {
      setZipping(false);
    }
  };

  const readyCount = files.filter((item) => item.status !== 'error').length;
  const hasResults = files.some((item) => item.result);
  const activeTarget = mode === 'resize' ? null : allowTargetSelect ? selectedTarget : target;
  const targetLabel = activeTarget && FORMATS[activeTarget] ? FORMATS[activeTarget].label : 'the original format';
  const label =
    ctaLabel ||
    (mode === 'compress' ? 'Compress files' : mode === 'resize' ? 'Resize images' : `Convert to ${targetLabel}`);

  return (
    <div className="space-y-4">
      {allowTargetSelect && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:gap-4">
          <div className="sm:w-64">
            <Label htmlFor="output-format" className="text-sm font-medium">Convert to</Label>
            <Select value={selectedTarget} onValueChange={setSelectedTarget}>
              <SelectTrigger id="output-format" className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(targetOptions || TARGET_KEYS).map((key) => (
                  <SelectItem key={key} value={key}>
                    {FORMATS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground sm:pb-2">
            {FORMATS[selectedTarget].tagline} Nothing is uploaded — the file is decoded and re-encoded on this device.
          </p>
        </div>
      )}

      <UploadPanel onFiles={addFiles} accept={accept} hint={hint} disabled={running} />

      <FileQueue files={files} onRemove={removeFile} onClear={clearAll} running={running} />

      {!!files.length && (
        <AdvancedSettings
          settings={settings}
          onChange={setSettings}
          capabilities={capabilities || { resize: true, quality: true, background: false, maxSize: true }}
          targetLabel={targetLabel}
          previewDims={previewDims}
          openByDefault={settingsOpen}
        />
      )}

      {!!files.length && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-violet-600 text-white hover:bg-violet-700"
            onClick={run}
            disabled={running || !readyCount}
          >
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {running ? 'Working…' : label}
          </Button>
          {hasResults && !running && (
            <Button variant="ghost" className="rounded-full" onClick={clearAll}>
              <RotateCcw className="mr-2 h-4 w-4" /> Convert another file
            </Button>
          )}
          {running && progress.total > 0 && (
            <div className="flex min-w-[180px] flex-1 items-center gap-3">
              <Progress value={Math.round((progress.done / progress.total) * 100)} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {progress.done}/{progress.total}
              </span>
            </div>
          )}
        </div>
      )}

      <ResultList files={files} onDownload={(item) => downloadBlob(item.result.blob, item.result.name)} onDownloadAll={downloadAll} zipping={zipping} />
    </div>
  );
}