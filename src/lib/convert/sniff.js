// Real content sniffing: we look at the bytes of a file rather than trusting
// the extension, so a mis-labelled upload is caught before it is converted.

const ascii = (bytes, start, end) => {
  let out = '';
  for (let i = start; i < end && i < bytes.length; i += 1) out += String.fromCharCode(bytes[i]);
  return out;
};

export async function sniffFormat(file) {
  let bytes;
  try {
    bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  } catch {
    return null;
  }
  if (bytes.length < 4) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg';
  if (bytes[0] === 0x89 && ascii(bytes, 1, 4) === 'PNG') return 'png';
  if (ascii(bytes, 0, 3) === 'GIF') return 'gif';
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'bmp';
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'webp';
  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) return 'ico';
  if (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00)
  ) {
    return 'tiff';
  }
  if (ascii(bytes, 4, 8) === 'ftyp') {
    const brand = ascii(bytes, 8, 12).toLowerCase();
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'avif';
    if (['heic', 'heix', 'heim', 'heis', 'hevc', 'hevx', 'mif1', 'msf1'].some((b) => brand.startsWith(b))) return 'heic';
    return null;
  }

  const head = ascii(bytes, 0, 32).trim().toLowerCase();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg';
  return null;
}

// A JFIF upload is JPEG data, so it satisfies both sources.
export function detectedMatches(detected, acceptedKeys) {
  if (!detected) return false;
  if (acceptedKeys.includes(detected)) return true;
  if (detected === 'jpg' && acceptedKeys.includes('jfif')) return true;
  if (detected === 'jfif' && acceptedKeys.includes('jpg')) return true;
  if (detected === 'heic' && acceptedKeys.includes('tiff')) return false;
  return false;
}