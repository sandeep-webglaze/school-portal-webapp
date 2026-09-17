/**
 * Reusable JSON-LD structured data component.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", ... }} />
 *
 * Renders a <script type="application/ld+json"> tag with the given object
 * stringified safely (escapes "</" so the closing tag of the parent script
 * cannot be smuggled inside the JSON payload).
 */

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
