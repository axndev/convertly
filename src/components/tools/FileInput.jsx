import React, { useRef, useState } from 'react';
import { FolderOpen, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileInput({ onFile, accept, label = 'Choose a file', hint, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');

  const handle = (files) => {
    const file = files && files[0];
    if (!file) return;
    setName(file.name);
    onFile(file);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handle(event.dataTransfer.files);
      }}
      className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30' : 'border-border bg-muted/30'
      }`}
    >
      <UploadCloud className="h-5 w-5 text-violet-600 dark:text-violet-400" />
      <Button
        type="button"
        variant="outline"
        className="mt-4 rounded-full"
        disabled={disabled}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <FolderOpen className="mr-2 h-4 w-4" /> {label}
      </Button>
      <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">{name || hint || 'Drag a file here, or choose one from your device.'}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          handle(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
}