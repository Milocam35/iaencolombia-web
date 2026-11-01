import Image from "next/image";
import Link from "next/link";
import type { PublicNewsletter } from "@/lib/newsletters";
import { NEWS } from "@/data/publicExperience";
type Story = {
  title: string;
  href: string;
  date: string;
  label: string;
  image: string;
};
const EDITORIAL_IMAGES = [
  "editorial-agentes",
  "conocimiento",
  "editorial-educacion",
];
const newsStory = (index: number): Story => ({
  title: NEWS[index].title,
  href: NEWS[index].url,
  date: NEWS[index].date + "T12:00:00-05:00",
  label: NEWS[index].source,
  image: index === 0 ? "editorial-educacion" : "conocimiento",
});
const edition = (item: PublicNewsletter, index: number): Story => ({
  title: item.title,
  href: `/newsletters/${item.slug}`,
  date: item.first_published_at,
  label: `ACIA al día${item.edition_number ? ` · ${String(item.edition_number).padStart(2, "0")}` : ""}`,
  image: /agente|automatiza|decisi/i.test(item.title)
    ? "editorial-agentes"
    : /curso|formaci|aprend|educa/i.test(item.title)
      ? "conocimiento"
      : EDITORIAL_IMAGES[index % EDITORIAL_IMAGES.length],
});
function StoryCard({
  item,
  featured = false,
}: {
  item: Story;
  featured?: boolean;
}) {
  return (
    <a
      href={item.href}
      className={`op3-story${featured ? " op3-story-featured" : ""}`}
    >
      <div className="op3-story-photo">
        <Image
          src={`/images/opcion3/${item.image}.webp`}
          unoptimized={item.image !== "conocimiento"}
          alt=""
          fill
          sizes={
            featured
              ? "(min-width: 1280px) 440px, (min-width: 768px) 50vw, 100vw"
              : "100px"
          }
        />
        <span>Ilustración</span>
      </div>
      <div className="op3-story-copy">
        <p className="op3-story-label">{item.label}</p>
        <h3>{item.title}</h3>
        <time dateTime={item.date}>
          {new Intl.DateTimeFormat("es-CO", {
            dateStyle: "medium",
            timeZone: "America/Bogota",
          }).format(new Date(item.date))}
        </time>
      </div>
    </a>
  );
}
export function NewsletterLanding({
  items,
}: {
  items: PublicNewsletter[] | null;
}) {
  const primary = items?.length ? edition(items[0], 0) : newsStory(0);
  const secondary = [
    ...(items?.slice(1, 3).map((item) => edition(item, 1)) ?? []),
    ...NEWS.map((_, index) => newsStory(index)).filter(
      (item) => item.href !== primary.href,
    ),
  ].slice(0, 2);
  const usedImages = new Set<string>();
  const [featured, ...otherStories] = [primary, ...secondary].map((item) => {
    const image = usedImages.has(item.image)
      ? EDITORIAL_IMAGES.find((candidate) => !usedImages.has(candidate))!
      : item.image;
    usedImages.add(image);
    return { ...item, image };
  });
  return (
    <section id="newsletters" className="op3-editorial">
      <div className="op3-block-heading">
        <h2>Conocimiento y actualidad</h2>
        <p>Ideas y perspectivas para nuestra comunidad.</p>
      </div>
      <StoryCard item={featured} featured />
      <div className="op3-story-list">
        {otherStories.map((item) => (
          <StoryCard key={item.href} item={item} />
        ))}
      </div>
      {items === null && (
        <p className="op3-editorial-notice">
          Las ediciones de ACIA al día no están disponibles temporalmente.
        </p>
      )}
      <div className="op3-editorial-links">
        <Link href="/newsletters" className="text-link">
          ACIA al día →
        </Link>
        <Link href="/comunicados" className="text-link">
          Comunicados →
        </Link>
      </div>
    </section>
  );
}
