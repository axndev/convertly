export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  if (!bytes || bytes < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

export function baseName(filename) {
  return filename.replace(/\.[^./\\]+$/, '') || 'converted';
}

export function outputName(filename, ext) {
  return `${baseName(filename)}.${ext}`;
}

export function uniqueName(name, used) {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let n = 2;
  while (used.has(`${stem}-${n}${ext}`)) n += 1;
  const result = `${stem}-${n}${ext}`;
  used.add(result);
  return result;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function sizeChange(original, output) {
  if (!original || !output) return null;
  const pct = Math.round(((output - original) / original) * 100);
  return { pct, smaller: output < original };
}