import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CopyButton from './CopyButton';

const UNITS = [
  { key: 'B', label: 'Bytes (B)', factor: 1 },
  { key: 'KB', label: 'Kilobytes (KB, 1000 B)', factor: 1000 },
  { key: 'KiB', label: 'Kibibytes (KiB, 1024 B)', factor: 1024 },
  { key: 'MB', label: 'Megabytes (MB)', factor: 1000 ** 2 },
  { key: 'MiB', label: 'Mebibytes (MiB)', factor: 1024 ** 2 },
  { key: 'GB', label: 'Gigabytes (GB)', factor: 1000 ** 3 },
  { key: 'GiB', label: 'Gibibytes (GiB)', factor: 1024 ** 3 },
  { key: 'TB', label: 'Terabytes (TB)', factor: 1000 ** 4 },
  { key: 'bit', label: 'Bits (b)', factor: 1 / 8 },
];

const format = (value) => {
  if (!Number.isFinite(value) || value === 0) return '0';
  if (value < 0.0001) return value.toExponential(4);
  return value.toLocaleString(undefined, { maximumFractionDigits: value < 1 ? 6 : value < 1000 ? 4 : 2 });
};

export default function FileSizeConverterTool() {
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('MB');

  const bytes = (Number(amount) || 0) * (UNITS.find((item) => item.key === unit)?.factor || 1);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Convert a file size</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="w-40">
            <label htmlFor="size-amount" className="text-xs text-muted-foreground">Amount</label>
            <Input
              id="size-amount"
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1"
            />
          </div>
          <div className="w-64">
            <label htmlFor="size-unit" className="text-xs text-muted-foreground">Unit</label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="size-unit" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {UNITS.map((item) => {
              const value = bytes / item.factor;
              return (
                <tr key={item.key}>
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-muted-foreground">{item.label}</th>
                  <td className="px-4 py-2.5 font-mono text-xs">{format(value)}</td>
                  <td className="w-24 px-4 py-2.5 text-right">
                    <CopyButton value={format(value)} label="Copy" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Note that a megabyte is 1,000,000 bytes while a mebibyte is 1,048,576 bytes. Drive manufacturers use the decimal
        version, which is why a “1 TB” drive shows as roughly 931 GiB in an operating system.
      </p>
    </div>
  );
}