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

export const profile = {
  name: 'Jay Sotoodeh',
  shortName: 'jay',
  handle: '@jtsotoodeh',
  city: 'Miami',
  bio:
    'Jay Sotoodeh is a Miami-based developer focused on immersive web experiences, creative coding, and 3D frontends built with modern React tooling.',
  summary:
    'Currently shipping a public React Three Fiber portfolio, building interaction-heavy frontends, and shaping a stronger public body of work around web, motion, and real-time 3D.',
  focus: 'React, TypeScript, React Three Fiber, Tailwind CSS, GSAP, GitHub Pages',
  currentBuild: "Jay's Neon Cyber Haven",
  githubRepos: 1,
};

export const socialLinks: SocialLink[] = [
  { label: 'X', href: 'https://x.com/jtsotoodeh' },
  { label: 'GH', href: 'https://github.com/jonathansotoodeh' },
  { label: 'IN', href: 'https://www.linkedin.com/in/jonathansotoodeh/' },
];

export const projects: ProjectCard[] = [
  {
    title: "Jay's Neon Cyber Haven",
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
      "Jay's public code home. Right now it reflects an early public footprint centered on this portfolio and future work still coming online.",
    stack: 'Public Profile, Source Control, Deployment History',
    href: 'https://github.com/jonathansotoodeh',
    linkLabel: 'Open Profile',
  },
];

export const contactItems: ContactItem[] = [
  {
    label: 'X / @jtsotoodeh',
    href: 'https://x.com/jtsotoodeh',
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
    tone: 'text-white',
  },
];
