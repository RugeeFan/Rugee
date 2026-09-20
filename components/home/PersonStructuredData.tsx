import { LINKS } from '../../lib/home/content'
import { absoluteUrl } from '../../lib/site'

export default function PersonStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ruijie Fan',
    alternateName: 'Rugee',
    jobTitle: 'Full-Stack Developer',
    url: absoluteUrl('/'),
    email: `mailto:${LINKS.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressRegion: 'NSW', addressCountry: 'AU' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Wollongong' },
    sameAs: [LINKS.linkedin, LINKS.github],
    knowsAbout: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'React Native', 'Solidity'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
