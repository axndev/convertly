// Compact EXIF reader for JPEG files. Everything runs locally on the file bytes.
const TAGS = {
  0x010e: 'Image description',
  0x010f: 'Camera make',
  0x0110: 'Camera model',
  0x0112: 'Orientation',
  0x011a: 'X resolution',
  0x011b: 'Y resolution',
  0x0131: 'Software',
  0x0132: 'File changed',
  0x013b: 'Artist',
  0x829a: 'Exposure time',
  0x829d: 'F-number',
  0x8822: 'Exposure program',
  0x8827: 'ISO speed',
  0x9003: 'Date taken',
  0x9004: 'Date digitised',
  0x9201: 'Shutter speed',
  0x9202: 'Aperture',
  0x9207: 'Metering mode',
  0x9209: 'Flash',
  0x920a: 'Focal length',
  0xa002: 'Pixel width',
  0xa003: 'Pixel height',
  0xa405: 'Focal length (35 mm)',
  0xa433: 'Lens make',
  0xa434: 'Lens model',
  0xa430: 'Camera owner',
};

const ORIENTATION = {
  1: 'Normal',
  2: 'Mirrored horizontally',
  3: 'Rotated 180°',
  4: 'Mirrored vertically',
  5: 'Mirrored, rotated 90° clockwise',
  6: 'Rotated 90° clockwise',
  7: 'Mirrored, rotated 90° counter-clockwise',
  8: 'Rotated 90° counter-clockwise',
};

const typeSize = (type) => [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1;

function readValue(view, offset, type, count, little) {
  try {
    if (type === 2) {
      let out = '';
      for (let i = 0; i < count; i += 1) {
        const code = view.getUint8(offset + i);
        if (code === 0) break;
        out += String.fromCharCode(code);
      }
      return out.trim() || null;
    }
    if (type === 3) return view.getUint16(offset, little);
    if (type === 4) return view.getUint32(offset, little);
    if (type === 5 || type === 10) {
      const numerator = type === 5 ? view.getUint32(offset, little) : view.getInt32(offset, little);
      const denominator = type === 5 ? view.getUint32(offset + 4, little) : view.getInt32(offset + 4, little);
      if (!denominator) return null;
      if (denominator === 1) return `${numerator}`;
      if (numerator / denominator < 1) return `${numerator}/${denominator}`;
      return (numerator / denominator).toFixed(2);
    }
    if (type === 8) return view.getInt16(offset, little);
    if (type === 9) return view.getInt32(offset, little);
    return null;
  } catch {
    return null;
  }
}

function parseTiff(view, start) {
  const byteOrder = view.getUint16(start);
  if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return null;
  const little = byteOrder === 0x4949;
  if (view.getUint16(start + 2, little) !== 0x002a) return null;

  const out = {};
  const readIfd = (ifdOffset, depth = 0) => {
    if (depth > 2 || ifdOffset <= 0 || ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, little);
    for (let i = 0; i < entries; i += 1) {
      const entry = ifdOffset + 2 + i * 12;
      if (entry + 12 > view.byteLength) return;
      const tag = view.getUint16(entry, little);
      const type = view.getUint16(entry + 2, little);
      const count = view.getUint32(entry + 4, little);
      const size = typeSize(type) * count;
      const valueOffset = size > 4 ? start + view.getUint32(entry + 8, little) : entry + 8;
      if (tag === 0x8769) {
        readIfd(start + view.getUint32(entry + 8, little), depth + 1);
        continue;
      }
      const name = TAGS[tag];
      if (!name || out[name] !== undefined) continue;
      const value = readValue(view, valueOffset, type, count, little);
      if (value !== null && value !== undefined) out[name] = String(value);
    }
  };

  readIfd(start + view.getUint32(start + 4, little));
  if (out.Orientation && ORIENTATION[Number(out.Orientation)]) out.Orientation = ORIENTATION[Number(out.Orientation)];
  return Object.keys(out).length ? out : null;
}

const ascii = (view, start, length) => {
  let out = '';
  for (let i = 0; i < length; i += 1) out += String.fromCharCode(view.getUint8(start + i));
  return out;
};

export async function readExif(file) {
  try {
    const buffer = await file.slice(0, 512 * 1024).arrayBuffer();
    const view = new DataView(buffer);
    if (buffer.byteLength < 20 || view.getUint16(0) !== 0xffd8) return null;
    let offset = 2;
    while (offset + 4 < view.byteLength) {
      if (view.getUint8(offset) !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = view.getUint8(offset + 1);
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      if (marker === 0xda || marker === 0xd9) break;
      const size = view.getUint16(offset + 2);
      if (size < 2) break;
      if (marker === 0xe1 && ascii(view, offset + 4, 6) === 'Exif\u0000\u0000') {
        return parseTiff(view, offset + 10);
      }
      offset += 2 + size;
    }
    return null;
  } catch {
    return null;
  }
}