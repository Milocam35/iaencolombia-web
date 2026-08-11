import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/layout/PublicPage";
import { COMMUNICATIONS, formatCommunicationDate } from "@/data/communications";

export function generateStaticParams() {
  return COMMUNICATIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = COMMUNICATIONS.find((communication) => communication.slug === slug);
  if (!item) return { title: "Comunicado no encontrado | ACIA" };
  return { title: `${item.title} | ACIA`, description: item.summary };
}

export default async function CommunicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = COMMUNICATIONS.find((communication) => communication.slug === slug);
  if (!item) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    datePublished: item.date,
    description: item.summary,
    author: { "@type": "Organization", name: "Asociación Colombiana de Inteligencia Artificial - ACIA", url: "https://iaencolombia.org" },
    publisher: { "@type": "Organization", name: "Asociación Colombiana de Inteligencia Artificial - ACIA", url: "https://iaencolombia.org" },
    ...(item.authorName ? { accountablePerson: { "@type": "Person", name: item.authorName } } : {}),
  };

  return (
    <PublicPage eyebrow={item.category} title={item.title} description={item.summary}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 sm:p-12">
        <p className="font-mono text-xs font-bold text-primary/60">{formatCommunicationDate(item.date)}</p>
        <div className="mt-8 whitespace-pre-line text-base leading-8 text-foreground">{item.content}</div>
        {item.authorName && (
          <footer className="mt-10 border-t border-border pt-7">
            <p className="font-bold text-primary">{item.authorName}</p>
            {item.authorRole && <p className="mt-1 text-sm text-muted-foreground">{item.authorRole}</p>}
          </footer>
        )}
        {item.editorialNote && <aside className="mt-8 rounded-xl border-l-4 border-accent bg-surface p-5 text-sm italic leading-6 text-muted-foreground">{item.editorialNote}</aside>}
        {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#031560]">Ver comunicado oficial en PDF ↗</a>}
      </article>
    </PublicPage>
  );
}
