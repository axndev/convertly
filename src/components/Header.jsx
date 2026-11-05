import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from './Logo';
import MegaPanel from './MegaPanel';
import { FORMATS, SOURCE_KEYS, TARGET_KEYS } from '@/lib/formats';
import { FORMAT_PAGES } from '@/lib/conversions';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/toolCatalog';
import { searchRoutes } from '@/lib/searchIndex';

const targetLinks = (target) =>
  SOURCE_KEYS.filter((key) => key !== target).map((key) => ({
    label: `${FORMATS[key].label} to ${FORMATS[target].label}`,
    to: `/${key}-to-${target}`,
  }));

const CONVERT_COLUMNS = [
  {
    title: 'Start here',
    links: [
      { label: 'Image Converter (any format)', to: '/image-converter' },
      { label: 'JPG Converter', to: '/jpg-converter' },
      { label: 'PNG Converter', to: '/png-converter' },
      { label: 'WebP Converter', to: '/webp-converter' },
      { label: 'HEIC Converter (iPhone photos)', to: '/heic-converter' },
      { label: 'SVG Converter', to: '/svg-converter' },
      { label: 'Image Resizer', to: '/image-resizer' },
    ],
  },
  { title: 'Convert to JPG', links: targetLinks('jpg') },
  { title: 'Convert to PNG', links: targetLinks('png') },
  { title: 'Convert to WebP', links: targetLinks('webp') },
];

const COMPRESS_COLUMNS = [
  {
    title: 'Compressors',
    links: [
      { label: 'Image Compressor', to: '/image-compressor' },
      { label: 'JPG Compressor', to: '/jpg-compressor' },
      { label: 'WebP Compressor', to: '/webp-compressor' },
    ],
  },
  {
    title: 'Make files smaller another way',
    links: [
      { label: 'JPG to WebP', to: '/jpg-to-webp' },
      { label: 'PNG to WebP', to: '/png-to-webp' },
      { label: 'HEIC to JPG', to: '/heic-to-jpg' },
      { label: 'Image Resizer', to: '/image-resizer' },
      { label: 'Metadata Remover', to: '/metadata-remover' },
    ],
  },
];

const TOOL_COLUMNS = [
  ...TOOL_CATEGORIES.map((category) => ({
    title: category.label,
    links: TOOLS.filter((tool) => tool.category === category.key).map((tool) => ({ label: tool.title, to: `/${tool.slug}` })),
  })),
  { title: 'Browse', links: [{ label: 'All tools', to: '/tools' }, { label: 'Format directory', to: '/formats' }, { label: 'About Convertly', to: '/about' }] },
];

const MENUS = { convert: CONVERT_COLUMNS, compress: COMPRESS_COLUMNS, tools: TOOL_COLUMNS };

export default function Header() {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem('convertly-theme');
    } catch {
      stored = null;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored ? stored === 'dark' : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
    setResultsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(null);
        setResultsOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(null);
        setResultsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const results = useMemo(() => searchRoutes(query, 8), [query]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('convertly-theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable — the toggle still works for this session */
    }
  };

  const go = (path) => {
    setResultsOpen(false);
    setMobileOpen(false);
    setOpen(null);
    navigate(path);
  };

  const navButton = (label, key) => (
    <button
      key={key}
      type="button"
      onMouseEnter={() => setOpen(key)}
      onClick={() => setOpen(open === key ? null : key)}
      aria-expanded={open === key}
      className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${open === key ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
        }`}
    >
      {label}
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open === key ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {navButton('Convert', 'convert')}
          {navButton('Compress', 'compress')}
          {navButton('Tools', 'tools')}
          <Link
            to="/formats"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Format Directory
          </Link>
          <Link
            to="/about"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && results.length) go(results[0].path);
              }}
              placeholder="Search converters and tools"
              aria-label="Search converters and tools"
              className="w-56 rounded-full pl-9 lg:w-64"
            />
            {resultsOpen && query.trim() && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
                {results.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">Nothing matched “{query}”.</p>}
                {results.map((result) => (
                  <Link
                    key={result.path}
                    to={result.path}
                    onClick={() => setResultsOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <span className="truncate">{result.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{result.kind}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="relative hidden lg:block">
        {open && MENUS[open] && (
          <MegaPanel
            columns={MENUS[open]}
            onNavigate={() => setOpen(null)}
            footer={
              open === 'compress'
                ? 'Compression here means re-encoding to a lossy format. Some lossless outputs are larger than the original — Convertly always shows both sizes.'
                : undefined
            }
          />
        )}
      </div>

      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-border bg-card px-4 pb-8 pt-4 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search converters and tools"
              aria-label="Search converters and tools"
              className="rounded-full pl-9"
            />
          </div>
          {query.trim() && (
            <div className="mt-3 space-y-1">
              {results.map((result) => (
                <Link key={result.path} to={result.path} onClick={() => setMobileOpen(false)} className="block rounded-xl bg-muted/60 px-3 py-2 text-sm">
                  {result.title}
                </Link>
              ))}
              {results.length === 0 && <p className="px-3 text-sm text-muted-foreground">Nothing matched “{query}”.</p>}
            </div>
          )}

          <div className="mt-6 space-y-6">
            {[
              { title: 'Convert', columns: CONVERT_COLUMNS },
              { title: 'Compress', columns: COMPRESS_COLUMNS },
              { title: 'Tools', columns: TOOL_COLUMNS },
            ].map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</p>
                <div className="mt-2 grid gap-1 sm:grid-cols-2">
                  {group.columns.flatMap((column) => column.links).map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-accent">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Converters by format</p>
              <div className="mt-2 grid gap-1 sm:grid-cols-2">
                {FORMAT_PAGES.map((page) => (
                  <Link key={page.slug} to={`/${page.slug}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-accent">
                    {page.label} converter
                  </Link>
                ))}
                <Link to="/formats" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-violet-600">
                  Format directory
                </Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/85">
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { TARGET_KEYS };