import React, { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]*/g) || []).filter((part) => part.trim()).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((part) => part.trim()).length : 0;
    const minutes = words / 200;
    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      sentences,
      paragraphs,
      lines: text ? text.split('\n').length : 0,
      readingTime: words === 0 ? '0 sec' : minutes < 1 ? `${Math.max(1, Math.round(minutes * 60))} sec` : `${Math.round(minutes)} min`,
    };
  }, [text]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-heading text-2xl font-semibold tabular-nums">{card.value.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="wc-input" className="text-sm font-medium">Your text</label>
        <Textarea
          id="wc-input"
          rows={14}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text — the counts update as you go…"
          className="mt-2"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Estimated reading time: <span className="font-medium text-foreground">{stats.readingTime}</span> (based on 200
          words per minute). Nothing you type leaves the page.
        </p>
      </div>
    </div>
  );
}