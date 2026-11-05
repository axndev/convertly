import { FORMATS, SOURCE_KEYS, TARGET_KEYS, isLossy, isOpaque } from './formats';

export const slugFor = (from, to) => `${from}-to-${to}`;

export function relatedSlugs(from, to) {
  const out = [];
  TARGET_KEYS.forEach((t) => {
    if (t !== from && t !== to) out.push(slugFor(from, t));
  });
  SOURCE_KEYS.forEach((s) => {
    if (s !== to && s !== from) out.push(slugFor(s, to));
  });
  return out.slice(0, 4);
}

function buildFaqs(from, to) {
  const F = FORMATS[from];
  const T = FORMATS[to];
  const lossy = isLossy(to);
  const faqs = [
    {
      q: `Is the ${F.label} to ${T.label} converter free?`,
      a: `Yes, completely. There is no account, no daily cap, no premium tier and no export fee. Every tool on Convertly works the same way and stays free.`,
    },
    {
      q: 'Are my files uploaded to a server?',
      a: `No. The conversion runs inside your browser using the same image engine your browser already has. Convertly never sends your ${F.label} files anywhere, and it works with your network connection switched off once the page has loaded.`,
    },
    {
      q: `Can I convert several ${F.label} files at once?`,
      a: `Yes. Add as many files as you like, choose your settings once, and convert them together. You can download each result individually or take everything as a single ZIP archive.`,
    },
    {
      q: `Will converting ${F.label} to ${T.label} reduce quality?`,
      a: lossy
        ? `${T.label} is a lossy format, so some detail is discarded when it is written. Use the quality slider to trade size against detail, or choose PNG if you need a lossless result.`
        : `${T.label} output here is lossless, so nothing is thrown away when the file is written. A larger file than your original is normal and does not mean quality was lost.`,
    },
    {
      q: `Does ${T.label} support transparency?`,
      a: T.output && T.output.transparency
        ? `Yes. ${T.label} keeps transparent areas, so cut-outs and logos stay clean.`
        : `No. ${T.label} has no alpha channel, so transparent areas are filled with the background colour you choose — white by default.`,
    },
    {
      q: `Can Convertly handle ${F.label} files of any size?`,
      a: `Convertly is limited by your device, not by a quota. Very large images use more memory while processing, so on a phone it is worth converting in smaller batches. There is no per-day limit either way.`,
    },
  ];
  if (to === 'ico') {
    faqs.splice(3, 0, {
      q: 'What sizes are inside the ICO file?',
      a: 'Convertly writes a genuine multi-size icon containing 16px, 32px, 48px and 256px versions, so it works as a favicon and as a Windows application icon.',
    });
  }
  if (T.decode === 'browser' || F.decode === 'browser') {
    faqs.push({
      q: `Why might a ${F.decode === 'browser' ? F.label : T.label} file fail?`,
      a: `Reading ${F.label} depends on the browser you are using. Safari on Apple devices can decode HEIC, for example, while Chrome cannot. When decoding is impossible Convertly says so clearly — it never uploads the file as a fallback.`,
    });
  }
  return faqs;
}

function buildParagraphs(from, to) {
  const F = FORMATS[from];
  const T = FORMATS[to];
  const lossy = isLossy(to);
  const out = [
    `${F.tagline} ${T.tagline}`,
    `Convertly decodes each ${F.label} file in your browser, applies the settings you choose, then writes a real ${T.label} file${to === 'ico' ? ' containing several icon sizes' : ''}. ${
      lossy
        ? `Compression is yours to control: move the quality slider to trade detail against file size, and set a maximum size if you need one.`
        : `${T.label} encoding is lossless, so the result is a faithful copy of the pixels you started with.`
    }`,
  ];
  if (isOpaque(to) && F.output && F.output.transparency) {
    out.push(`${F.label} can hold transparency and ${T.label} cannot, so transparent areas are filled with your chosen background colour before encoding.`);
  } else if (isOpaque(to)) {
    out.push(`${T.label} has no alpha channel, so Convertly paints a background colour underneath your image before writing the file.`);
  } else if (T.output && T.output.transparency) {
    out.push(`${T.label} keeps transparency, so images with cut-out areas stay clean without any background colour being added.`);
  }
  out.push(
    `Nothing about this converter is rate limited. Convert one file or two hundred — the work happens on your device, so there is no queue and no account to create.`
  );
  return out;
}

function buildSteps(from, to) {
  const F = FORMATS[from];
  const T = FORMATS[to];
  return [
    `Add your ${F.label} files by dragging them onto the panel or using “Choose files”.`,
    `Open “Advanced settings” to set an output size, quality level or background colour if you need one.`,
    `Press “Convert to ${T.label}”. Each file is decoded, rendered and re-encoded locally while you watch.`,
    `Download files one by one, or press “Download all” to receive every ${T.label} result in a single ZIP archive.`,
  ];
}

function buildConversion(from, to) {
  const F = FORMATS[from];
  const T = FORMATS[to];
  const lossy = isLossy(to);
  return {
    slug: slugFor(from, to),
    from,
    to,
    sourceLabel: F.label,
    targetLabel: T.label,
    metaTitle: `${F.label} to ${T.label} Converter — Free & Private | Convertly`,
    metaDescription: `Convert ${F.label} to ${T.label} free in your browser. Batch conversion, resizing${lossy ? ' and quality control' : ''}, no uploads, no sign-up, no limits.`,
    h1: `${F.label} to ${T.label} Converter`,
    intro: `Convert ${F.label} files to ${T.label} format for free, directly in your browser. Your files never leave your device.`,
    paragraphs: buildParagraphs(from, to),
    howTo: buildSteps(from, to),
    faqs: buildFaqs(from, to),
    related: relatedSlugs(from, to),
    decodeNote:
      F.decode === 'browser'
        ? `Decoding ${F.label} depends on your browser. If it cannot read the file, Convertly tells you immediately — nothing is uploaded as a workaround.`
        : null,
    settings: {
      resize: true,
      quality: lossy,
      background: isOpaque(to),
      maxSize: lossy,
    },
  };
}

export const CONVERSIONS = (() => {
  const list = [];
  SOURCE_KEYS.forEach((from) => {
    TARGET_KEYS.forEach((to) => {
      if (from === to) return;
      list.push(buildConversion(from, to));
    });
  });
  return list;
})();

export const CONVERSION_BY_SLUG = CONVERSIONS.reduce((acc, c) => {
  acc[c.slug] = c;
  return acc;
}, {});

export const conversionsTo = (target) => CONVERSIONS.filter((c) => c.to === target);
export const conversionsFrom = (source) => CONVERSIONS.filter((c) => c.from === source);

// Landing page for each format: /jpg-converter, /heic-converter ...
export const FORMAT_PAGES = Object.keys(FORMATS).map((key) => {
  const F = FORMATS[key];
  const inbound = conversionsTo(key);
  const outbound = conversionsFrom(key);
  const targets = TARGET_KEYS.filter((t) => t !== key);
  return {
    slug: `${key}-converter`,
    key,
    label: F.label,
    metaTitle: `${F.label} Converter — Convert ${F.label} Files Free | Convertly`,
    metaDescription: `Convert ${F.label} files in your browser, free and private. ${
      outbound.length ? `Turn ${F.label} into ${targets.map((t) => FORMATS[t].label).join(', ')}.` : `Convert other formats into ${F.label}.`
    } No uploads, no sign-up, no limits.`,
    h1: `${F.label} Converter`,
    intro: F.blurb,
    faqs: [
      {
        q: `What can I convert ${F.label} to?`,
        a: outbound.length
          ? `You can convert ${F.label} to ${outbound.map((c) => c.targetLabel).join(', ')}. Every one of those conversions runs in your browser.`
          : `${F.label} is used as a target on Convertly: ${inbound.map((c) => c.sourceLabel).join(', ')} files can be converted into ${F.label}.`,
      },
      {
        q: `Is the ${F.label} converter free?`,
        a: 'Yes. No account, no daily limit, no paid tier and nothing to install.',
      },
      {
        q: 'Do you keep my files?',
        a: 'There is nothing to keep — your files are read and written entirely inside your browser.',
      },
    ],
    inbound,
    outbound,
  };
});

export const FORMAT_PAGE_BY_SLUG = FORMAT_PAGES.reduce((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {});