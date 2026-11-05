import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { FORMATS, TARGET_KEYS } from '@/lib/formats';
import { TOOLS } from '@/lib/toolCatalog';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Convert Anything. Completely Free. Every conversion runs inside your browser — nothing is uploaded, and
            there is nothing to sign up for.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Convert to</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {TARGET_KEYS.map((key) => (
              <li key={key}>
                <Link to={`/${key}-converter`} className="text-foreground/80 transition-colors hover:text-violet-600">
                  {FORMATS[key].label} converter
                </Link>
              </li>
            ))}
            <li>
              <Link to="/image-converter" className="text-foreground/80 transition-colors hover:text-violet-600">
                Image converter
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {TOOLS.slice(0, 6).map((tool) => (
              <li key={tool.slug}>
                <Link to={`/${tool.slug}`} className="text-foreground/80 transition-colors hover:text-violet-600">
                  {tool.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/tools" className="font-medium text-violet-600 transition-colors hover:text-violet-700">
                All tools
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Convertly</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link to="/formats" className="text-foreground/80 transition-colors hover:text-violet-600">
                Format directory
              </Link>
            </li>
            <li>
              <Link to="/image-compressor" className="text-foreground/80 transition-colors hover:text-violet-600">
                Image compressor
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-foreground/80 transition-colors hover:text-violet-600">
                About & privacy
              </Link>
            </li>
          </ul>
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
            Your files never leave your device. No accounts, no limits, no upsells.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} Convertly. Free file tools that respect your privacy.</p>
          <p>Made for browsers, not for servers.</p>
        </div>
      </div>
    </footer>
  );
}