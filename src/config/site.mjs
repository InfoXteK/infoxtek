// SINGLE SOURCE OF TRUTH. Edit content here; templates in scripts/build.mjs never hold business copy.
// Values marked VERIFY are unknown. Leave null until confirmed. Nothing here is invented company data.
export const site = {
  name: 'InfoXtek',
  url: 'https://infoXtek.com',
  tagline: 'Dependable IT, planned around your business.',
  description:
    'InfoXtek provides cloud solutions, managed IT services, network solutions, disaster recovery and IT consulting for growing organizations.',
  locale: 'en',
};

export const contact = {
  email: infoxtekcorp@gmail.com,        // VERIFY: real company email
  phone: +971545414237,        // VERIFY: real company phone
  address: International City, Dubai.,      // VERIFY: real company address
  formEndpoint: null, // Optional https:// URL of a form provider you approve. null = form is not connected.
  social: [],         // e.g. [{ label: 'LinkedIn', href: 'https://...' }]
};

export const nav = [
  { label: 'Home', path: '/' },
  { label: 'Why Choose Us', path: '/why-choose-us/' },
  { label: 'Our Services', path: '/services/' },
  { label: 'Industries', path: '/industries/' },
  { label: 'Tools & Tips', path: '/tools-tips/' },
  { label: 'Contact Us', path: '/contact/' },
];

export const services = [
  { slug: 'cloud-solutions', title: 'Cloud Solutions',
    summary: 'Move workloads to the cloud with a plan for cost, security and growth.',
    points: ['Cloud readiness review and migration planning', 'Hosted email, storage and business applications', 'Ongoing cost and performance tuning'] },
  { slug: 'cloud-desktop', title: 'Cloud Desktop',
    summary: 'Give staff secure access to their desktop from any approved device.',
    points: ['Centrally managed virtual desktops', 'Faster onboarding and offboarding', 'Data kept off personal devices'] },
  { slug: 'managed-it', title: 'Managed IT Services',
    summary: 'A team that monitors, maintains and supports your systems every day.',
    points: ['Proactive monitoring and patching', 'Help desk for your staff', 'Regular reporting and technology roadmaps'] },
  { slug: 'network-solutions', title: 'Network Solutions',
    summary: 'Design, setup and support for wired, wireless and remote-access networks.',
    points: ['Network design and installation', 'Firewall and remote-access configuration', 'Performance and reliability reviews'] },
  { slug: 'disaster-recovery', title: 'Disaster Recovery',
    summary: 'Backups and recovery plans so an outage does not become a shutdown.',
    points: ['Backup strategy and restore testing', 'Documented recovery procedures', 'Business impact and recovery-time planning'] },
  { slug: 'support-consulting', title: 'Support Consulting',
    summary: 'Practical advice on technology decisions, projects and vendors.',
    points: ['IT assessments and strategy', 'Software selection and implementation guidance', 'Vendor and contract review'] },
];

export const reasons = [
  { title: 'Experienced and forward-looking', text: 'Years of hands-on IT work, applied to modern tools.' },
  { title: 'Built around you', text: 'Solutions are shaped to your goals and budget, not a fixed package.' },
  { title: 'Proactive support', text: 'We watch for problems and fix them before they interrupt your day.' },
  { title: 'Current with technology', text: 'We track new tools and recommend them only when they pay off.' },
  { title: 'Long-term partnership', text: 'We aim to be the IT team you keep, not a one-off vendor.' },
];

export const industries = [
  { name: 'Agriculture', summary: 'Reliable connectivity and systems for farms, processing and supply chains.' },
  { name: 'Banking & Financial Services', summary: 'Secure, well-documented IT for regulated environments.' },
  { name: 'Education', summary: 'Stable networks and device management for schools and training providers.' },
  { name: 'Energy & Utilities', summary: 'Resilient infrastructure and recovery planning for critical operations.' },
  { name: 'Government', summary: 'Careful, compliant IT support for public-sector teams.' },
];

export const bookings = [
  { title: 'Tech Support', text: 'Help with a fault, a slow system or a user problem.' },
  { title: 'Software Implementation', text: 'Install, configure and roll out business software.' },
  { title: 'Home Entertainment System Setup', text: 'Set up TVs, audio and streaming devices at home.' },
  { title: 'Remote Tech Support', text: 'Get help over a secure remote session.' },
];

// Add real downloadable resources: { title, text, href } (href = path under /public or https URL).
export const resources = [];
export const testimonials = []; // Add only real, permitted quotes: { quote, name, role }
