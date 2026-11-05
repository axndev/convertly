import { CONVERSIONS, FORMAT_PAGES } from './conversions';
import { TOOLS } from './toolCatalog';

export const SEARCH_INDEX = [
  { path: '/', title: 'Convertly Home', kind: 'Page', keywords: 'home free converter convert anything' },
  { path: '/image-converter', title: 'Image Converter', kind: 'Converter', keywords: 'image converter any format convert' },
  { path: '/image-compressor', title: 'Image Compressor', kind: 'Compress', keywords: 'compress reduce shrink file size image' },
  { path: '/jpg-compressor', title: 'JPG Compressor', kind: 'Compress', keywords: 'jpg jpeg compress reduce size' },
  { path: '/webp-compressor', title: 'WebP Compressor', kind: 'Compress', keywords: 'webp compress reduce size' },
  { path: '/formats', title: 'Format Directory', kind: 'Page', keywords: 'formats directory list supported' },
  { path: '/tools', title: 'All Tools', kind: 'Page', keywords: 'tools utilities list all' },
  { path: '/about', title: 'About Convertly', kind: 'Page', keywords: 'about free privacy how it works' },
  ...FORMAT_PAGES.map((page) => ({
    path: `/${page.slug}`,
    title: page.h1,
    kind: 'Format',
    keywords: `${page.label} converter ${page.label.toLowerCase()} format`,
  })),
  ...CONVERSIONS.map((c) => ({
    path: `/${c.slug}`,
    title: `${c.sourceLabel} to ${c.targetLabel} Converter`,
    kind: 'Convert',
    keywords: `${c.sourceLabel} ${c.targetLabel} ${c.slug} convert`,
  })),
  ...TOOLS.map((tool) => ({ path: `/${tool.slug}`, title: tool.title, kind: 'Tool', keywords: tool.keywords })),
];

export function searchRoutes(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return SEARCH_INDEX.map((entry) => {
    const haystack = `${entry.title} ${entry.keywords} ${entry.path}`.toLowerCase();
    let score = 0;
    terms.forEach((term) => {
      if (haystack.includes(term)) score += 1;
    });
    if (entry.title.toLowerCase().includes(q)) score += 2;
    if (entry.path.slice(1).includes(q.replace(/\s+/g, '-'))) score += 1;
    return { entry, score };
  })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.entry);
}