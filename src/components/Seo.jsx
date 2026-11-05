import { useEffect } from 'react';

function upsertMeta(attribute, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

export default function Seo({ title, description, path }) {
    useEffect(() => {
        if (title) document.title = title;
        const url = `${window.location.origin}${path || window.location.pathname}`;
        if (description) upsertMeta('name', 'description', description);
        upsertMeta('property', 'og:title', title);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:type', 'website');
        upsertMeta('property', 'og:url', url);
        upsertMeta('name', 'twitter:card', 'summary_large_image');

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);
    }, [title, description, path]);

    return null;
}