import React, { useRef, useState } from 'react';
import { FolderOpen, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UploadPanel({ onFiles, accept, hint, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => {
    if (!disabled && inputRef.current) inputRef.current.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Add files"
      onClick={pick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          pick();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) onFiles(event.dataTransfer.files);
      }}
      className={`group flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        dragging ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30' : 'border-border bg-muted/30 hover:border-violet-400 hover:bg-muted/50'
      }`}
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm transition-transform duration-300 ${dragging ? 'scale-105' : 'group-hover:-translate-y-0.5'}`}>
        <UploadCloud className="h-6 w-6 text-violet-600 dark:text-violet-400" />
      </span>
      <p className="mt-5 font-heading text-lg font-semibold">{dragging ? 'Drop to add your files' : 'Drag & drop your files here'}</p>
      {hint && <p className="mt-1 max-w-md text-sm text-muted-foreground">{hint}</p>}
      <Button
        type="button"
        variant="outline"
        className="mt-5 rounded-full"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          pick();
        }}
      >
        <FolderOpen className="mr-2 h-4 w-4" /> Choose files
      </Button>
      <p className="mt-5 flex max-w-md items-center justify-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
        Your files are processed locally in your browser. They are not uploaded to our servers.
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
}