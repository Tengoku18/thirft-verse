interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

// Renders schema.org structured data as JSON-LD.
// Escapes `<` to prevent breaking out of the script tag if any user-controlled
// string contains "</script>" or similar.
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
