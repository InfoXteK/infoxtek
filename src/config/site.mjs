// SINGLE SOURCE OF TRUTH. Edit content here; templates in scripts/build.mjs never hold business copy.
// Values marked VERIFY are unknown. Leave null until confirmed. Nothing here is invented company data.
export const site = {
  name: 'InfoXteK',
  url: 'https://infoXtek.com',
  tagline: 'Dependable IT, planned around your business.',
  description:
    'InfoXteK provides cloud solutions, managed IT services, network solutions, disaster recovery and IT consulting for growing organizations.',
  locale: 'en',
};

export const contact = {
  email: 'infoxtekcorp@gmail.com', // provided by owner
  phone: null,        // VERIFY: real company phone
  address: null,      // VERIFY: real company address
  licenseCc: ['abuabdullah.be@outlook.com', 'jamilsyed77@gmail.com'], // copied on every Net-Monit license request (owner's instruction)
  formEndpoint: null, // Optional https:// URL of a form provider you approve. null = form is not connected.
  social: [],         // e.g. [{ label: 'LinkedIn', href: 'https://...' }]
};

export const nav = [
  { label: 'Home', path: '/' },
  { label: 'Why Choose Us', path: '/why-choose-us/' },
  { label: 'Our Services', path: '/services/' },
  { label: 'Industries', path: '/industries/' },
  { label: 'Products', path: '/products/' },
  { label: 'Tools & Tips', path: '/tools-tips/' },
  { label: 'Contact Us', path: '/contact/' },
];

export const platforms = ['Microsoft Azure', 'AWS', 'Alibaba Cloud', 'Microsoft 365', 'Intune', 'Entra ID', 'VMware', 'Hyper-V', 'Veeam', 'Acronis', 'Quorum', 'HPE 3PAR', 'NetApp', 'Forcepoint DLP', 'FortiDLP', 'Taegis XDR', 'Sophos MDR', 'SentinelOne', 'Kaspersky', 'CrowdStrike', 'Microsoft Defender', 'Check Point', 'Proofpoint', 'FortiGate', 'Forcepoint NGFW', 'ClearPass', 'BeyondTrust', 'React', 'Next.js', 'Node.js', 'Flutter', 'Shopify', 'WordPress'];

export const services = [
  { slug: 'cloud-solutions', title: 'Cloud Solutions', icon: 'cloud',
    summary: 'Plan, migrate and run workloads on Azure, AWS and Alibaba Cloud with cost and security built in.',
    intro: 'We assess your applications, choose the right landing zone and migrate with minimal downtime. Identity, governance and monitoring are in place before the first workload moves.',
    steps: ['Discover: inventory servers, dependencies and data sensitivity', 'Design: landing zone, network, identity and backup', 'Migrate: rehost, replatform or refactor in planned waves', 'Operate: patching, audits and performance tuning'],
    caps: ['Configure and tune Azure virtual machines and services for performance, availability and compliance', 'Build and maintain hybrid environments linking on-premises systems to the cloud', 'Administer Microsoft 365: provisioning, licensing and secure mailbox configuration', 'Run system audits and impact assessments before and after migration', 'Assess hosting, integration and security needs for enterprise AI agent server workloads'],
    stacks: [{ g: 'Cloud platforms', i: ['Microsoft Azure', 'Amazon Web Services', 'Alibaba Cloud'] }, { g: 'Productivity and identity', i: ['Microsoft 365', 'Microsoft Entra ID', 'Active Directory'] }, { g: 'Protection', i: ['Veeam', 'Acronis'] }],
    outcomes: ['Predictable cloud spend', 'Right-sized, secured workloads', 'A documented, repeatable environment'] },
  { slug: 'cloud-desktop', title: 'Cloud Desktop', icon: 'desktop',
    summary: 'Managed desktops, virtual machines and devices so staff work safely from anywhere.',
    intro: 'Staff get a consistent, policy-controlled desktop on approved devices while company data stays protected. Access is tied to identity and device compliance.',
    steps: ['Profile users, applications and devices', 'Build images and virtual machines on Hyper-V, VMware or Azure', 'Enrol devices and enforce policy with Intune', 'Apply identity and access rules and monitor compliance'],
    caps: ['Configure Intune MDM: device compliance, restrictions and application management for laptops, desktops, tablets and Android devices', 'Manage Microsoft Entra ID and Active Directory: authentication, group policy and user provisioning', 'Administer Hyper-V and VMware ESXi/vSphere: VM provisioning, resource optimization and high availability', 'Roll out endpoint security policies alongside device management'],
    stacks: [{ g: 'Device management', i: ['Microsoft Intune', 'Group Policy', 'ManageEngine'] }, { g: 'Virtualization', i: ['VMware ESXi', 'vSphere', 'Hyper-V', 'Azure VMs'] }, { g: 'Identity', i: ['Microsoft Entra ID', 'Active Directory'] }],
    outcomes: ['Fast onboarding and offboarding', 'Company data protected on every device', 'One policy across the fleet'] },
  { slug: 'managed-it', title: 'Managed IT Services', icon: 'gear',
    summary: 'Proactive monitoring, patching, help desk and application support for your whole environment.',
    intro: 'A named team monitors your systems, patches them on a schedule and supports your staff. Reports show what was fixed, what is at risk and what to plan next.',
    steps: ['Onboard: inventory, baselines and runbooks', 'Monitor: availability, patch status and backup health', 'Support: help desk with root-cause analysis', 'Review: audits, reports and a roadmap'],
    caps: ['Centralized patch management with ManageEngine across endpoints and servers', 'Track CVSS vulnerability scores and drive prioritized patching of critical and high findings', 'Administer Active Directory, DNS, DHCP and Group Policy', '2nd-level support and root-cause analysis for escalated issues across systems, networks and applications', 'System audits, impact assessments and hardening', 'Application administration and integration for ECM Workflow, Genesys, Salesforce CRM and SharePoint', 'Network and service monitoring with outage alerting; automation of repetitive admin tasks'],
    stacks: [{ g: 'Patching and endpoints', i: ['ManageEngine', 'Microsoft Intune', 'EDR agents'] }, { g: 'Platforms', i: ['Microsoft 365', 'Active Directory', 'Hyper-V', 'VMware'] }, { g: 'Business applications', i: ['SharePoint', 'Salesforce CRM', 'Genesys', 'ECM Workflow'] }],
    outcomes: ['Fewer outages and surprises', 'Clear reporting for management', 'Predictable monthly IT cost'] },
  { slug: 'network-solutions', title: 'Network Solutions', icon: 'network',
    summary: 'Firewalls, VPN, wireless and identity-based network access control.',
    intro: 'We design segmented networks and firewalls that follow least privilege. Who and what connects is decided by identity and device posture, not just a password.',
    steps: ['Assess: topology, traffic and risks', 'Design: segmentation, firewall policy, VPN and access control', 'Deploy: configure, test and document', 'Audit: log review and rule clean-up'],
    caps: ['FortiGate and Forcepoint NGFW policy administration: rules, VIPs, port forwarding, traffic inspection and perimeter defense', 'VLANs, routing, DNS and DHCP design and support', 'VPN for secure, encrypted remote user authentication', 'ClearPass NAC deployment and monitoring for identity-based access', 'Event log and traffic analysis, network troubleshooting and root-cause analysis', 'Cisco, Aruba and UniFi equipment'],
    stacks: [{ g: 'Firewalls', i: ['FortiGate', 'Forcepoint NGFW', 'Check Point'] }, { g: 'Access control', i: ['Aruba ClearPass', 'Microsoft Entra ID'] }, { g: 'Switching and wireless', i: ['Cisco', 'Aruba', 'UniFi'] }],
    outcomes: ['Only trusted users and devices connect', 'Segmentation limits the blast radius', 'Documented, auditable configuration'] },
  { slug: 'disaster-recovery', title: 'Disaster Recovery', icon: 'shield',
    summary: 'Backup, storage and tested recovery using Veeam, Acronis, Quorum, HPE 3PAR and NetApp.',
    intro: 'We set recovery targets (RPO and RTO) with you, then match tooling to them. Recovery is tested on a schedule so the plan is proven before it is needed.',
    steps: ['Business impact analysis and recovery targets', 'Design: multiple copies including an offline or immutable one', 'Implement: backup jobs, replication and runbooks', 'Test: scheduled restore and failover drills'],
    caps: ['Configure, manage and monitor Veeam, Quorum, HPE 3PAR and MSA storage for backup integrity and DR readiness', 'Plan and run storage migrations, including to NetApp', 'Acronis backup for Microsoft 365: mailboxes, OneDrive and SharePoint', 'Oracle RMAN backup operations for consistent, recoverable databases', 'NAS-based backups with retention policies and recovery procedures', 'Backup success monitoring and recovery-time improvement'],
    stacks: [{ g: 'Backup and recovery', i: ['Veeam Backup & Replication', 'Acronis', 'Quorum onQ', 'Oracle RMAN'] }, { g: 'Storage', i: ['HPE 3PAR', 'HPE MSA', 'NetApp', 'NAS'] }, { g: 'Cloud targets', i: ['Azure Backup', 'Amazon S3', 'Alibaba OSS'] }],
    outcomes: ['Defined recovery targets', 'Ransomware-resistant backups', 'Evidence of successful recovery tests'] },
  { slug: 'cyber-security', title: 'Cyber Security', icon: 'lock',
    summary: 'Data loss prevention, XDR/EDR, email security, privileged access and vulnerability management.',
    intro: 'We layer prevention and detection: data, endpoints, email, identity and privileged accounts are each protected, and alerts feed an investigation and response process.',
    steps: ['Assess: risk review, configuration and identity audit', 'Protect: DLP, endpoint, email and privileged access controls', 'Detect: XDR, EDR and managed detection and response', 'Respond: containment, root-cause analysis and remediation tracking'],
    caps: ['Forcepoint DLP policies across endpoints: data classification, flow analysis and incident handling', 'Taegis XDR, Sophos MDR, SentinelOne and Kaspersky EDR: policy creation, access restrictions and automated response', 'Microsoft Defender and Check Point email security against phishing, malware and spam', 'Azure Information Protection: sensitivity labels and auto-labeling rules', 'BeyondTrust Password Safe: privileged access policies, credential rotation and audit', 'Review regulator and audit findings and track remediation to closure', 'CVSS-based vulnerability management and system hardening'],
    stacks: [{ g: 'Data protection', i: ['Forcepoint DLP', 'FortiDLP', 'Azure Information Protection'] }, { g: 'Detection and response', i: ['Taegis XDR', 'Sophos MDR', 'SentinelOne', 'Kaspersky EDR', 'CrowdStrike'] }, { g: 'Email and access', i: ['Microsoft Defender', 'Check Point', 'Proofpoint', 'BeyondTrust', 'ClearPass'] }],
    outcomes: ['Less sensitive data leaving the business', 'Faster detection and response', 'Controlled, audited privileged access'] },
  { slug: 'support-consulting', title: 'Support Consulting', icon: 'chat',
    summary: 'Systems analysis, solution design and vendor guidance for IT projects.',
    intro: 'We turn business and operational requirements into technical solutions across identity, endpoint, network and application platforms, and guide delivery.',
    steps: ['Understand goals, constraints and budget', 'Analyse current systems and options', 'Recommend with costs, risks and a roadmap', 'Support delivery, documentation and handover'],
    caps: ['Systems analysis and solution design', 'System integration and application support', 'Impact assessments and IT governance', 'Change management and technical documentation', 'Vendor management and selection'],
    stacks: [{ g: 'Typical topics', i: ['Identity and endpoint', 'Network security', 'Backup and recovery', 'Cloud strategy', 'Vendor selection'] }],
    outcomes: ['Decisions backed by evidence', 'Fewer costly mistakes', 'A clear roadmap'] },
  { slug: 'web-applications', grp: 'Digital & Software', title: 'Web Applications', icon: 'code',
    summary: 'Secure, scalable web applications built around your workflows.',
    intro: 'We turn a business process into a dependable web application with authentication, role-based access and an audit trail from day one.',
    steps: ['Requirements and user journeys', 'Architecture and security design', 'Build in short, reviewed releases', 'Launch, monitor and improve'],
    caps: ['Portals, dashboards and internal tools', 'Authentication, roles and audit logging', 'Integration with existing systems and APIs', 'Automated testing and secure deployment'],
    stacks: [{ g: 'Typical stack', i: ['React', 'Next.js', 'Node.js', 'PostgreSQL'] }, { g: 'Security', i: ['OWASP Top 10 review', 'Input validation', 'Dependency scanning'] }],
    outcomes: ['Less manual work', 'A secure, maintainable codebase', 'Room to grow'] },
  { slug: 'mobile-applications', grp: 'Digital & Software', title: 'Mobile Applications', icon: 'phone',
    summary: 'iOS and Android apps that are fast, secure and easy to maintain.',
    intro: 'We design and build mobile apps that work offline, sync safely and meet app-store requirements.',
    steps: ['Concept and user flows', 'Design and prototype', 'Build and device testing', 'Store release and updates'],
    caps: ['iOS and Android apps from one codebase where suitable', 'Secure sign-in and encrypted data storage', 'Push notifications and offline sync', 'App store submission and updates'],
    stacks: [{ g: 'Typical stack', i: ['Flutter', 'React Native', 'Swift', 'Kotlin'] }, { g: 'Backend', i: ['REST APIs', 'Firebase', 'Supabase'] }],
    outcomes: ['One experience on every phone', 'Smooth store approval', 'A clear update path'] },
  { slug: 'web-design-development', grp: 'Digital & Software', title: 'Website Design & Development', icon: 'globe',
    summary: 'Fast, accessible, responsive websites that represent your brand.',
    intro: 'We design and build websites that load quickly, work on every screen and are easy for your team to update.',
    steps: ['Brand and content planning', 'Wireframes and visual design', 'Responsive build and accessibility checks', 'Launch and handover'],
    caps: ['Corporate and marketing websites', 'Content management you can edit yourself', 'Performance, accessibility and SEO foundations', 'Migration from existing platforms'],
    stacks: [{ g: 'Typical stack', i: ['HTML5', 'Astro', 'WordPress', 'Tailwind CSS'] }],
    outcomes: ['A professional first impression', 'Fast pages on mobile', 'Easy updates'] },
  { slug: 'seo', grp: 'Digital & Software', title: 'SEO', icon: 'search',
    summary: 'Technical, on-page and content SEO that brings the right visitors.',
    intro: 'We fix what stops search engines from understanding your site, then build content around what your customers search for.',
    steps: ['Audit: crawl, speed and indexing', 'Keyword and competitor research', 'On-page, technical and content work', 'Track rankings and leads'],
    caps: ['Technical SEO audits and fixes', 'Metadata, structured data and sitemaps', 'Content planning and local SEO', 'Search Console reporting'],
    stacks: [{ g: 'Tools', i: ['Google Search Console', 'Lighthouse', 'Screaming Frog'] }],
    outcomes: ['More relevant traffic', 'Better visibility', 'Clear reporting'] },
  { slug: 'digital-marketing', grp: 'Digital & Software', title: 'Digital Marketing', icon: 'megaphone',
    summary: 'Campaigns across search, social and email that you can measure.',
    intro: 'We plan campaigns around clear goals, publish consistently and report on leads rather than vanity numbers.',
    steps: ['Goals and audience', 'Channel and content plan', 'Launch and optimise', 'Report on leads and cost'],
    caps: ['Search and social advertising', 'Email campaigns and automation', 'Content and landing pages', 'Conversion tracking and reporting'],
    stacks: [{ g: 'Channels', i: ['Google Ads', 'LinkedIn', 'Meta', 'Email'] }],
    outcomes: ['Qualified leads', 'Spend tied to results', 'Consistent brand presence'] },
  { slug: 'full-stack-apps', grp: 'Digital & Software', title: 'Full Stack Applications', icon: 'server',
    summary: 'End-to-end products: interface, API, database and deployment.',
    intro: 'One team owns the whole product, from the screen to the database and the pipeline that ships it.',
    steps: ['Scope and architecture', 'Frontend, API and data model', 'Testing and CI/CD pipeline', 'Deployment and support'],
    caps: ['Frontend, backend and database design', 'APIs and third-party integrations', 'Automated tests and deployment pipelines', 'Cloud hosting and monitoring'],
    stacks: [{ g: 'Typical stack', i: ['React', 'Node.js', 'PostgreSQL', 'Docker'] }, { g: 'Cloud', i: ['Azure', 'AWS', 'Alibaba Cloud'] }],
    outcomes: ['One accountable team', 'Reliable releases', 'Maintainable code'] },
  { slug: 'ecommerce', grp: 'Digital & Software', title: 'E-commerce Development', icon: 'cart',
    summary: 'Online stores with secure checkout, inventory and order management.',
    intro: 'We build stores that are fast, easy to manage and safe to pay on, with payments handled by established providers.',
    steps: ['Catalogue and checkout design', 'Store build and integrations', 'Payment, tax and shipping setup', 'Launch and optimise'],
    caps: ['Product catalogue and inventory', 'Payment provider integration (card data stays with the provider)', 'Order, shipping and tax workflows', 'Fraud and bot protection'],
    stacks: [{ g: 'Platforms', i: ['Shopify', 'WooCommerce', 'Custom builds'] }, { g: 'Payments', i: ['Stripe', 'PayPal', 'Local gateways'] }],
    outcomes: ['Safe checkout', 'Less admin work', 'A store ready to grow'] },
  { slug: 'hosting-maintenance', grp: 'Digital & Software', title: 'Hosting & Maintenance', icon: 'server',
    summary: 'Managed hosting, backups, updates and monitoring for your sites and apps.',
    intro: 'We keep sites and applications fast, patched and backed up, and respond when something goes wrong.',
    steps: ['Migrate and configure hosting', 'Set up backups and monitoring', 'Apply updates on a schedule', 'Report and review'],
    caps: ['Managed hosting with CDN and SSL', 'Daily backups and restore testing', 'Security updates and uptime monitoring', 'Support and small changes'],
    stacks: [{ g: 'Platforms', i: ['Azure', 'AWS', 'Alibaba Cloud', 'GitHub Pages'] }],
    outcomes: ['Fewer outages', 'Safe, current software', 'One contact for problems'] },
  { slug: 'ai-solutions', grp: 'Digital & Software', title: 'AI Solutions', icon: 'chip',
    summary: 'Practical AI assistants and automation, with data protection built in.',
    intro: 'We help you use AI on your own documents and processes without leaking sensitive data: the right use cases, the right guardrails, and access controls from the start.',
    steps: ['Pick use cases with clear business value', 'Prepare and classify the data', 'Build the assistant or automation with guardrails', 'Monitor quality, cost and data protection'],
    caps: ['AI assistants that answer from your approved documents', 'Workflow automation for repetitive tasks', 'Data classification and DLP policies for AI use', 'Access control, logging and review of AI agents and their servers'],
    stacks: [{ g: 'Typical platforms', i: ['Microsoft Copilot', 'Azure OpenAI', 'Python', 'Power Automate'] }, { g: 'Protection', i: ['Sensitivity labels', 'DLP', 'Entra ID access control'] }],
    outcomes: ['Faster routine work', 'Sensitive data kept out of public AI tools', 'Clear rules for staff'] },
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

export const tips = [
  { g: 'Cyber security', i: [
    { t: 'Turn on multi-factor authentication', d: 'Require it for email, admin accounts and remote access first.' },
    { t: 'Patch on a schedule', d: 'Fix critical and high CVSS findings first, on endpoints and servers alike.' },
    { t: 'Treat unexpected links and attachments as suspect', d: 'Report suspicious email instead of deleting it so others are protected too.' },
    { t: 'Limit privileged access', d: 'Give people only the access they need and review admin accounts regularly.' } ] },
  { g: 'Backup and recovery', i: [
    { t: 'Follow 3-2-1', d: 'Keep three copies on two types of media, with one copy offsite.' },
    { t: 'Keep one copy offline or immutable', d: 'Ransomware cannot encrypt what it cannot reach.' },
    { t: 'Test restores, not just backup jobs', d: 'A green backup job does not prove you can recover.' },
    { t: 'Write down RTO and RPO', d: 'Agree how long each key system can be down and how much data you can lose.' } ] },
  { g: 'AI at work', i: [
    { t: 'Keep confidential data out of public AI tools', d: 'Provide approved tools and make the rule clear to staff.' },
    { t: 'Use DLP to catch sensitive data before it leaves', d: 'Classify data and set policies for uploads, paste and email.' },
    { t: 'Verify AI output before acting on it', d: 'Treat it as a draft, especially for code, contracts and figures.' },
    { t: 'Review what AI assistants and agents can access', d: 'Apply least privilege and sensitivity labels to the data they reach.' } ] },
  { g: 'Cloud and devices', i: [
    { t: 'Enrol every device in management', d: 'Require encryption, screen lock and up-to-date software.' },
    { t: 'Use conditional access', d: 'Only compliant devices and verified users reach company data.' },
    { t: 'Review cloud costs monthly', d: 'Remove unused resources and right-size what remains.' },
    { t: 'Keep an inventory', d: 'Know your devices, software, licences and who owns each.' } ] },
];

// Products. download: path under public/downloads or an https://github.com/InfoXteK/ URL. page:true builds /products/<slug>/.
export const products = [
  { slug: 'net-monit', page: true, title: 'Net-Monit V11.0', tag: 'Network and infrastructure monitoring', icon: 'network', download: 'https://github.com/InfoXteK/Net-monit-V11.0',
    summary: 'A production-grade, self-hosted network monitoring platform. Monitor ping latency, packet loss, CPU, memory, disk and bandwidth; track web application uptime and SSL expiry; run WAN speed tests; discover devices with a network scanner; and receive alerts with configurable thresholds, multi-level escalation and a full Acknowledge/Resolve workflow.',
    points: ['Runs on your own server (Windows or Linux), no cloud needed', 'Multi-level escalation (L1, L2, L3) by email, SMS and voice call', 'Free vendor-issued license, 30-day trial'],
    features: ['Ping, SNMP, SSH, PowerShell and HTTP/HTTPS checks, plus disk usage and service/task status', 'Web application uptime and SSL expiry monitoring', 'Built-in WAN speed test with a live gauge and rate-limit handling', 'TCP and UDP port scanning and device discovery', 'Per-device escalation levels, thresholds and notification timing', 'Acknowledge and Resolve alert workflow with a full audit log', 'Multi-user with Admin and Viewer roles, per-user dashboards', 'AES-encrypted credential storage, backup and restore of device configuration'],
    start: ['Windows: right-click Setup.bat, Run as administrator (installs the service and opens http://localhost:50110)', 'Linux: sudo bash setup.sh', 'Manual: pip install -r requirements.txt, then python app.py'],
    facts: ['Flask and SQLite, no external dependencies', 'Offline Ed25519-signed license keys, tied to one installation (Device ID and Activation Code)', 'No phone-home or cloud authentication'] },
  { slug: 'pc-admin-tools', page: true, title: 'PC Admin Tools', tag: 'Remote administration and performance tuning', icon: 'gear', download: 'https://github.com/InfoXteK/PC_Admin_Tools',
    summary: 'Best basic performance fine-tuning tool for admins and support persons. 36 remote operations run over WinRM against Windows machines, from a desktop app or a browser.',
    points: ['Three editions: Python GUI, Web-Service and PowerShell GUI', '36 remote admin operations with confirmation for sensitive ones', 'Every session logged to a timestamped file'],
    features: ['Same 36 operations and categories across all three editions', 'Sensitive operations (reboot, network interruption, long tasks) need explicit confirmation', 'Test Connection before running; choose the authentication transport', 'Timestamped log for every session', 'Targets need only WinRM enabled (Enable-PSRemoting -Force)'],
    editions: [['Python GUI v2.1', 'Native Tkinter desktop app. Needs Python 3.9+ and pywinrm; double-click install_and_run.bat.'], ['Web-Service v2.1', 'Flask service on port 3030 for a whole subnet. Installs as a real Windows Service or Linux systemd unit. Use a trusted subnet or put it behind HTTPS.'], ['PowerShell GUI v2.7', 'WinForms tool with zero installs, Windows 7 SP1 or later. Run-AdminTool.bat requests administrator rights.']],
    facts: ['Targets must be Windows with WinRM enabled', 'Web edition sends credentials over plain HTTP by default: restrict to a trusted network or add TLS'] },
  { slug: 'ifinex', title: 'iFiNeX', tag: 'Public mobile and web app', icon: 'phone', download: null,
    summary: 'An expense tracker, card payment tracker and squad splitter in one app, for mobile and web.',
    points: ['Expense tracker', 'Card payment tracker', 'Squad splitter for shared costs (formerly Squad Split)'] },
];

export const platformInfo = [
  { slug: 'entra-id', chip: 'Entra ID', name: 'Microsoft Entra ID', tag: 'Cloud identity and access', style: 'fluent', svc: 'cloud-desktop',
    what: 'Microsoft\'s cloud identity service (formerly Azure Active Directory). It signs users in to Microsoft 365, Azure and thousands of other apps, and decides who may access what.',
    security: ['Multi-factor authentication and passwordless sign-in', 'Conditional Access: allow, block or require MFA based on user, device, location and risk', 'Role-based admin roles and privileged identity controls'],
    ai: ['Risk-based sign-in and user-risk detection using machine learning', 'Signals feed Conditional Access so risky sessions are challenged automatically', 'AI-assisted security investigation tools are available in the wider Microsoft security stack'] },
  { slug: 'veeam', chip: 'Veeam', name: 'Veeam Backup & Replication', tag: 'Backup, replication and recovery', style: 'skeuo', svc: 'disaster-recovery',
    what: 'Backup and recovery software for virtual, physical and cloud workloads. It takes image-level restore points, replicates workloads, and can start a failed machine directly from backup.',
    security: ['Immutable and hardened repositories so backups cannot be altered', '3-2-1 copy strategy: three copies, two media, one offsite or offline', 'Encryption of backup data and role-based access'],
    ai: ['Malware and anomaly detection on backup data to spot ransomware activity', 'Helps choose a clean restore point after an attack', 'Automation of recovery testing and reporting'] },
  { slug: 'forcepoint-dlp', chip: 'Forcepoint DLP', name: 'Forcepoint DLP', tag: 'Data loss prevention', style: 'glass', svc: 'cyber-security',
    what: 'Data loss prevention software that finds and classifies sensitive data, then monitors or blocks it as it moves through endpoints, email, web and cloud apps.',
    security: ['Policies for personal data, source code and regulated information', 'Block, encrypt, warn or log when data leaves via USB, email, upload or print', 'Incident review with evidence for investigators'],
    ai: ['Machine-learning classification of unstructured data', 'Risk-adaptive protection that tightens controls as user risk rises', 'Policies that cover data sent to generative AI tools'] },
  { slug: 'sentinelone', chip: 'SentinelOne', name: 'SentinelOne Singularity', tag: 'Endpoint detection and response', style: 'oled', svc: 'cyber-security',
    what: 'An endpoint security platform (EDR/XDR) that watches process behaviour on each device, detects attacks and can respond automatically on the endpoint.',
    security: ['Behavioural detection of malware, ransomware and fileless attacks', 'Automatic kill, quarantine and network isolation of infected hosts', 'Rollback to restore files changed by ransomware on supported systems'],
    ai: ['On-device behavioural AI that works even when the machine is offline', 'AI-assisted threat hunting and investigation', 'Telemetry correlated across endpoints, identity and cloud'] },
];
