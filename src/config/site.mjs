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
  email: 'infoxtekcorp@gmail.com',        // VERIFY: real company email
  phone: '+971545414237',        // VERIFY: real company phone
  address: 'International City, Dubai.',       // VERIFY: real company address
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

export const platforms = ['Microsoft Azure', 'AWS', 'Alibaba Cloud', 'Microsoft 365', 'Intune', 'Entra ID', 'VMware', 'Hyper-V', 'Veeam', 'Acronis', 'Quorum', 'HPE 3PAR', 'NetApp', 'Forcepoint DLP', 'FortiDLP', 'Taegis XDR', 'Sophos MDR', 'SentinelOne', 'Kaspersky', 'CrowdStrike', 'Microsoft Defender', 'Check Point', 'Proofpoint', 'FortiGate', 'Forcepoint NGFW', 'ClearPass', 'BeyondTrust'];

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
