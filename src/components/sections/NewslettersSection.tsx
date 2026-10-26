import { listNewsletters } from '@/lib/newsletters';
import { NewsletterLanding } from '@/components/newsletter/NewsletterLanding';
export async function NewslettersSection() {
  const items=await listNewsletters(3).catch(()=>null);
  return <NewsletterLanding items={items}/>;
}
