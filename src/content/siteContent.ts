export interface SocialLink {
  label: string;
  href: string;
}

export interface ProjectCard {
  title: string;
  description: string;
  stack: string;
  href: string;
  linkLabel: string;
}

export interface ContactItem {
  label: string;
  href?: string;
  tone: string;
}

export interface ProfileHighlight {
  title: string;
  body: string;
}

export const profile = {
  name: 'Jonathan Sotoodeh',
  shortName: 'jonathan',
  city: 'Miami',
  bio:
    'Jonathan Sotoodeh leads internal AI innovation at Kaseya within strategic finance. Ex-founder. Michigan Ross MBA.',
  summary:
    'He builds AI systems tied to revenue, cost savings, and executive decision-making across GTM, renewals, and finance.',
  focus:
    'Internal AI innovation, strategic finance, GTM execution, founder-led product building, and strategy.',
  currentBuild: "Jonathan's Neon Cyber Headquarters",
  githubRepos: 1,
};

export const profileHighlights: ProfileHighlight[] = [
  {
    title: 'Kaseya | Internal AI Innovation',
    body:
      'Built AI products tied to $1.5M in added Q4 gross bookings and $4M in annual cost savings, won the Kaseya GenAI Spotlight, and keynoted a company all-hands.',
  },
  {
    title: 'Kaseya | Strategic Finance',
    body:
      'Owned churn forecasting for $1.6B in renewals, helped drive a $2M churn mitigation result, and delivered board- and C-suite-level operating analysis.',
  },
  {
    title: 'Founder | Novastitch',
    body:
      'Raised a $90K seed round, led robotics product development from idea to working prototype, partnered with major brands, and improved gross margins by 29%.',
  },
  {
    title: 'University',
    body:
      'Michigan Ross MBA, 3.94 GPA, High Distinction. USC business graduate in finance, Magna Cum Laude, USC Ice Hockey, and named 1 of 30 Marshall Graduates of the Last Decade.',
  },
  {
    title: 'Executive Education',
    body:
      'Completed strategy programs at Cass Business School and Harvard Business School focused on disruptive strategy, AI, and executive decision-making.',
  },
];

export const socialLinks: SocialLink[] = [
  { label: 'MAIL', href: 'mailto:jonathan.sotoodeh@kaseya.com' },
  { label: 'GH', href: 'https://github.com/jonathansotoodeh' },
  { label: 'IN', href: 'https://www.linkedin.com/in/jonathansotoodeh/' },
];

export const projects: ProjectCard[] = [
  {
    title: "Jonathan's Neon Cyber Headquarters",
    description:
      'The live 3D portfolio experience: a cyberpunk Miami loft built with React Three Fiber, postprocessing, responsive overlays, and GitHub Pages deployment.',
    stack: 'Vite, React, TypeScript, React Three Fiber, Drei, Tailwind, GSAP',
    href: 'https://jonathansotoodeh.github.io/Personal_Page/',
    linkLabel: 'Open Live Site',
  },
  {
    title: 'Personal_Page Repository',
    description:
      'The source repository for this portfolio, including the scene system, interactive objects, overlays, and GitHub Actions deployment pipeline.',
    stack: 'TypeScript, GitHub Actions, Vite Build Pipeline',
    href: 'https://github.com/jonathansotoodeh/Personal_Page',
    linkLabel: 'Open Repository',
  },
  {
    title: 'GitHub Profile',
    description:
      "Jonathan's public GitHub account. The current public footprint shows one repository today, with additional work not yet exposed publicly.",
    stack: 'Public Profile, Repository Index, Deployment History',
    href: 'https://github.com/jonathansotoodeh',
    linkLabel: 'Open Profile',
  },
];

export const contactItems: ContactItem[] = [
  {
    label: 'Email / jonathan.sotoodeh@kaseya.com',
    href: 'mailto:jonathan.sotoodeh@kaseya.com',
    tone: 'text-neonCyan',
  },
  {
    label: 'GitHub / jonathansotoodeh',
    href: 'https://github.com/jonathansotoodeh',
    tone: 'text-neonPink',
  },
  {
    label: 'LinkedIn / jonathansotoodeh',
    href: 'https://www.linkedin.com/in/jonathansotoodeh/',
    tone: 'text-neonYellow',
  },
  {
    label: 'Location / Miami, FL',
    href: 'https://www.google.com/maps/search/Miami,+FL',
    tone: 'text-white',
  },
];
