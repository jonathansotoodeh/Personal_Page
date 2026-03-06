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
    'Jonathan Sotoodeh leads internal AI innovation at Kaseya within strategic finance. He is also an ex-founder and a Michigan Ross MBA.',
  summary:
    'At Kaseya, he has led internal AI innovation work across GTM and renewals, built AI systems tied to gross bookings growth and labor savings, and previously worked in strategic finance on churn forecasting, churn mitigation, and executive decision support.',
  focus:
    'Internal AI innovation, strategic finance, GTM initiatives, founder-led product development, and strategy education across business and disruptive innovation',
  currentBuild: "Jonathan's Neon Cyber Haven",
  githubRepos: 1,
};

export const profileHighlights: ProfileHighlight[] = [
  {
    title: 'Kaseya | Internal AI Innovation',
    body:
      'Manager, Internal AI Innovation (2025-Present). Built an AI Pipeline Prioritization platform that generated $1.5M of additional gross bookings in the last two weeks of Q4 25, led a multi-agent AI Account Investigation platform tied to $4M in annual cost savings through a 92% reduction in manual labor hours for renewals, earned the Kaseya GenAI Spotlight for Innovation, and presented as a keynote speaker at a company-wide all-hands for 500+ attendees.',
  },
  {
    title: 'Kaseya | Strategic Finance',
    body:
      'Strategic Finance (2024-2025). Owned company-wide churn forecasting for $1.6B in SaaS renewals, led analysis for a churn mitigation program that saved $2M in its Q2 launch, proposed accepted event cuts based on financial and regional impact, and delivered product utilization, breakeven, and growth-priority analysis to the C-suite, board, and private equity investors.',
  },
  {
    title: 'Founder | Novastitch',
    body:
      'Founder and CFO (2018-2024). Secured a $90K seed round at a $1.2M valuation, led product development from ideation to a functional robotics prototype using machine vision and object recognition, worked with strategic partners including The Gap, Inc. and H&M, improved per-unit gross margins by 29%, reduced R&D cycle time by 33%, and sold select product assets in the wind-down.',
  },
  {
    title: 'Education',
    body:
      'MBA, University of Michigan Ross School of Business, 3.94 GPA, High Distinction, Beta Gamma Sigma, and merit scholarship recipient. BS in Business Administration with a finance concentration from the University of Southern California, 3.73 GPA, Magna Cum Laude, Deans List 6 of 7 semesters, USC Ice Hockey player, and recognized as 1 of 30 Graduates of the Last Decade in the USC Marshall Centennial Book.',
  },
  {
    title: 'Executive Education',
    body:
      'Completed CEO Masterclasses in Strategy at Cass Business School and Disruptive Strategy with Clayton Christensen at Harvard Business School, applying strategic analysis to AI, ML, cloud technology, and senior stakeholder decision-making.',
  },
];

export const socialLinks: SocialLink[] = [
  { label: 'MAIL', href: 'mailto:jonathan.sotoodeh@kaseya.com' },
  { label: 'GH', href: 'https://github.com/jonathansotoodeh' },
  { label: 'IN', href: 'https://www.linkedin.com/in/jonathansotoodeh/' },
];

export const projects: ProjectCard[] = [
  {
    title: "Jonathan's Neon Cyber Haven",
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
      "Jonathan's public code home. Right now it reflects an early public footprint centered on this portfolio and future work still coming online.",
    stack: 'Public Profile, Source Control, Deployment History',
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
