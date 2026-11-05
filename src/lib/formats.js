// Single source of truth for every file format Convertly understands.
// `decode`  = can the browser read it (yes | browser-dependent)
// `output`  = can Convertly write it (null when it cannot)

export const FORMATS = {
  jpg: {
    key: 'jpg',
    label: 'JPG',
    ext: 'jpg',
    altExts: ['jpeg', 'jpe'],
    mime: 'image/jpeg',
    accept: '.jpg,.jpeg,.jpe,image/jpeg',
    family: 'image',
    decode: 'yes',
    output: { mime: 'image/jpeg', lossy: true, transparency: false },
    tagline: 'The most compatible photo format on the web.',
    blurb:
      'JPG (also written JPEG) is the most widely supported photo format on the web. It uses lossy compression, so photographs get very small while still looking sharp.',
    facts: [
      'JPG is lossy: every save discards a little detail, which is why re-saving repeatedly is best avoided.',
      'JPG has no alpha channel, so transparency is flattened onto a solid colour.',
      'Every camera, phone and browser can open JPG, which makes it the safest format to share.',
    ],
  },
  png: {
    key: 'png',
    label: 'PNG',
    ext: 'png',
    altExts: [],
    mime: 'image/png',
    accept: '.png,image/png',
    family: 'image',
    decode: 'yes',
    output: { mime: 'image/png', lossy: false, transparency: true },
    tagline: 'Lossless quality with full transparency.',
    blurb:
      'PNG is a lossless format built for sharp edges, screenshots, logos and graphics. It keeps full transparency and never degrades when saved.',
    facts: [
      'PNG is lossless — saving it repeatedly never loses quality.',
      'PNG keeps soft alpha transparency, so it is ideal for logos and cut-outs.',
      'Screenshots, diagrams and line art almost always look best as PNG.',
    ],
  },
  webp: {
    key: 'webp',
    label: 'WebP',
    ext: 'webp',
    altExts: [],
    mime: 'image/webp',
    accept: '.webp,image/webp',
    family: 'image',
    decode: 'yes',
    output: { mime: 'image/webp', lossy: true, transparency: true },
    tagline: 'Smaller files than JPG, with transparency.',
    blurb:
      'WebP is a modern format that produces noticeably smaller files than JPG or PNG at similar quality, and it supports transparency too.',
    facts: [
      'WebP files are often 25–35% smaller than an equivalent JPG.',
      'WebP has both lossy and lossless modes, plus an alpha channel.',
      'Every current browser can display WebP, including mobile Safari.',
    ],
  },
  gif: {
    key: 'gif',
    label: 'GIF',
    ext: 'gif',
    altExts: [],
    mime: 'image/gif',
    accept: '.gif,image/gif',
    family: 'image',
    decode: 'yes',
    output: null,
    tagline: 'The classic 256-colour animated format.',
    blurb:
      'GIF is an older format limited to 256 colours per frame, but it is still everywhere because of simple animation.',
    facts: [
      'GIF supports only 256 colours per frame, so photographs band badly.',
      'Convertly reads the first frame when turning an animated GIF into a still image.',
      'GIF transparency is on or off — there are no soft edges.',
    ],
  },
  bmp: {
    key: 'bmp',
    label: 'BMP',
    ext: 'bmp',
    altExts: [],
    mime: 'image/bmp',
    accept: '.bmp,image/bmp',
    family: 'image',
    decode: 'yes',
    output: { mime: 'image/bmp', lossy: false, transparency: false },
    tagline: 'Uncompressed and simple.',
    blurb:
      'BMP is the uncompressed bitmap format from Windows. Files are large, but the pixels are stored exactly as they are.',
    facts: [
      'BMP stores pixels uncompressed, so files are typically 5–10× larger than JPG.',
      'BMP technically supports transparency, but most readers ignore it.',
      'It is useful for archives and older software, not for the web.',
    ],
  },
  svg: {
    key: 'svg',
    label: 'SVG',
    ext: 'svg',
    altExts: [],
    mime: 'image/svg+xml',
    accept: '.svg,image/svg+xml',
    family: 'image',
    decode: 'yes',
    output: null,
    tagline: 'Vector graphics that stay sharp at any size.',
    blurb:
      'SVG describes artwork with XML instead of pixels, so it stays perfectly sharp no matter how far you scale it.',
    facts: [
      'SVG is resolution independent — enlarging it never blurs the edges.',
      'Converting SVG to a pixel format rasterises it at the width you choose.',
      'Fonts used inside an SVG must be available to render exactly as designed.',
    ],
  },
  jfif: {
    key: 'jfif',
    label: 'JFIF',
    ext: 'jfif',
    altExts: [],
    mime: 'image/jpeg',
    accept: '.jfif,image/jpeg',
    family: 'image',
    decode: 'yes',
    output: null,
    tagline: 'JPEG data in a less common wrapper.',
    blurb:
      'JFIF is the standard container for JPEG image data, saved with the .jfif extension. The pixels are ordinary JPEG — only the wrapping differs.',
    facts: [
      'JFIF and JPG hold exactly the same JPEG image data.',
      'Some older Windows software saved JPEGs with a .jfif extension.',
      'Converting JFIF to JPG re-saves the same pixels in the format every app recognises.',
    ],
  },
  avif: {
    key: 'avif',
    label: 'AVIF',
    ext: 'avif',
    altExts: [],
    mime: 'image/avif',
    accept: '.avif,image/avif',
    family: 'image',
    decode: 'browser',
    output: null,
    tagline: 'Next-generation compression.',
    blurb:
      'AVIF is built on the AV1 video codec. It compresses far better than JPG, but browser support for reading and writing it is still uneven.',
    facts: [
      'AVIF can be around 50% smaller than JPG at matched quality.',
      'AVIF supports transparency and wide colour.',
      'Chrome, Firefox, Edge and Safari can decode AVIF; browsers cannot encode it yet, so Convertly does not offer AVIF as an output.',
    ],
  },
  tiff: {
    key: 'tiff',
    label: 'TIFF',
    ext: 'tiff',
    altExts: ['tif'],
    mime: 'image/tiff',
    accept: '.tiff,.tif,image/tiff',
    family: 'image',
    decode: 'browser',
    output: null,
    tagline: 'Print and scan quality.',
    blurb:
      'TIFF is a flexible, usually lossless format used in printing and scanning. Browsers cannot decode it natively, so it needs care in a web tool.',
    facts: [
      'TIFF files are usually lossless and can be very large.',
      'Browser support for decoding TIFF is effectively absent, so Convertly reports clearly when it cannot read a file instead of uploading it.',
      'For web use, converting TIFF to PNG or JPG is the practical choice.',
    ],
  },
  heic: {
    key: 'heic',
    label: 'HEIC',
    ext: 'heic',
    altExts: ['heif'],
    mime: 'image/heic',
    accept: '.heic,.heif,image/heic,image/heif',
    family: 'image',
    decode: 'browser',
    output: null,
    tagline: 'The iPhone photo format.',
    blurb:
      'HEIC is the HEIF-based format Apple uses for photos on iPhone and iPad. It saves space, but most browsers cannot decode it.',
    facts: [
      'HEIC photos are roughly half the size of the same shot as JPG.',
      'Safari on Apple platforms can decode HEIC; Chrome, Firefox and Edge generally cannot.',
      'Convertly detects this and says so plainly — your file is never uploaded anywhere.',
    ],
  },
  ico: {
    key: 'ico',
    label: 'ICO',
    ext: 'ico',
    altExts: ['cur'],
    mime: 'image/x-icon',
    accept: '.ico,image/x-icon',
    family: 'image',
    decode: 'yes',
    output: { mime: 'image/x-icon', lossy: false, transparency: true, multiSize: true },
    tagline: 'Multi-size icons and favicons.',
    blurb:
      'ICO is the icon container used by Windows and by website favicons. A single file can hold several sizes of the same artwork.',
    facts: [
      'One ICO can contain 16px, 32px, 48px and 256px versions of the same image.',
      'Convertly writes genuine multi-size ICO files you can use as a favicon.',
      'Modern ICO files embed PNG data for each size, which every current browser reads.',
    ],
  },
};

// Formats offered as a conversion target on their own routes.
export const TARGET_KEYS = ['jpg', 'png', 'webp', 'ico', 'bmp'];
// Formats offered as a conversion source on their own routes.
export const SOURCE_KEYS = ['jpg', 'jfif', 'png', 'webp', 'gif', 'bmp', 'svg', 'avif', 'tiff', 'heic', 'ico'];
// Formats Convertly can actually encode in the browser.
export const ENCODABLE = ['jpg', 'png', 'webp', 'bmp', 'ico'];
export const OPAQUE_TARGETS = ['jpg', 'bmp'];
export const LOSSY_TARGETS = ['jpg', 'webp'];

export const isLossy = (key) => LOSSY_TARGETS.includes(key);
export const isOpaque = (key) => OPAQUE_TARGETS.includes(key);
export const canEncode = (key) => ENCODABLE.includes(key);
export const formatLabel = (key) => (FORMATS[key] ? FORMATS[key].label : String(key).toUpperCase());

export const IMAGE_ACCEPT = Object.values(FORMATS)
  .map((f) => f.accept)
  .join(',');