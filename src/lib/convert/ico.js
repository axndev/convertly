// Builds a real multi-size ICO container. Each entry holds PNG data, which is
// what every current browser and Windows version reads.
const DEFAULT_SIZES = [16, 32, 48, 256];

export async function encodeICO(canvas, sizes = DEFAULT_SIZES) {
  const entries = [];
  for (const size of sizes) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const scale = Math.min(size / canvas.width, size / canvas.height);
    const drawWidth = canvas.width * scale;
    const drawHeight = canvas.height * scale;
    ctx.drawImage(canvas, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);
    const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'));
    if (!blob) continue;
    entries.push({ size, bytes: new Uint8Array(await blob.arrayBuffer()) });
  }
  if (!entries.length) throw new Error('ICO could not be created in this browser.');

  const headerSize = 6 + entries.length * 16;
  const total = headerSize + entries.reduce((sum, e) => sum + e.bytes.length, 0);
  const buffer = new ArrayBuffer(total);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, entries.length, true);

  let offset = headerSize;
  entries.forEach((entry, index) => {
    const o = 6 + index * 16;
    const dim = entry.size >= 256 ? 0 : entry.size;
    view.setUint8(o, dim);
    view.setUint8(o + 1, dim);
    view.setUint8(o + 2, 0);
    view.setUint8(o + 3, 0);
    view.setUint16(o + 4, 1, true);
    view.setUint16(o + 6, 32, true);
    view.setUint32(o + 8, entry.bytes.length, true);
    view.setUint32(o + 12, offset, true);
    offset += entry.bytes.length;
  });

  let pos = headerSize;
  entries.forEach((entry) => {
    bytes.set(entry.bytes, pos);
    pos += entry.bytes.length;
  });

  return new Blob([buffer], { type: 'image/x-icon' });
}

// Renders an image to a square canvas, optionally padding transparent space.
export function squareCanvas(source, width, height, size, background) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }
  const scale = Math.min(size / width, size / height);
  const w = width * scale;
  const h = height * scale;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, (size - w) / 2, (size - h) / 2, w, h);
  return canvas;
}