// Full detail content for items on Why Choose Us, Industries and Tools & Tips.
// Shape: { intro, points: [[title, text]], example, links: [[label, href]] }
// Rule: no invented clients, figures, certifications or guarantees. Examples are labelled illustrative.
const S = (slug, label) => [label, `/services/${slug}/`];

export const reasonDetails = {
  'Experienced and forward-looking': {
    intro: 'Our work comes from hands-on IT operations across insurance, trading and infrastructure environments, applied to current tools instead of legacy habits.',
    points: [['Hands-on background', 'Daily work with endpoint security, identity, backup, networks and virtual infrastructure, so advice comes from running these systems.'], ['Modern tooling', 'We recommend current platforms such as Entra ID, Intune, Defender, Veeam and EDR/XDR products where they fit your needs.'], ['Plain language', 'Technical findings are explained in terms of risk, cost and next steps.']],
    example: 'Illustrative: a company still using shared admin passwords is moved to named accounts, MFA and privileged access policies in planned steps.',
    links: [S('managed-it', 'Managed IT Services'), S('cyber-security', 'Cyber Security')]
  },
  'Built around you': {
    intro: 'There is no fixed package. We start from your goals, your risks and your budget, then choose only what you need.',
    points: [['Discovery first', 'We review your systems, users, vendors and priorities before proposing anything.'], ['Right-sized', 'Small teams get simple, maintainable setups. Larger teams get segmentation, policy and reporting.'], ['Phased delivery', 'Work is split into steps so you see value early and can adjust the plan.']],
    example: 'Illustrative: a small office needs secure email, backup and device management. We scope those three, not a full enterprise stack.',
    links: [S('support-consulting', 'Support Consulting'), S('cloud-solutions', 'Cloud Solutions')]
  },
  'Proactive support': {
    intro: 'We aim to find problems before they interrupt work: patching, monitoring, backup checks and policy reviews on a regular schedule.',
    points: [['Scheduled maintenance', 'Patch cycles, backup test restores and account reviews are planned, not reactive.'], ['Monitoring', 'Endpoint, server and network health is watched with the tools your environment already uses or that we agree to deploy.'], ['Clear escalation', 'You know who handles what, and how issues are reported and closed.']],
    example: 'Illustrative: a failing backup job is noticed and fixed during a routine review, before anyone needs a restore.',
    links: [S('managed-it', 'Managed IT Services'), S('disaster-recovery', 'Disaster Recovery')]
  },
  'Current with technology': {
    intro: 'We follow new tools, threats and AI capabilities, and recommend them only when they pay off for your situation.',
    points: [['Evidence over hype', 'New products are assessed against your actual needs, risks and cost.'], ['AI with guardrails', 'AI assistants are introduced with data classification, DLP and least-privilege access.'], ['Planned upgrades', 'End-of-life software and hardware are flagged early so replacements are budgeted.']],
    example: 'Illustrative: before staff adopt an AI assistant, sensitive data is labelled and upload policies are set.',
    links: [S('ai-solutions', 'AI Solutions'), S('cyber-security', 'Cyber Security')]
  },
  'Long-term partnership': {
    intro: 'We aim to be the IT team you keep. Documentation, clear communication and steady improvement matter more to us than one-off projects.',
    points: [['Documented work', 'Configurations, decisions and procedures are written down so nothing depends on one person.'], ['Regular reviews', 'We revisit priorities, risks and costs as your business changes.'], ['Honest advice', 'If something is not needed, we say so.']],
    example: 'Illustrative: a yearly review retires unused licences and updates the recovery plan after a system change.',
    links: [['Contact us', '/contact/'], ['Book online', '/book-online/']]
  }
};

export const industryDetails = {
  'Agriculture': {
    intro: 'Farms, processors and supply chains depend on connectivity, scheduling and traceability, often across remote sites.',
    points: [['Typical needs', 'Reliable networking across distributed sites, device management for field staff, backup of records and supplier systems.'], ['Typical risks', 'Weak connectivity, shared devices, ransomware on small unmanaged networks, and downtime in harvest or processing seasons.'], ['How we help', 'Network design, managed devices, offsite backup and a simple recovery plan that fits seasonal operations.']],
    example: 'Illustrative: a processing site with one flat network is segmented so office systems and production equipment are separated, with backups kept offsite.',
    links: [S('network-solutions', 'Network Solutions'), S('disaster-recovery', 'Disaster Recovery'), S('managed-it', 'Managed IT')]
  },
  'Banking & Financial Services': {
    intro: 'Regulated environments need strong identity, data protection, audit trails and tested recovery.',
    points: [['Typical needs', 'Multi-factor authentication, privileged access control, data loss prevention, email security and documented change control.'], ['Typical risks', 'Phishing, insider data leakage, excessive admin rights, and audit findings that are not tracked to closure.'], ['How we help', 'Policy design on platforms such as Entra ID, Forcepoint DLP, EDR/XDR and BeyondTrust, plus vulnerability management and finding remediation tracking.']],
    example: 'Illustrative: an audit finding about shared admin accounts is closed by moving admins to named accounts with rotated, audited credentials.',
    links: [S('cyber-security', 'Cyber Security'), S('support-consulting', 'Support Consulting'), S('disaster-recovery', 'Disaster Recovery')]
  },
  'Education': {
    intro: 'Schools and training providers need stable networks, managed devices and safe access for students and staff.',
    points: [['Typical needs', 'Wi-Fi coverage, device enrolment, account lifecycle for joiners and leavers, and backup of coursework and records.'], ['Typical risks', 'Unmanaged student devices, shared logins, outdated software and limited IT staff.'], ['How we help', 'Intune/Entra-based device and identity management, network design, cloud desktops for labs and a maintainable support process.']],
    example: 'Illustrative: lab PCs are replaced by managed cloud desktops so software is updated once and students log in from any device.',
    links: [S('cloud-desktop', 'Cloud Desktop'), S('network-solutions', 'Network Solutions'), S('managed-it', 'Managed IT')]
  },
  'Energy & Utilities': {
    intro: 'Critical operations need resilient infrastructure, clear recovery targets and careful separation of operational and office systems.',
    points: [['Typical needs', 'Segmented networks, high availability, tested failover, monitoring and strict access control.'], ['Typical risks', 'Single points of failure, flat networks, remote access without strong authentication, and untested recovery.'], ['How we help', 'Disaster recovery planning with RTO and RPO targets, backup with offline or immutable copies, network segmentation and access policies.']],
    example: 'Illustrative: a control-room support system gets a documented failover to a second site and a restore test each quarter.',
    links: [S('disaster-recovery', 'Disaster Recovery'), S('network-solutions', 'Network Solutions'), S('cyber-security', 'Cyber Security')]
  },
  'Government': {
    intro: 'Public-sector teams need careful, compliant IT with clear records and dependable service.',
    points: [['Typical needs', 'Access control, data protection, documented procedures, supplier oversight and dependable support.'], ['Typical risks', 'Legacy systems, data handling mistakes, phishing and limited budgets.'], ['How we help', 'Hardening and patching, DLP and sensitivity labelling, backup and recovery, and consulting that produces written procedures and evidence.']],
    example: 'Illustrative: documents are labelled by sensitivity and outbound sharing policies stop restricted files leaving approved channels.',
    links: [S('cyber-security', 'Cyber Security'), S('support-consulting', 'Support Consulting'), S('hosting-maintenance', 'Hosting & Maintenance')]
  }
};

const T = (why, steps, mistake, links) => ({ intro: why, points: [['Do this', steps[0]], ['Then', steps[1]], ['Check', steps[2]], ['Common mistake', mistake]], links });
export const tipDetails = {
  'Turn on multi-factor authentication': T('Passwords alone are the easiest thing for an attacker to steal or guess. MFA blocks most account takeovers.', ['Start with email, admin accounts and remote access.', 'Prefer an authenticator app or passkey over SMS where possible.', 'Review sign-in logs for accounts without MFA.'], 'Leaving old protocols or service accounts outside the MFA policy.', [S('cyber-security', 'Cyber Security')]),
  'Patch on a schedule': T('Most attacks use known flaws that already have fixes.', ['Set a regular patch window for endpoints and servers.', 'Fix critical and high CVSS findings first.', 'Track exceptions with an owner and a date.'], 'Patching workstations but forgetting servers, firewalls and third-party apps.', [S('managed-it', 'Managed IT Services')]),
  'Treat unexpected links and attachments as suspect': T('Phishing remains a common way into a network.', ['Do not click or open until you verify the sender another way.', 'Report the message using your reporting button or to IT.', 'Use email security filtering for links and attachments.'], 'Deleting the message silently so nobody else is warned.', [S('cyber-security', 'Cyber Security')]),
  'Limit privileged access': T('Admin rights are what attackers want. Fewer admins means a smaller blast radius.', ['Give people only the access their role needs.', 'Use separate admin accounts and rotate privileged credentials.', 'Review admin accounts on a schedule.'], 'Keeping admin rights after a project or role change.', [S('cyber-security', 'Cyber Security'), S('support-consulting', 'Support Consulting')]),
  'Follow 3-2-1': T('One copy of your data is not a backup plan.', ['Keep three copies of important data.', 'Store them on two types of media.', 'Keep one copy offsite.'], 'Storing the backup on the same server or network share as the original.', [S('disaster-recovery', 'Disaster Recovery')]),
  'Keep one copy offline or immutable': T('Ransomware tries to encrypt or delete backups it can reach.', ['Use immutable storage or an offline copy.', 'Separate backup admin credentials from daily admin accounts.', 'Alert on backup deletion attempts.'], 'Assuming a network-connected backup is safe from ransomware.', [S('disaster-recovery', 'Disaster Recovery')]),
  'Test restores, not just backup jobs': T('A green backup job does not prove you can recover.', ['Restore a sample file and a full system on a schedule.', 'Record how long the restore took.', 'Fix and retest anything that failed.'], 'Finding out during an incident that the backup was incomplete.', [S('disaster-recovery', 'Disaster Recovery')]),
  'Write down RTO and RPO': T('Recovery time objective (RTO) is how long a system can be down. Recovery point objective (RPO) is how much data you can lose.', ['List your key systems.', 'Agree an RTO and RPO with the business for each.', 'Check that backup and failover design actually meets them.'], 'Setting targets that the current backup frequency cannot meet.', [S('disaster-recovery', 'Disaster Recovery')]),
  'Keep confidential data out of public AI tools': T('Text pasted into public AI tools may leave your control.', ['Decide which data classes are never allowed.', 'Provide an approved AI tool for staff.', 'Tell staff the rule in plain words and repeat it.'], 'Banning AI with no approved alternative, which pushes use out of sight.', [S('ai-solutions', 'AI Solutions')]),
  'Use DLP to catch sensitive data before it leaves': T('Data loss prevention finds sensitive data in motion and at rest.', ['Classify data (public, internal, confidential, restricted).', 'Set policies for uploads, paste, email and removable media.', 'Review incidents and tune rules.'], 'Turning DLP on in block mode with no testing, then disabling it after complaints.', [S('cyber-security', 'Cyber Security')]),
  'Verify AI output before acting on it': T('AI can sound confident and be wrong.', ['Treat output as a draft.', 'Check figures, sources and legal or contract text.', 'Review and test AI-written code before use.'], 'Sending AI-written content to customers without a human read-through.', [S('ai-solutions', 'AI Solutions')]),
  'Review what AI assistants and agents can access': T('An assistant can only leak what it can reach.', ['Apply least privilege to connected data and tools.', 'Use sensitivity labels so restricted content is excluded.', 'Log and review agent actions.'], 'Giving an assistant access to everything for convenience.', [S('ai-solutions', 'AI Solutions'), S('cyber-security', 'Cyber Security')]),
  'Enrol every device in management': T('Unmanaged devices are blind spots.', ['Enrol laptops and phones in a device management tool such as Intune.', 'Require encryption, screen lock and updates.', 'Remove or restrict anything that will not enrol.'], 'Allowing personal unmanaged devices to reach company data.', [S('managed-it', 'Managed IT Services')]),
  'Use conditional access': T('Access can depend on who, what device, where and how risky the sign-in is.', ['Require MFA for risky or unfamiliar sign-ins.', 'Allow only compliant devices to reach sensitive apps.', 'Block legacy authentication.'], 'Excluding too many accounts from policy and forgetting the exclusions.', [S('cyber-security', 'Cyber Security'), S('cloud-solutions', 'Cloud Solutions')]),
  'Review cloud costs monthly': T('Cloud spend drifts upward quietly.', ['Review the bill and usage monthly.', 'Remove unused or idle resources.', 'Right-size what remains and use tags to assign owners.'], 'Leaving test environments running after a project ends.', [S('cloud-solutions', 'Cloud Solutions')]),
  'Keep an inventory': T('You cannot protect what you do not know you have.', ['List devices, software, licences and owners.', 'Update it when people join, leave or change roles.', 'Use it to plan renewals and replacements.'], 'Keeping the inventory in a file nobody updates.', [S('managed-it', 'Managed IT Services')])
};
