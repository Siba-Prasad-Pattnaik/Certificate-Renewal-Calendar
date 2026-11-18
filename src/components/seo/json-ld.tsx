import { type ReactNode } from 'react';

interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data as a script tag with proper escaping
 * to prevent XSS through script breakout.
 */
export function JsonLd({ data }: JsonLdProps): ReactNode {
  const jsonString = JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c') // Escape < to prevent script injection
    .replace(/>/g, '\\u003e'); // Escape > for completeness

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}