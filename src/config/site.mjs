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
  email: 'infoxtekcorp@gmail.com', // provided by owner
  phone: null,        // VERIFY: real company phone
  address: null,      // VERIFY: real company address
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
  { slug: 'cloud-solutions', title: 'Cloud Solutions', icon: 'cloud',
    summary: 'Plan, migrate and run workloads on Azure, AWS and Alibaba Cloud with cost and security built in.',
    intro: 'We assess your applications, choose the right landing zone, and migrate with minimal downtime. Governance, tagging, cost controls and identity are set up before the first workload moves.',
    steps: ['Discover: inventory servers, dependencies, licences and data sensitivity', 'Design: landing zone, network, identity, backup and monitoring', 'Migrate: rehost, replatform or refactor in planned waves', 'Operate: patching, cost reviews and performance tuning'],
    stacks: [{ g: 'Cloud platforms', i: ['Microsoft Azure', 'Amazon Web Services', 'Alibaba Cloud'] }, { g: 'Identity and governance', i: ['Microsoft Entra ID', 'Azure Policy', 'AWS IAM'] }, { g: 'Protection', i: ['Veeam', 'Acronis Cyber Protect'] }],
    outcomes: ['Predictable cloud spend', 'Right-sized, secured workloads', 'A documented, repeatable environment'] },
  { slug: 'cloud-desktop', title: 'Cloud Desktop', icon: 'desktop',
    summary: 'Secure virtual desktops and managed devices so staff work safely from anywhere.',
    intro: 'Staff get a consistent desktop on any approved device while data stays in your tenant. Access is tied to identity, device health and conditional access rules.',
    steps: ['Profile users and applications to size the desktop pool', 'Build images and publish apps from Azure or AWS', 'Enrol devices and enforce policy with Intune', 'Apply conditional access and monitor sessions'],
    stacks: [{ g: 'Desktop platforms', i: ['Azure Virtual Desktop', 'Windows 365', 'Amazon WorkSpaces'] }, { g: 'Device and identity', i: ['Microsoft Intune', 'Microsoft Entra ID', 'Conditional Access'] }, { g: 'Endpoint protection', i: ['Microsoft Defender', 'CrowdStrike Falcon'] }],
    outcomes: ['Fast onboarding and offboarding', 'Company data off personal devices', 'One policy across every endpoint'] },
  { slug: 'managed-it', title: 'Managed IT Services', icon: 'gear',
    summary: 'Proactive monitoring, patching, help desk and security operations for your whole environment.',
    intro: 'A named team watches your systems, patches them on a schedule and answers your staff. Monthly reporting shows what was fixed, what is at risk and what to plan next.',
    steps: ['Onboard: asset inventory, baselines and runbooks', 'Monitor: alerts, patch status and backup health', 'Support: help desk with agreed response times', 'Review: monthly reports and a technology roadmap'],
    stacks: [{ g: 'Endpoint and identity', i: ['Microsoft Intune', 'Microsoft Entra ID', 'Microsoft Defender'] }, { g: 'Security operations', i: ['Microsoft Sentinel', 'Secureworks Taegis', 'CrowdStrike Falcon'] }, { g: 'Backup', i: ['Veeam', 'Acronis'] }],
    outcomes: ['Fewer outages and surprises', 'Clear reporting for management', 'Predictable monthly IT cost'] },
  { slug: 'network-solutions', title: 'Network Solutions', icon: 'network',
    summary: 'Secure wired, wireless and remote-access networks with policy-based access control.',
    intro: 'We design segmented networks, firewalls and wireless that follow least privilege. Who and what connects is decided by identity and device posture, not just a password.',
    steps: ['Assess: topology, capacity, wireless surveys and risks', 'Design: segmentation, firewalls, VPN and zero-trust access', 'Deploy: configure, test and document', 'Audit: periodic security reviews and rule clean-up'],
    stacks: [{ g: 'Access control', i: ['Aruba ClearPass', 'Microsoft Entra ID'] }, { g: 'Firewall and threat prevention', i: ['Check Point', 'Fortinet'] }, { g: 'Email and web', i: ['Proofpoint', 'Microsoft Defender'] }],
    outcomes: ['Only trusted users and devices connect', 'Segmented networks limit the blast radius', 'Documented, auditable configuration'] },
  { slug: 'disaster-recovery', title: 'Disaster Recovery', icon: 'shield',
    summary: 'Backup, replication and tested recovery plans using Veeam, Acronis and Quorum onQ.',
    intro: 'We define how much data you can lose (RPO) and how fast you must be back (RTO), then match the tooling to it. Recovery is tested on a schedule, so the plan is proven before you need it.',
    steps: ['Business impact analysis: rank systems by RTO and RPO', 'Design: 3-2-1 backups with an immutable or offline copy', 'Implement: backup jobs, replication and runbooks', 'Test: scheduled restore and failover drills with reports'],
    stacks: [{ g: 'Backup and replication', i: ['Veeam Backup & Replication', 'Acronis Cyber Protect', 'Quorum onQ'] }, { g: 'Cloud targets', i: ['Azure Backup', 'Amazon S3', 'Alibaba OSS'] }, { g: 'Ransomware resilience', i: ['Immutable storage', 'Offline copies', 'Restore testing'] }],
    outcomes: ['Defined recovery targets', 'Ransomware-resistant backups', 'Evidence of successful recovery tests'] },
  { slug: 'cyber-security', title: 'Cyber Security', icon: 'lock',
    summary: 'Layered protection: endpoint, email, data loss prevention, identity and 24/7 detection.',
    intro: 'We combine prevention and detection: endpoints, email, identity and data are each protected, and logs flow to a central view for investigation and response.',
    steps: ['Assess: risk review, configuration and identity audit', 'Protect: endpoint, email and DLP controls', 'Detect: SIEM and managed detection and response', 'Respond: playbooks, containment and lessons learned'],
    stacks: [{ g: 'Endpoint and XDR', i: ['CrowdStrike Falcon', 'Microsoft Defender', 'Sophos', 'Kaspersky'] }, { g: 'SIEM and detection', i: ['Microsoft Sentinel', 'Secureworks Taegis'] }, { g: 'Data loss prevention', i: ['Forcepoint DLP', 'FortiDLP', 'Microsoft Purview'] }, { g: 'Email and network', i: ['Proofpoint', 'Check Point', 'Aruba ClearPass'] }],
    outcomes: ['Fewer successful attacks', 'Faster detection and response', 'Sensitive data kept from leaving'] },
  { slug: 'support-consulting', title: 'Support Consulting', icon: 'chat',
    summary: 'Independent advice on technology strategy, vendor selection and projects.',
    intro: 'When you need a second opinion or extra hands, we assess options, compare vendors fairly and guide implementation so projects land on time.',
    steps: ['Understand goals, constraints and budget', 'Assess current state and options', 'Recommend with costs, risks and a roadmap', 'Support delivery and hand over'],
    stacks: [{ g: 'Typical topics', i: ['Cloud strategy', 'Security posture', 'Licensing', 'Vendor selection'] }],
    outcomes: ['Decisions backed by evidence', 'Fewer costly mistakes', 'A clear multi-year roadmap'] },
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
