import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="Convertly home"
      className={`group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
        Convert<span className="text-violet-600 dark:text-violet-400">ly</span>
      </span>
    </Link>
  );
}