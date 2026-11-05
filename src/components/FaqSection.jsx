import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSection({ faqs, title = 'Frequently asked questions', headingLevel = 2 }) {
  if (!faqs || !faqs.length) return null;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section className="mt-14">
      <Heading className="font-heading text-2xl font-semibold tracking-tight">{title}</Heading>
      <Accordion type="single" collapsible className="mt-5 w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border">
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
    </section>
  );
}