import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const LIMIT = 800;

function diffLines(a, b) {
  const n = a.length;
  const m = b.length;
  const table = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const rows = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'same', text: a[i] });
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      rows.push({ type: 'del', text: a[i] });
      i += 1;
    } else {
      rows.push({ type: 'add', text: b[j] });
      j += 1;
    }
  }
  while (i < n) rows.push({ type: 'del', text: a[i++] });
  while (j < m) rows.push({ type: 'add', text: b[j++] });
  return rows;
}

export default function TextDiffTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [rows, setRows] = useState(null);
  const [note, setNote] = useState(null);

  const compare = () => {
    const a = left.split('\n').slice(0, LIMIT);
    const b = right.split('\n').slice(0, LIMIT);
    setRows(diffLines(a, b));
    const truncated = left.split('\n').length > LIMIT || right.split('\n').length > LIMIT;
    setNote(truncated ? `Only the first ${LIMIT} lines of each side were compared, to keep the browser responsive.` : null);
  };

  const added = rows ? rows.filter((row) => row.type === 'add').length : 0;
  const removed = rows ? rows.filter((row) => row.type === 'del').length : 0;
  const changed = rows ? rows.filter((row) => row.type !== 'same').length : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <label htmlFor="diff-left" className="text-sm font-medium">Original</label>
          <Textarea id="diff-left" rows={10} value={left} onChange={(event) => setLeft(event.target.value)} className="mt-2 font-mono text-xs" placeholder="Paste the first version here…" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <label htmlFor="diff-right" className="text-sm font-medium">Changed</label>
          <Textarea id="diff-right" rows={10} value={right} onChange={(event) => setRight(event.target.value)} className="mt-2 font-mono text-xs" placeholder="Paste the second version here…" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={compare} disabled={!left && !right}>
          <GitCompare className="mr-2 h-4 w-4" /> Compare
        </Button>
        {rows && (
          <p className="text-xs text-muted-foreground">
            {changed} changed {changed === 1 ? 'line' : 'lines'} · {added} added · {removed} removed
          </p>
        )}
      </div>

      {note && <p className="text-xs text-amber-700 dark:text-amber-400">{note}</p>}

      {rows && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {changed === 0 ? (
            <p className="px-4 py-4 text-sm text-muted-foreground">The two versions are identical, line for line.</p>
          ) : (
            <ol className="max-h-[520px] overflow-y-auto font-mono text-xs">
              {rows.map((row, index) => (
                <li
                  key={`${index}-${row.type}`}
                  className={`flex gap-3 whitespace-pre-wrap break-all px-3 py-1 ${
                    row.type === 'add'
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : row.type === 'del'
                        ? 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
                        : 'text-muted-foreground'
                  }`}
                >
                  <span className="w-3 shrink-0 select-none">{row.type === 'add' ? '+' : row.type === 'del' ? '−' : ''}</span>
                  <span className="flex-1">{row.text || ' '}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}