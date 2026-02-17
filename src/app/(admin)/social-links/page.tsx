import { getSocialLinks } from "@/lib/actions/social-links";
import { SocialLinksList } from "@/components/admin/portfolio/social-links-list";

export default async function SocialLinksPage() {
  const links = await getSocialLinks();

  return <SocialLinksList initialLinks={links} />;
}
