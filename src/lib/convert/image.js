import { FORMATS, canEncode } from '../formats';
import { encodeBMP } from './bmp';
import { encodeICO } from './ico';

export const OUT_MIME = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
};

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const isSvg = (file) => /svg/i.test(file.type) || /\.svg$/i.test(file.name);

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode-failed'));
    img.src = url;
  });
}

function readSvgSize(text) {
  const viewBox = text.match(/viewBox\s*=\s*["']\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (viewBox) {
    const w = Number(viewBox[3]);
    const h = Number(viewBox[4]);
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  const width = text.match(/\bwidth\s*=\s*["']([\d.]+)/i);
  const height = text.match(/\bheight\s*=\s*["']([\d.]+)/i);
  if (width && height) return { width: Number(width[1]), height: Number(height[1]) };
  return null;
}

// Returns { source, width, height, release } where source can be drawn with
// ctx.drawImage directly (ImageBitmap or HTMLImageElement).
export async function decodeImage(file) {
  if (isSvg(file)) {
    const text = await file.text();
    const size = readSvgSize(text) || { width: 1024, height: 1024 };
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImageElement(url);
      return { source: img, width: size.width, height: size.height, release: () => URL.revokeObjectURL(url) };
    } catch {
      URL.revokeObjectURL(url);
      throw new Error('This SVG could not be rendered by your browser.');
    }
  }

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close && bitmap.close() };
    } catch {
      /* fall through to the <img> path */
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (!width || !height) throw new Error('no-dimensions');
    return { source: img, width, height, release: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    const label = FORMATS[Object.keys(FORMATS).find((k) => FORMATS[k].mime === file.type)]?.label || 'this';
    throw new Error(
      `Your browser could not decode this ${label} file. Convertly never uploads files as a workaround, so this image cannot be converted here.`
    );
  }
}

export function computeOutputSize({ width, height }, resize) {
  const mode = (resize && resize.mode) || 'original';
  let w = width;
  let h = height;
  if (mode === 'width' && num(resize.width)) {
    w = num(resize.width);
    h = (height / width) * w;
  } else if (mode === 'height' && num(resize.height)) {
    h = num(resize.height);
    w = (width / height) * h;
  } else if (mode === 'percent') {
    const scale = (num(resize.percent) || 100) / 100;
    w = width * scale;
    h = height * scale;
  } else if (mode === 'both') {
    const tw = num(resize.width) || width;
    const th = num(resize.height) || height;
    if (resize.maintainAspect === false) {
      w = tw;
      h = th;
    } else {
      const scale = Math.min(tw / width, th / height);
      w = width * scale;
      h = height * scale;
    }
  }
  return { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(h)) };
}

export function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

const toBlob = (canvas, mime, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });

export async function encodeCanvas(canvas, target, settings = {}) {
  if (target === 'bmp') return encodeBMP(canvas);
  if (target === 'ico') return encodeICO(canvas);

  const mime = OUT_MIME[target];
  if (!mime) throw new Error(`${target.toUpperCase()} output is not supported in the browser.`);
  const lossy = target === 'jpg' || target === 'webp';
  let quality = lossy ? Math.min(1, Math.max(0.05, (Number(settings.quality) || 90) / 100)) : undefined;
  let blob = await toBlob(canvas, mime, quality);
  if (!blob) throw new Error(`${target.toUpperCase()} encoding is not supported by this browser.`);

  const maxBytes = num(settings.maxSizeKB) * 1024;
  if (maxBytes && lossy && blob.size > maxBytes) {
    let best = blob;
    let q = quality;
    for (let i = 0; i < 7 && q > 0.12 && best.size > maxBytes; i += 1) {
      q = Math.max(0.1, q - 0.13);
      const next = await toBlob(canvas, mime, q);
      if (!next || next.size >= best.size) break;
      best = next;
    }
    blob = best;
  }
  return blob;
}

// Resolves the format a file should be written as. `requested` may be a format
// key or 'same' (keep the source format where the browser can write it).
export function resolveTarget(requested, detected) {
  if (requested && requested !== 'same') return requested;
  if (detected && canEncode(detected)) return detected;
  return 'png';
}

export async function convertFile(file, { target, settings = {}, onStage }) {
  onStage && onStage('Reading');
  const decoded = await decodeImage(file);
  try {
    const size = computeOutputSize({ width: decoded.width, height: decoded.height }, settings.resize);
    onStage && onStage('Rendering');
    const canvas = makeCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');
    if (target === 'jpg' || target === 'bmp' || target === 'ico') {
      ctx.fillStyle = settings.background || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

    onStage && onStage('Encoding');
    const blob = await encodeCanvas(canvas, target, settings);
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    decoded.release && decoded.release();
  }
}

// Fast dimension probe for the "expected output size" preview.
export async function probeSize(file) {
  const decoded = await decodeImage(file);
  const result = { width: decoded.width, height: decoded.height };
  decoded.release && decoded.release();
  return result;
}