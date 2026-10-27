// 3D FLOW DEFINITIONS (v3.1.0). Every service, product and platform has its own animated story; reasons, industries and tips are in panelFlows.
// Format: t = title; th = theme [floor, tone, particles, decor]; z = zones [label, col0, row0, col1, row1, tone]; n = nodes [id, kind, label, col, row, tone?];
// l = links [from, to, tone?] (arrows point from -> to); s = steps [title, caption, [node ids], ['from>to', ...], [effects]].
// Effects (shown while the step is active):
//   ['s', 'a>b', style, count?, endFraction?, arc?]  objects travelling from a to b. endFraction < 1 = they are stopped part way and burst (blocked). arc lifts them (flying).
//   ['n', id, state]   node state: fail ok alert scan block hot build ghost
//   ['f', id, fx]      node effect loop: ring radar burst smoke beam spark
//   ['c', id, text, glyph?]  callout (glyph: ok no warn lock up down)       ['b', id, label]  progress bar
// Layout: columns left to right (0-4), rows front to back (0-2). Keep links straight and clear of other nodes. Decor sits in empty cells.
// Kinds: user device phone server db cloud shield lock key gear globe doc mail bell chart code router firewall ai package goal threat clock admin
//        tree turbine bank school gov sensor field plant pylon shop radar vault eye usb wifi coin book
// Tones: info good warn bad ai mute. Everything is an illustration of a typical setup, never live customer data.
import { tipDetails } from './details.mjs';

export const KINDS = ['user', 'device', 'phone', 'server', 'db', 'cloud', 'shield', 'lock', 'key', 'gear', 'globe', 'doc', 'mail', 'bell', 'chart', 'code', 'router', 'firewall', 'ai', 'package', 'goal', 'threat', 'clock', 'admin', 'tree', 'turbine', 'bank', 'school', 'gov', 'sensor', 'field', 'plant', 'pylon', 'shop', 'radar', 'vault', 'eye', 'usb', 'wifi', 'coin', 'book'];
export const TONES = ['info', 'good', 'warn', 'bad', 'ai', 'mute'];
export const FLOORS = ['grid', 'hex', 'circ', 'ring', 'dot', 'wave', 'rows'];
export const PARTS = ['none', 'rain', 'bits', 'sparks', 'embers', 'snow', 'bubbles', 'leaves', 'stars'];
export const STYLES = ['dot', 'bit', 'heart', 'mail', 'tok', 'warn', 'cube', 'coin', 'bad', 'doc'];
export const STATES = ['fail', 'ok', 'alert', 'scan', 'block', 'hot', 'build', 'ghost'];
export const FXS = ['ring', 'radar', 'burst', 'smoke', 'beam', 'spark'];
export const GLYPHS = ['ok', 'no', 'warn', 'lock', 'up', 'down'];

export const flows = {
  // ---------------- services ----------------
  'cloud-solutions': {
    t: 'Cloud solutions', th: ['dot', 'info', 'bubbles', [['cloud', 0, 2, 0.9, 3.3], ['cloud', 1.2, 2.2, 0.7, 3.9]]], z: [['Your site', 0, 1, 0, 1, 'mute'], ['Cloud', 2, 0, 4, 2, 'info']],
    n: [['dc', 'server', 'Current servers', 0, 1], ['as', 'doc', 'Discovery report', 1, 0], ['lz', 'cloud', 'Landing zone', 2, 1], ['wl', 'server', 'Migrated workloads', 3, 0, 'info'], ['bk', 'db', 'Backup copy', 3, 2], ['mo', 'chart', 'Monitoring and cost', 4, 1]],
    l: [['dc', 'as'], ['as', 'lz'], ['dc', 'lz'], ['lz', 'wl'], ['wl', 'mo'], ['wl', 'bk']],
    s: [['Discover', 'Inventory servers, dependencies and data sensitivity so nothing is migrated blind.', ['dc', 'as'], ['dc>as'], [['s', 'dc>as', 'doc', 3], ['f', 'dc', 'radar'], ['c', 'as', 'Dependencies mapped', 'ok']]],
      ['Design', 'Build the landing zone first: identity, network, backup and policy guardrails.', ['as', 'lz'], ['as>lz'], [['s', 'as>lz', 'doc', 2], ['n', 'lz', 'build'], ['c', 'lz', 'Identity, network, policy', 'lock']]],
      ['Migrate', 'Move workloads in planned waves (rehost, replatform or refactor), each with a tested rollback.', ['dc', 'lz', 'wl'], ['dc>lz', 'lz>wl'], [['s', 'dc>lz', 'cube', 4, 1, 1.6], ['s', 'lz>wl', 'cube', 3, 1, 1.0], ['n', 'wl', 'build'], ['b', 'wl', 'Wave 1 of 3']]],
      ['Operate', 'Patching, backups, audits and monthly cost reviews keep the estate healthy and the bill predictable.', ['wl', 'bk', 'mo'], ['wl>bk', 'wl>mo'], [['s', 'wl>bk', 'bit', 4], ['s', 'wl>mo', 'heart', 2], ['n', 'mo', 'ok'], ['c', 'mo', 'Idle resources removed', 'down']]]],
  },
  'cloud-desktop': {
    t: 'Cloud desktop', th: ['circ', 'info', 'bits', [['cloud', 0, 2, 0.9, 3.3]]], z: [['Microsoft cloud', 1, 0, 4, 2, 'info']],
    n: [['dv', 'device', 'Any device', 0, 1], ['id', 'key', 'Sign-in and MFA', 1, 0], ['md', 'gear', 'Device compliance', 1, 2], ['ca', 'shield', 'Access policy', 2, 1], ['vd', 'server', 'Virtual desktop', 3, 1], ['dt', 'db', 'Apps and data', 4, 1]],
    l: [['dv', 'id'], ['id', 'ca'], ['md', 'ca'], ['ca', 'vd'], ['vd', 'dt']],
    s: [['Sign in', 'The user signs in from any device and proves who they are with multi-factor authentication.', ['dv', 'id'], ['dv>id'], [['s', 'dv>id', 'tok', 3], ['n', 'id', 'scan'], ['c', 'id', 'MFA verified', 'ok']]],
      ['Check the device', 'Device management reports whether the device is enrolled and compliant; the access policy weighs both.', ['id', 'md', 'ca'], ['id>ca', 'md>ca'], [['f', 'md', 'radar'], ['s', 'md>ca', 'heart', 2], ['s', 'id>ca', 'tok', 2], ['c', 'md', 'Device compliant', 'ok']]],
      ['Connect', 'If the policy allows it, the session is brokered to the user’s virtual desktop.', ['ca', 'vd'], ['ca>vd'], [['n', 'vd', 'build'], ['s', 'ca>vd', 'cube', 3, 1, 1.2], ['c', 'ca', 'Access granted', 'ok']]],
      ['Work', 'Apps and files stay in the cloud, so a lost laptop does not mean lost data.', ['vd', 'dt'], ['vd>dt'], [['s', 'vd>dt', 'bit', 5], ['f', 'dt', 'ring'], ['c', 'dt', 'Data stays in the cloud', 'lock']]]],
  },
  'managed-it': {
    t: 'Managed IT services', th: ['grid', 'good', 'none', [['clock', 4, 0, 0.9], ['gear', 4, 2, 0.7]]],
    n: [['ep', 'device', 'Users and servers', 0, 1], ['mo', 'eye', 'Monitoring and patching', 1, 0], ['tk', 'mail', 'User ticket', 1, 2], ['al', 'bell', 'Alert raised', 2, 0], ['en', 'user', 'Engineer', 3, 1], ['rp', 'chart', 'Monthly report', 4, 1]],
    l: [['ep', 'mo'], ['ep', 'tk'], ['mo', 'al'], ['al', 'en'], ['tk', 'en'], ['en', 'rp']],
    s: [['Watch', 'Agents watch health, patch levels and backups on every device and server.', ['ep', 'mo'], ['ep>mo'], [['s', 'ep>mo', 'heart', 3], ['n', 'mo', 'scan'], ['b', 'mo', 'Patching']]],
      ['Detect', 'Thresholds and trends raise an alert before users feel the problem.', ['mo', 'al'], ['mo>al'], [['s', 'mo>al', 'warn', 2], ['n', 'al', 'alert'], ['f', 'al', 'ring'], ['c', 'al', 'Disk space low', 'warn']]],
      ['Respond', 'Alerts and user tickets reach an engineer under an agreed response time.', ['ep', 'tk', 'al', 'en'], ['ep>tk', 'tk>en', 'al>en'], [['s', 'ep>tk', 'mail', 2], ['s', 'tk>en', 'mail', 2], ['s', 'al>en', 'warn', 2], ['n', 'en', 'hot'], ['c', 'en', 'Ticket assigned', 'ok']]],
      ['Report', 'Fixes are logged and reviewed every month so recurring problems are removed, not repeated.', ['en', 'rp'], ['en>rp'], [['s', 'en>rp', 'doc', 3], ['n', 'rp', 'ok'], ['c', 'rp', 'Fixed and reviewed', 'ok']]]],
  },
  'network-solutions': {
    t: 'Network solutions', th: ['circ', 'info', 'bits', [['wifi', 0, 2, 0.8], ['router', 4, 0, 0.8]]],
    n: [['dv', 'device', 'Devices', 0, 1], ['sw', 'router', 'Access switch', 1, 1], ['na', 'lock', 'Network access control', 2, 0], ['qt', 'lock', 'Quarantine VLAN', 2, 2, 'warn'], ['fw', 'firewall', 'Next-generation firewall', 3, 1], ['nt', 'globe', 'Internet and cloud', 4, 1]],
    l: [['dv', 'sw'], ['sw', 'na'], ['sw', 'qt', 'warn'], ['na', 'fw'], ['fw', 'nt']],
    s: [['Connect', 'A device plugs in or joins Wi-Fi and the switch asks it to authenticate (802.1X).', ['dv', 'sw'], ['dv>sw'], [['s', 'dv>sw', 'bit', 4], ['n', 'sw', 'scan'], ['c', 'sw', '802.1X challenge', 'lock']]],
      ['Decide', 'Network access control checks who the user is and whether the device is compliant.', ['sw', 'na'], ['sw>na'], [['s', 'sw>na', 'tok', 3], ['f', 'na', 'radar'], ['c', 'na', 'Identity and compliance', 'ok']]],
      ['Segment', 'Known, healthy devices get the right VLAN; unknown or failing devices are sent to quarantine.', ['sw', 'na', 'qt'], ['sw>na', 'sw>qt'], [['s', 'sw>na', 'tok', 2], ['s', 'sw>qt', 'warn', 3], ['n', 'qt', 'alert'], ['c', 'qt', 'Unknown device isolated', 'no']]],
      ['Protect', 'Traffic to the internet and cloud passes the firewall with inspection and logging.', ['na', 'fw', 'nt'], ['na>fw', 'fw>nt'], [['s', 'na>fw', 'bit', 5], ['s', 'fw>nt', 'bit', 5], ['n', 'fw', 'hot'], ['c', 'fw', 'Inspected and logged', 'ok']]]],
  },
  'disaster-recovery': {
    t: 'Disaster recovery', th: ['grid', 'bad', 'rain', [['cloud', 0, 0, 1.2, 3.6], ['cloud', 1, 2, 0.9, 3.3]]], z: [['Primary site', 2, 0, 3, 0, 'info'], ['DR site', 2, 2, 3, 2, 'good']],
    n: [['us', 'user', 'Users', 0, 1], ['tm', 'globe', 'Traffic manager', 1, 1], ['a', 'server', 'Primary systems', 2, 0], ['s', 'db', 'Primary storage', 3, 0], ['d', 'server', 'DR systems', 2, 2, 'good'], ['r', 'db', 'DR replica', 3, 2, 'good']],
    l: [['us', 'tm'], ['tm', 'a'], ['a', 's'], ['s', 'r'], ['tm', 'd', 'good'], ['r', 'd', 'good']],
    s: [['Normal service', 'Users reach the primary site through the traffic manager.', ['us', 'tm', 'a', 's'], ['us>tm', 'tm>a', 'a>s'], [['s', 'us>tm', 'dot', 3], ['s', 'tm>a', 'dot', 3], ['s', 'a>s', 'bit', 4], ['n', 'a', 'ok'], ['c', 'a', 'Primary site serving', 'ok']]],
      ['Replicate', 'Data is copied to the DR site at an interval set by your recovery point objective (RPO).', ['s', 'r'], ['s>r'], [['s', 's>r', 'cube', 4, 1, 1.2], ['b', 'r', 'Replicating'], ['c', 's', 'Copied at the RPO interval', 'ok']]],
      ['Detect failure', 'Health checks fail and the traffic manager marks the primary site as down.', ['tm', 'a'], ['tm>a'], [['n', 'a', 'fail'], ['f', 'a', 'smoke'], ['f', 'a', 'spark'], ['s', 'tm>a', 'heart', 2, 0.7], ['c', 'a', 'Health check fails', 'no']]],
      ['Fail over', 'Traffic is redirected to the DR systems running on the replica, within your recovery time objective (RTO).', ['us', 'tm', 'd', 'r'], ['us>tm', 'tm>d', 'r>d'], [['n', 'd', 'ok'], ['s', 'us>tm', 'dot', 3], ['s', 'tm>d', 'dot', 3], ['s', 'r>d', 'cube', 3, 1, 1.0], ['f', 'd', 'ring'], ['c', 'd', 'Service restored within RTO', 'ok']]]],
  },
  'cyber-security': {
    t: 'Cyber security', th: ['ring', 'bad', 'embers', [['radar', 4, 0, 0.8], ['eye', 4, 2, 0.8]]],
    n: [['th', 'threat', 'Attacker', 0, 1], ['fw', 'firewall', 'Firewall and email filter', 1, 1], ['ep', 'device', 'Endpoint protection', 2, 0], ['dl', 'lock', 'Data loss prevention', 2, 2], ['xd', 'chart', 'Detection and logs', 3, 1], ['sc', 'user', 'Response team', 4, 1]],
    l: [['th', 'fw', 'bad'], ['fw', 'ep'], ['fw', 'dl'], ['ep', 'xd'], ['dl', 'xd'], ['xd', 'sc']],
    s: [['Prevent', 'Email filtering, firewall rules and patching stop most attacks at the edge.', ['th', 'fw'], ['th>fw'], [['s', 'th>fw', 'bad', 4, 0.62], ['n', 'fw', 'block'], ['c', 'fw', 'Attacks blocked', 'no']]],
      ['Contain', 'Endpoint protection blocks or isolates whatever gets past the edge.', ['fw', 'ep'], ['fw>ep'], [['s', 'fw>ep', 'bad', 2, 0.6], ['n', 'ep', 'scan'], ['f', 'ep', 'radar'], ['c', 'ep', 'Threat isolated', 'lock']]],
      ['Protect data', 'Data loss prevention stops sensitive files leaving by email, web upload or USB.', ['fw', 'dl'], ['fw>dl'], [['s', 'fw>dl', 'doc', 3, 0.78], ['n', 'dl', 'hot'], ['c', 'dl', 'Upload blocked', 'no']]],
      ['Detect and respond', 'Signals from every layer are correlated in one place and a person acts on them.', ['ep', 'dl', 'xd', 'sc'], ['ep>xd', 'dl>xd', 'xd>sc'], [['s', 'ep>xd', 'warn', 2], ['s', 'dl>xd', 'warn', 2], ['s', 'xd>sc', 'warn', 2], ['n', 'xd', 'hot'], ['f', 'xd', 'ring'], ['c', 'sc', 'Incident handled', 'ok']]]],
  },
  'support-consulting': {
    t: 'Support consulting', th: ['dot', 'ai', 'none', [['book', 0, 2, 0.9], ['goal', 4, 0, 0.8]]],
    n: [['bg', 'goal', 'Business goals', 0, 1], ['as', 'doc', 'IT assessment', 1, 0], ['rm', 'doc', 'Roadmap and budget', 2, 1], ['dl', 'gear', 'Guided delivery', 3, 0], ['kp', 'chart', 'Review and KPIs', 4, 1]],
    l: [['bg', 'as'], ['as', 'rm'], ['rm', 'dl'], ['dl', 'kp']],
    s: [['Understand', 'Start from what the business needs to achieve, not from the technology.', ['bg'], [], [['f', 'bg', 'ring'], ['n', 'bg', 'hot'], ['c', 'bg', 'Goals come first', 'ok']]],
      ['Assess', 'Review today’s systems, risks and costs against those goals.', ['bg', 'as'], ['bg>as'], [['s', 'bg>as', 'doc', 3], ['f', 'as', 'radar'], ['c', 'as', 'Risks and costs reviewed', 'warn']]],
      ['Plan', 'Turn the findings into a prioritised roadmap with a realistic budget.', ['as', 'rm'], ['as>rm'], [['s', 'as>rm', 'doc', 3], ['n', 'rm', 'build'], ['c', 'rm', 'Prioritised roadmap', 'ok']]],
      ['Support and review', 'Guide delivery, then measure results against agreed indicators.', ['rm', 'dl', 'kp'], ['rm>dl', 'dl>kp'], [['s', 'rm>dl', 'cube', 3], ['s', 'dl>kp', 'bit', 4], ['b', 'dl', 'Delivery'], ['c', 'kp', 'Results measured', 'up']]]],
  },
  'web-applications': {
    t: 'Web applications', th: ['grid', 'info', 'bits', [['globe', 0, 0, 0.8], ['server', 4, 0, 0.8]]],
    n: [['us', 'user', 'Visitor', 0, 1], ['cd', 'globe', 'CDN and firewall', 1, 1], ['au', 'lock', 'Sign-in and roles', 2, 0], ['ap', 'code', 'Web application', 2, 1], ['mo', 'chart', 'Logs and alerts', 2, 2], ['db', 'db', 'Database', 3, 1]],
    l: [['us', 'cd'], ['cd', 'ap'], ['au', 'ap'], ['ap', 'db'], ['ap', 'mo']],
    s: [['Request', 'Visitors reach the nearest edge, which filters bad traffic and serves cached content.', ['us', 'cd'], ['us>cd'], [['s', 'us>cd', 'dot', 3], ['s', 'us>cd', 'bad', 2, 0.62], ['n', 'cd', 'block'], ['c', 'cd', 'Bad traffic filtered', 'no']]],
      ['Authenticate', 'The application checks who the user is and what they are allowed to do.', ['cd', 'au', 'ap'], ['cd>ap', 'au>ap'], [['s', 'cd>ap', 'dot', 3], ['s', 'au>ap', 'tok', 2], ['n', 'au', 'scan'], ['c', 'au', 'Role checked', 'lock']]],
      ['Process', 'Business logic runs and data is read or written with validated, parameterised queries.', ['ap', 'db'], ['ap>db'], [['s', 'ap>db', 'bit', 5], ['n', 'db', 'hot'], ['c', 'db', 'Parameterised queries', 'ok']]],
      ['Observe', 'Logs, metrics and alerts show problems before users report them.', ['ap', 'mo'], ['ap>mo'], [['s', 'ap>mo', 'heart', 2], ['n', 'mo', 'ok'], ['f', 'mo', 'ring'], ['c', 'mo', 'Alerts before users notice', 'warn']]]],
  },
  'mobile-applications': {
    t: 'Mobile applications', th: ['dot', 'good', 'bubbles', [['wifi', 0, 0, 0.8], ['cloud', 4, 1, 0.9, 3.3]]],
    n: [['ph', 'phone', 'Mobile app', 0, 1], ['gw', 'router', 'API gateway', 1, 1], ['au', 'lock', 'Authentication', 2, 0], ['be', 'code', 'Backend services', 2, 2], ['db', 'db', 'Database', 3, 2], ['pn', 'bell', 'Push notifications', 3, 0]],
    l: [['ph', 'gw'], ['gw', 'au'], ['gw', 'be'], ['be', 'db'], ['be', 'pn']],
    s: [['Launch', 'The app talks to one API gateway over HTTPS.', ['ph', 'gw'], ['ph>gw'], [['s', 'ph>gw', 'dot', 3], ['n', 'gw', 'scan'], ['c', 'gw', 'HTTPS only', 'lock']]],
      ['Sign in', 'Short-lived tokens, not stored passwords, prove who the user is.', ['gw', 'au'], ['gw>au'], [['s', 'gw>au', 'tok', 2], ['n', 'au', 'scan'], ['c', 'au', 'Short-lived token', 'ok']]],
      ['Work', 'Backend services apply the business rules and store the data.', ['gw', 'be', 'db'], ['gw>be', 'be>db'], [['s', 'gw>be', 'dot', 3], ['s', 'be>db', 'bit', 4], ['n', 'db', 'hot'], ['c', 'db', 'Data saved', 'ok']]],
      ['Notify', 'Push notifications bring users back with relevant updates.', ['be', 'pn'], ['be>pn'], [['s', 'be>pn', 'mail', 2], ['n', 'pn', 'alert'], ['f', 'pn', 'ring'], ['c', 'pn', 'Push delivered', 'ok']]]],
  },
  'web-design-development': {
    t: 'Website design and development', th: ['grid', 'info', 'none', [['doc', 0, 2, 0.8], ['code', 4, 2, 0.8]]],
    n: [['br', 'doc', 'Brief and content', 0, 1], ['wf', 'device', 'Wireframes', 1, 0], ['ds', 'code', 'Visual design', 2, 1], ['bd', 'gear', 'Build and test', 3, 0], ['lv', 'globe', 'Launch and hosting', 4, 1]],
    l: [['br', 'wf'], ['wf', 'ds'], ['ds', 'bd'], ['bd', 'lv']],
    s: [['Brief', 'Agree goals, audience and content before anything is drawn.', ['br'], [], [['n', 'br', 'hot'], ['f', 'br', 'ring'], ['c', 'br', 'Goals and content', 'ok']]],
      ['Wireframe', 'Sketch the structure and page flow so decisions are cheap to change.', ['br', 'wf'], ['br>wf'], [['s', 'br>wf', 'doc', 3], ['n', 'wf', 'ghost'], ['c', 'wf', 'Structure before looks', 'ok']]],
      ['Design and build', 'Apply the visual design, then build it to be fast, accessible and easy to edit.', ['wf', 'ds', 'bd'], ['wf>ds', 'ds>bd'], [['s', 'wf>ds', 'doc', 3], ['n', 'ds', 'build'], ['s', 'ds>bd', 'cube', 3], ['n', 'bd', 'build'], ['b', 'bd', 'Building']]],
      ['Launch', 'Test on real devices, go live and hand over with documentation.', ['bd', 'lv'], ['bd>lv'], [['s', 'bd>lv', 'cube', 3, 1, 1.3], ['f', 'lv', 'beam'], ['f', 'lv', 'ring'], ['c', 'lv', 'Live', 'up']]]],
  },
  'seo': {
    t: 'Search engine optimisation', th: ['ring', 'good', 'stars', [['globe', 0, 2, 0.8], ['eye', 4, 2, 0.8]]],
    n: [['au', 'doc', 'Technical audit', 0, 1], ['kw', 'chart', 'Keyword research', 1, 0], ['op', 'code', 'On-page fixes', 2, 1], ['ct', 'doc', 'Content and links', 3, 0], ['rp', 'chart', 'Rankings and reports', 4, 1]],
    l: [['au', 'kw'], ['kw', 'op'], ['op', 'ct'], ['ct', 'rp']],
    s: [['Audit', 'Crawl the site for errors, slow pages and indexing problems.', ['au'], [], [['f', 'au', 'radar'], ['n', 'au', 'scan'], ['c', 'au', 'Errors and slow pages', 'warn']]],
      ['Research', 'Find the phrases customers actually search for and what they intend.', ['au', 'kw'], ['au>kw'], [['s', 'au>kw', 'bit', 5], ['n', 'kw', 'scan'], ['c', 'kw', 'Search intent mapped', 'ok']]],
      ['Optimise', 'Fix titles, structure and internal links so pages match those searches.', ['kw', 'op'], ['kw>op'], [['s', 'kw>op', 'doc', 3], ['n', 'op', 'build'], ['c', 'op', 'Titles and links fixed', 'ok']]],
      ['Earn and measure', 'Publish useful content, earn links and track rankings and enquiries over time.', ['op', 'ct', 'rp'], ['op>ct', 'ct>rp'], [['s', 'op>ct', 'doc', 3], ['s', 'ct>rp', 'bit', 5], ['n', 'rp', 'hot'], ['c', 'rp', 'Rankings rising', 'up']]]],
  },
  'digital-marketing': {
    t: 'Digital marketing', th: ['wave', 'warn', 'sparks', [['mail', 0, 0, 0.8], ['coin', 4, 0, 0.8]]],
    n: [['au', 'user', 'Target audience', 0, 1], ['ch', 'mail', 'Channels', 1, 0], ['lp', 'globe', 'Landing pages', 2, 1], ['ld', 'goal', 'Leads and sales', 3, 0], ['an', 'chart', 'Analytics', 4, 1]],
    l: [['au', 'ch'], ['ch', 'lp'], ['lp', 'ld'], ['ld', 'an']],
    s: [['Define', 'Decide who you want to reach and what you want them to do.', ['au'], [], [['f', 'au', 'ring'], ['c', 'au', 'Who and why', 'ok']]],
      ['Reach', 'Use the channels where that audience already is: search, social and email.', ['au', 'ch'], ['au>ch'], [['s', 'au>ch', 'mail', 4], ['n', 'ch', 'hot'], ['c', 'ch', 'Search, social, email', 'ok']]],
      ['Convert', 'Send visitors to a focused page with one clear next step.', ['ch', 'lp', 'ld'], ['ch>lp', 'lp>ld'], [['s', 'ch>lp', 'dot', 5], ['s', 'lp>ld', 'coin', 3], ['n', 'ld', 'ok'], ['c', 'ld', 'Lead captured', 'ok']]],
      ['Measure', 'Track what works, drop what does not and put the budget where it pays back.', ['ld', 'an'], ['ld>an'], [['s', 'ld>an', 'bit', 5], ['n', 'an', 'hot'], ['c', 'an', 'Budget follows results', 'up']]]],
  },
  'full-stack-apps': {
    t: 'Full stack applications', th: ['circ', 'ai', 'bits', [['server', 4, 0, 0.8], ['db', 4, 2, 0.8]]], z: [['Cloud hosting', 1, 0, 3, 0, 'info']],
    n: [['fe', 'code', 'Front end', 0, 0], ['ap', 'router', 'API', 1, 0], ['sv', 'gear', 'Services', 2, 0], ['db', 'db', 'Database', 3, 0], ['dv', 'user', 'Developers', 0, 2], ['ci', 'gear', 'CI/CD pipeline', 1, 2]],
    l: [['dv', 'ci'], ['ci', 'ap'], ['fe', 'ap'], ['ap', 'sv'], ['sv', 'db']],
    s: [['Build', 'Developers commit code and the pipeline builds it automatically.', ['dv', 'ci'], ['dv>ci'], [['s', 'dv>ci', 'doc', 3], ['n', 'ci', 'hot'], ['c', 'ci', 'Commit starts a build', 'ok']]],
      ['Test and deploy', 'Automated tests gate every release before it reaches the hosted environment.', ['ci', 'ap'], ['ci>ap'], [['s', 'ci>ap', 'cube', 3, 1, 1.2], ['b', 'ci', 'Tests'], ['c', 'ap', 'Release gated by tests', 'lock']]],
      ['Serve', 'The front end calls the API, which hands requests to the services behind it.', ['fe', 'ap', 'sv'], ['fe>ap', 'ap>sv'], [['s', 'fe>ap', 'dot', 3], ['s', 'ap>sv', 'dot', 3], ['n', 'ap', 'ok']]],
      ['Store', 'Services read and write the database, which is backed up and monitored.', ['sv', 'db'], ['sv>db'], [['s', 'sv>db', 'bit', 5], ['n', 'db', 'hot'], ['c', 'db', 'Backed up and monitored', 'ok']]]],
  },
  'ecommerce': {
    t: 'E-commerce development', th: ['dot', 'warn', 'none', [['shop', 0, 0, 0.9], ['package', 4, 2, 0.8]]],
    n: [['sh', 'user', 'Shopper', 0, 1], ['st', 'code', 'Storefront', 1, 1], ['ca', 'doc', 'Cart and checkout', 2, 0], ['pg', 'lock', 'Payment provider', 3, 0], ['od', 'db', 'Orders and stock', 3, 2], ['fu', 'package', 'Fulfilment', 4, 1]],
    l: [['sh', 'st'], ['st', 'ca'], ['ca', 'pg'], ['pg', 'od'], ['od', 'fu']],
    s: [['Browse', 'The shopper finds products on a fast, mobile-friendly storefront.', ['sh', 'st'], ['sh>st'], [['s', 'sh>st', 'dot', 3], ['n', 'st', 'hot'], ['c', 'st', 'Fast on mobile', 'ok']]],
      ['Check out', 'The cart and checkout collect the order with as few steps as possible.', ['st', 'ca'], ['st>ca'], [['s', 'st>ca', 'cube', 2], ['n', 'ca', 'hot'], ['c', 'ca', 'Few steps to pay', 'ok']]],
      ['Pay', 'Card details go straight to the payment provider; the shop keeps only a token.', ['ca', 'pg'], ['ca>pg'], [['s', 'ca>pg', 'coin', 3], ['n', 'pg', 'scan'], ['c', 'pg', 'Card data never stored', 'lock']]],
      ['Fulfil', 'A confirmed payment creates the order, updates stock and triggers delivery.', ['pg', 'od', 'fu'], ['pg>od', 'od>fu'], [['s', 'pg>od', 'doc', 2], ['s', 'od>fu', 'cube', 3], ['n', 'fu', 'ok'], ['c', 'fu', 'Order on its way', 'ok']]]],
  },
  'hosting-maintenance': {
    t: 'Hosting and maintenance', th: ['hex', 'info', 'none', [['server', 0, 0, 0.8], ['clock', 4, 0, 0.8]]],
    n: [['vi', 'user', 'Visitors', 0, 1], ['cd', 'globe', 'CDN edge', 1, 1], ['ws', 'server', 'Web server', 2, 0], ['bk', 'db', 'Daily backups', 2, 2], ['mo', 'bell', 'Monitoring and alerts', 3, 1], ['up', 'gear', 'Updates and patching', 4, 1]],
    l: [['vi', 'cd'], ['cd', 'ws'], ['ws', 'bk'], ['ws', 'mo'], ['mo', 'up']],
    s: [['Serve', 'Visitors are served from the nearest edge, with the origin server behind it.', ['vi', 'cd', 'ws'], ['vi>cd', 'cd>ws'], [['s', 'vi>cd', 'dot', 3], ['s', 'cd>ws', 'dot', 3], ['n', 'ws', 'ok'], ['c', 'cd', 'Cached near the visitor', 'ok']]],
      ['Back up', 'The site and its data are copied on a schedule, and restores are tested.', ['ws', 'bk'], ['ws>bk'], [['s', 'ws>bk', 'cube', 3], ['b', 'bk', 'Nightly backup'], ['c', 'bk', 'Restore tested', 'ok']]],
      ['Monitor', 'Uptime, speed and certificates are watched and problems raise an alert.', ['ws', 'mo'], ['ws>mo'], [['s', 'ws>mo', 'heart', 3], ['n', 'mo', 'alert'], ['f', 'mo', 'ring'], ['c', 'mo', 'Certificate expiring', 'warn']]],
      ['Maintain', 'Updates and security patches are applied on a planned schedule.', ['mo', 'up'], ['mo>up'], [['s', 'mo>up', 'bit', 4], ['n', 'up', 'hot'], ['c', 'up', 'Patched on schedule', 'ok']]]],
  },
  'ai-solutions': {
    t: 'AI solutions', th: ['hex', 'ai', 'bits', [['eye', 0, 0, 0.8], ['book', 4, 2, 0.8]]],
    n: [['dt', 'db', 'Approved company data', 0, 1], ['gr', 'lock', 'Access and DLP guardrails', 1, 1], ['ai', 'ai', 'AI model', 2, 0], ['lg', 'doc', 'Audit log', 2, 2], ['rv', 'user', 'Human review', 3, 1], ['ou', 'goal', 'Decision or output', 4, 1]],
    l: [['dt', 'gr'], ['gr', 'ai'], ['gr', 'lg'], ['ai', 'rv'], ['ai', 'lg'], ['rv', 'ou']],
    s: [['Use approved data', 'Only data you have approved is made available, and access follows existing permissions.', ['dt', 'gr'], ['dt>gr'], [['s', 'dt>gr', 'doc', 3], ['n', 'gr', 'scan'], ['c', 'gr', 'Only approved data', 'lock']]],
      ['Ask', 'Prompts and retrieved context pass through guardrails that mask sensitive data.', ['gr', 'ai'], ['gr>ai'], [['s', 'gr>ai', 'tok', 2], ['n', 'ai', 'hot'], ['f', 'ai', 'ring'], ['c', 'gr', 'Sensitive data masked', 'ok']]],
      ['Review', 'A person checks the output before it is used for anything important.', ['ai', 'rv', 'ou'], ['ai>rv', 'rv>ou'], [['s', 'ai>rv', 'mail', 2], ['s', 'rv>ou', 'dot', 2], ['n', 'rv', 'hot'], ['c', 'rv', 'A person checks it', 'ok']]],
      ['Audit', 'Prompts, access and outputs are logged so use can be reviewed and improved.', ['gr', 'ai', 'lg'], ['gr>lg', 'ai>lg'], [['s', 'gr>lg', 'bit', 4], ['s', 'ai>lg', 'bit', 4], ['n', 'lg', 'ok'], ['c', 'lg', 'Every prompt logged', 'ok']]]],
  },
  // ---------------- products ----------------
  'net-monit': {
    t: 'Net-Monit', th: ['wave', 'good', 'none', [['eye', 0, 0, 0.8], ['wifi', 0, 2, 0.7]]],
    n: [['dv', 'router', 'Devices and web apps', 0, 1], ['mn', 'gear', 'Net-Monit checks', 1, 1], ['th', 'chart', 'Thresholds', 2, 0], ['db', 'db', 'History and audit log', 2, 2], ['es', 'bell', 'Escalation levels', 3, 0], ['ds', 'device', 'Dashboards', 3, 2], ['us', 'user', 'Admin on call', 4, 1]],
    l: [['dv', 'mn'], ['mn', 'th'], ['mn', 'db'], ['th', 'es'], ['es', 'us'], ['db', 'ds'], ['us', 'db']],
    s: [['Check', 'Ping, SNMP, SSH, PowerShell and HTTP checks run on the schedule you set.', ['dv', 'mn'], ['dv>mn'], [['s', 'dv>mn', 'heart', 3], ['n', 'mn', 'scan'], ['c', 'mn', 'Ping, SNMP, SSH, HTTP', 'ok']]],
      ['Compare', 'Results are stored and compared with the thresholds set for each device.', ['mn', 'th', 'db'], ['mn>th', 'mn>db'], [['s', 'mn>th', 'bit', 4], ['s', 'mn>db', 'bit', 4], ['n', 'th', 'hot'], ['c', 'th', 'Per-device thresholds', 'ok']]],
      ['Escalate', 'A breach raises an alert that escalates through the levels you define.', ['th', 'es', 'us'], ['th>es', 'es>us'], [['n', 'es', 'alert'], ['f', 'es', 'ring'], ['s', 'th>es', 'warn', 2], ['s', 'es>us', 'warn', 3], ['c', 'es', 'Level 1, then 2, then 3', 'warn']]],
      ['Resolve', 'Someone acknowledges and resolves the alert; every step is kept in the audit log.', ['us', 'db', 'ds'], ['us>db', 'db>ds'], [['s', 'us>db', 'doc', 2], ['s', 'db>ds', 'bit', 4], ['n', 'ds', 'ok'], ['c', 'db', 'Audit log kept', 'ok']]]],
  },
  'pc-admin-tools': {
    t: 'PC Admin Tools', th: ['grid', 'info', 'none', [['device', 4, 0, 0.7], ['device', 4, 2, 0.7]]],
    n: [['ad', 'user', 'Admin or support person', 0, 1], ['ap', 'code', 'Desktop or web app', 1, 1], ['cf', 'lock', 'Confirmation', 2, 0, 'warn'], ['lg', 'doc', 'Timestamped log', 2, 2], ['wr', 'router', 'WinRM', 3, 1], ['pc', 'device', 'Windows PCs', 4, 1]],
    l: [['ad', 'ap'], ['ap', 'cf'], ['cf', 'wr'], ['wr', 'pc'], ['ap', 'lg']],
    s: [['Choose', 'Pick one of the 36 operations; the same list exists in all three editions.', ['ad', 'ap'], ['ad>ap'], [['s', 'ad>ap', 'dot', 3], ['n', 'ap', 'hot'], ['c', 'ap', 'One of 36 operations', 'ok']]],
      ['Confirm', 'Sensitive operations such as a reboot or network interruption ask for explicit confirmation.', ['ap', 'cf'], ['ap>cf'], [['s', 'ap>cf', 'warn', 2], ['n', 'cf', 'alert'], ['f', 'cf', 'ring'], ['c', 'cf', 'Reboot? Confirm first', 'warn']]],
      ['Run over WinRM', 'The operation runs remotely on each target; only WinRM needs to be enabled there. Use Test Connection first.', ['cf', 'wr', 'pc'], ['cf>wr', 'wr>pc'], [['s', 'cf>wr', 'cube', 3], ['s', 'wr>pc', 'cube', 3, 1, 0.8], ['n', 'pc', 'hot'], ['f', 'pc', 'ring'], ['c', 'pc', 'Result returned', 'ok']]],
      ['Log', 'Every session is written to a timestamped log.', ['ap', 'lg'], ['ap>lg'], [['s', 'ap>lg', 'doc', 3], ['n', 'lg', 'ok'], ['c', 'lg', 'Timestamped log', 'ok']]]],
  },
  'ifinex': {
    t: 'iFiNeX', th: ['dot', 'good', 'bubbles', [['coin', 0, 0, 0.8], ['coin', 4, 0, 0.8], ['coin', 4, 2, 0.8]]],
    n: [['us', 'user', 'You', 0, 1], ['ap', 'phone', 'iFiNeX app', 1, 1], ['ex', 'chart', 'Expense tracker', 2, 0], ['cd', 'doc', 'Card payment tracker', 2, 1], ['sq', 'user', 'Squad splitter', 2, 2], ['sm', 'goal', 'Clear picture of your money', 3, 1]],
    l: [['us', 'ap'], ['ap', 'ex'], ['ap', 'cd'], ['ap', 'sq'], ['ex', 'sm'], ['cd', 'sm'], ['sq', 'sm']],
    s: [['Open the app', 'Use iFiNeX on mobile or on the web.', ['us', 'ap'], ['us>ap'], [['s', 'us>ap', 'dot', 3], ['n', 'ap', 'hot'], ['c', 'ap', 'Mobile or web', 'ok']]],
      ['Track expenses', 'Record what you spend and see where it goes.', ['ap', 'ex'], ['ap>ex'], [['s', 'ap>ex', 'coin', 3], ['n', 'ex', 'hot'], ['c', 'ex', 'Spend by category', 'up']]],
      ['Track card payments', 'Keep card payments in one place so none are missed.', ['ap', 'cd'], ['ap>cd'], [['s', 'ap>cd', 'doc', 3], ['n', 'cd', 'hot'], ['c', 'cd', 'No payment missed', 'ok']]],
      ['Split with a squad', 'Share costs with friends or housemates and see who owes what.', ['ap', 'sq'], ['ap>sq'], [['s', 'ap>sq', 'coin', 3], ['s', 'sq>ap', 'coin', 2], ['n', 'sq', 'hot'], ['c', 'sq', 'Who owes what', 'ok']]],
      ['See the summary', 'All three feed one clear picture of your money.', ['ex', 'cd', 'sq', 'sm'], ['ex>sm', 'cd>sm', 'sq>sm'], [['s', 'ex>sm', 'bit', 4], ['s', 'cd>sm', 'bit', 4], ['s', 'sq>sm', 'bit', 4], ['n', 'sm', 'ok'], ['f', 'sm', 'ring']]]],
  },
  // ---------------- platforms ----------------
  'entra-id': {
    t: 'Microsoft Entra ID', th: ['circ', 'info', 'bits', [['cloud', 0, 0, 0.8, 3.3], ['lock', 4, 0, 0.7], ['key', 4, 2, 0.7]]],
    n: [['us', 'user', 'User', 0, 1], ['sg', 'key', 'Sign-in and MFA', 1, 1], ['rk', 'ai', 'Sign-in risk', 2, 0], ['dv', 'device', 'Device state', 2, 2], ['ca', 'shield', 'Conditional Access', 3, 1], ['ap', 'cloud', 'Apps', 4, 1]],
    l: [['us', 'sg'], ['sg', 'ca'], ['rk', 'ca'], ['dv', 'ca'], ['ca', 'ap']],
    s: [['Sign in', 'The user signs in, using multi-factor or passwordless authentication.', ['us', 'sg'], ['us>sg'], [['s', 'us>sg', 'tok', 3], ['n', 'sg', 'scan'], ['c', 'sg', 'MFA or passwordless', 'lock']]],
      ['Assess', 'Conditional Access weighs the user, the device, the location and the sign-in risk.', ['sg', 'rk', 'dv', 'ca'], ['sg>ca', 'rk>ca', 'dv>ca'], [['s', 'sg>ca', 'tok', 2], ['s', 'rk>ca', 'heart', 2], ['s', 'dv>ca', 'heart', 2], ['f', 'ca', 'radar'], ['c', 'ca', 'User, device, risk', 'ok']]],
      ['Decide', 'The result is to allow, require more proof, or block, before any app is reached.', ['ca', 'ap'], ['ca>ap'], [['n', 'ca', 'hot'], ['s', 'ca>ap', 'tok', 3], ['n', 'ap', 'ok'], ['c', 'ca', 'Allow, ask for MFA or block', 'ok']]]],
  },
  'veeam': {
    t: 'Veeam Backup and Replication', th: ['hex', 'good', 'none', [['vault', 0, 0, 0.8], ['clock', 0, 2, 0.8]]],
    n: [['wl', 'server', 'Virtual, physical and cloud workloads', 0, 1], ['jb', 'gear', 'Backup job', 1, 1], ['rp', 'db', 'Hardened repository', 2, 1], ['of', 'cloud', 'Offsite or offline copy', 3, 0], ['ck', 'ai', 'Malware and anomaly scan', 3, 2], ['rc', 'server', 'Restore or run from backup', 4, 1, 'good']],
    l: [['wl', 'jb'], ['jb', 'rp'], ['rp', 'of'], ['rp', 'ck'], ['rp', 'rc', 'good']],
    s: [['Protect', 'A backup job takes image-level restore points of each workload.', ['wl', 'jb'], ['wl>jb'], [['s', 'wl>jb', 'cube', 4], ['n', 'jb', 'hot'], ['c', 'jb', 'Image-level backup', 'ok']]],
      ['Store', 'Restore points are kept in a hardened repository so they cannot be altered.', ['jb', 'rp'], ['jb>rp'], [['s', 'jb>rp', 'cube', 3], ['n', 'rp', 'scan'], ['c', 'rp', 'Cannot be altered', 'lock']]],
      ['Copy and verify', 'A further copy goes offsite or offline (the 3-2-1 rule) and backup data is checked for ransomware signs.', ['rp', 'of', 'ck'], ['rp>of', 'rp>ck'], [['s', 'rp>of', 'cube', 3, 1, 1.2], ['s', 'rp>ck', 'bit', 4], ['f', 'ck', 'radar'], ['c', 'of', 'Offsite copy (3-2-1)', 'ok']]],
      ['Recover', 'Choose a clean restore point and restore, or start the machine directly from backup.', ['rp', 'rc'], ['rp>rc'], [['s', 'rp>rc', 'cube', 3], ['n', 'rc', 'ok'], ['f', 'rc', 'ring'], ['c', 'rc', 'Running from backup', 'up']]]],
  },
  'forcepoint-dlp': {
    t: 'Forcepoint DLP', th: ['ring', 'warn', 'none', [['usb', 0, 0, 0.8], ['mail', 0, 2, 0.8]]],
    n: [['us', 'user', 'User action', 0, 1], ['ch', 'router', 'USB, email, web, print', 1, 1], ['pl', 'shield', 'Policy engine', 2, 1], ['bl', 'lock', 'Block, encrypt or warn', 3, 0, 'bad'], ['lg', 'doc', 'Allow and log', 3, 2, 'good'], ['rv', 'user', 'Incident review', 4, 1]],
    l: [['us', 'ch'], ['ch', 'pl'], ['pl', 'bl', 'bad'], ['pl', 'lg', 'good'], ['bl', 'rv'], ['lg', 'rv']],
    s: [['Data moves', 'Someone tries to send, copy, upload or print data.', ['us', 'ch'], ['us>ch'], [['s', 'us>ch', 'doc', 3], ['n', 'ch', 'hot'], ['c', 'ch', 'Send, copy, upload, print', 'ok']]],
      ['Classify', 'Policies recognise personal data, source code and regulated information.', ['ch', 'pl'], ['ch>pl'], [['s', 'ch>pl', 'doc', 3], ['f', 'pl', 'radar'], ['c', 'pl', 'Personal data, source code', 'warn']]],
      ['Act', 'Depending on the policy and the user’s risk, the action is blocked, encrypted, warned about or simply logged.', ['pl', 'bl', 'lg'], ['pl>bl', 'pl>lg'], [['s', 'pl>bl', 'doc', 3, 0.7], ['s', 'pl>lg', 'doc', 2], ['n', 'bl', 'block'], ['c', 'bl', 'Blocked', 'no'], ['c', 'lg', 'Allowed and logged', 'ok']]],
      ['Review', 'Incidents keep the evidence an investigator needs.', ['bl', 'lg', 'rv'], ['bl>rv', 'lg>rv'], [['s', 'bl>rv', 'warn', 2], ['s', 'lg>rv', 'bit', 3], ['n', 'rv', 'hot'], ['c', 'rv', 'Evidence kept', 'ok']]]],
  },
  'sentinelone': {
    t: 'SentinelOne Singularity', th: ['ring', 'ai', 'embers', [['radar', 0, 0, 0.8], ['eye', 4, 0, 0.8]]],
    n: [['pr', 'threat', 'Suspicious process', 0, 1], ['ag', 'ai', 'Endpoint agent', 1, 1], ['ac', 'shield', 'Kill, quarantine, isolate', 2, 0], ['rb', 'db', 'Rollback', 2, 2], ['cn', 'chart', 'Console and telemetry', 3, 1], ['an', 'user', 'Analyst', 4, 1]],
    l: [['pr', 'ag', 'bad'], ['ag', 'ac'], ['ag', 'rb'], ['ac', 'cn'], ['rb', 'cn'], ['cn', 'an']],
    s: [['Watch', 'The agent watches process behaviour on the device, even when it is offline.', ['pr', 'ag'], ['pr>ag'], [['s', 'pr>ag', 'bad', 2, 0.75], ['n', 'ag', 'scan'], ['f', 'ag', 'radar'], ['c', 'ag', 'Behaviour analysed on device', 'ok']]],
      ['Respond on the device', 'It can kill, quarantine or isolate without waiting for the cloud.', ['ag', 'ac'], ['ag>ac'], [['s', 'ag>ac', 'tok', 2], ['n', 'pr', 'block'], ['f', 'pr', 'burst'], ['c', 'ac', 'Killed and quarantined', 'no']]],
      ['Roll back', 'On supported systems, files changed by ransomware can be restored.', ['ag', 'rb'], ['ag>rb'], [['s', 'ag>rb', 'cube', 3, 1, 1.0], ['n', 'rb', 'ok'], ['c', 'rb', 'Files restored', 'ok']]],
      ['Investigate', 'Telemetry from endpoints, identity and cloud is correlated for the analyst.', ['ac', 'rb', 'cn', 'an'], ['ac>cn', 'rb>cn', 'cn>an'], [['s', 'ac>cn', 'bit', 4], ['s', 'rb>cn', 'bit', 4], ['s', 'cn>an', 'warn', 2], ['n', 'cn', 'hot'], ['c', 'cn', 'One correlated timeline', 'ok']]]],
  },
};

// ---------------- industries (bespoke stories built from each industry’s own example) ----------------
export const panelFlows = {
  ind: {
    'Agriculture': {
      t: 'Agriculture', th: ['rows', 'good', 'leaves', [['tree', 0, 0, 1.0], ['tree', 0, 2, 0.9], ['tree', 4, 0, 0.9], ['field', 4, 2, 1.4]]], z: [['Office', 3, 0, 3, 0, 'info'], ['Production', 3, 2, 3, 2, 'warn']],
      n: [['fs', 'sensor', 'Field sensors', 0, 1], ['gw', 'router', 'Site gateway', 1, 1], ['fw', 'firewall', 'Segmentation firewall', 2, 1], ['of', 'device', 'Office systems', 3, 0], ['pl', 'gear', 'Production equipment', 3, 2], ['bk', 'cloud', 'Offsite backup', 4, 1]],
      l: [['fs', 'gw'], ['gw', 'fw'], ['fw', 'of'], ['fw', 'pl'], ['of', 'bk'], ['pl', 'bk']],
      s: [['One flat network', 'On a flat network a problem in the office can reach the production equipment.', ['gw', 'of', 'pl'], [], [['s', 'of>pl', 'bad', 3], ['n', 'pl', 'fail'], ['f', 'pl', 'smoke'], ['c', 'pl', 'Malware reaches production', 'no']]],
        ['Segment it', 'Office systems and production equipment are separated, so a problem in one stays in one.', ['gw', 'fw', 'of', 'pl'], ['gw>fw', 'fw>of', 'fw>pl'], [['n', 'fw', 'build'], ['s', 'gw>fw', 'dot', 3], ['s', 'fw>of', 'dot', 2], ['s', 'fw>pl', 'dot', 2], ['s', 'of>pl', 'bad', 3, 0.5], ['c', 'fw', 'Office and production apart', 'lock']]],
        ['Connect remote sites', 'Reliable links bring data from sites and field equipment to where it is used.', ['fs', 'gw'], ['fs>gw'], [['s', 'fs>gw', 'heart', 3], ['f', 'fs', 'ring'], ['c', 'fs', 'Remote sites report in', 'ok']]],
        ['Back up offsite', 'Backups are kept offsite, so an outage or a failed device does not mean lost records.', ['of', 'pl', 'bk'], ['of>bk', 'pl>bk'], [['s', 'of>bk', 'cube', 3, 1, 1.0], ['s', 'pl>bk', 'cube', 3, 1, 1.0], ['b', 'bk', 'Offsite copy'], ['n', 'pl', 'ok'], ['c', 'bk', 'Recoverable after an outage', 'ok']]]],
    },
    'Banking & Financial Services': {
      t: 'Banking and financial services', th: ['hex', 'warn', 'none', [['bank', 0, 0, 1.0], ['vault', 0, 2, 0.8], ['coin', 4, 0, 0.8]]],
      n: [['au', 'doc', 'Audit finding', 0, 1, 'warn'], ['sa', 'user', 'Shared admin account', 1, 0, 'bad'], ['vt', 'vault', 'Privileged access vault', 2, 1], ['na', 'admin', 'Named admins with MFA', 3, 0, 'good'], ['lg', 'doc', 'Audited session log', 3, 2], ['cl', 'goal', 'Finding closed', 4, 1]],
      l: [['au', 'sa'], ['sa', 'vt'], ['vt', 'na'], ['vt', 'lg'], ['na', 'cl'], ['lg', 'cl']],
      s: [['An audit finding', 'Several people use the same administrator password, and nobody can say who did what.', ['au', 'sa'], ['au>sa'], [['s', 'au>sa', 'warn', 2], ['n', 'sa', 'alert'], ['f', 'sa', 'ring'], ['c', 'sa', 'Shared admin passwords', 'no']]],
        ['Vault the credentials', 'Privileged credentials move into a vault and are rotated after every use.', ['sa', 'vt'], ['sa>vt'], [['s', 'sa>vt', 'tok', 3], ['n', 'vt', 'scan'], ['c', 'vt', 'Rotated after every use', 'lock']]],
        ['Named accounts', 'Each administrator gets a named account with multi-factor authentication and only the access the role needs.', ['vt', 'na', 'lg'], ['vt>na', 'vt>lg'], [['s', 'vt>na', 'tok', 3], ['s', 'vt>lg', 'doc', 3], ['n', 'na', 'build'], ['c', 'na', 'MFA and least privilege', 'ok']]],
        ['Close the finding', 'Every privileged session is logged, which gives the auditor the evidence they asked for.', ['na', 'lg', 'cl'], ['na>cl', 'lg>cl'], [['s', 'na>cl', 'dot', 3], ['s', 'lg>cl', 'doc', 3], ['n', 'cl', 'ok'], ['f', 'cl', 'ring'], ['c', 'lg', 'Evidence for the auditor', 'ok']]]],
    },
    'Education': {
      t: 'Education', th: ['dot', 'ai', 'bubbles', [['school', 4, 0, 1.0], ['book', 4, 2, 0.9]]],
      n: [['lb', 'device', 'Old lab PCs', 0, 0, 'warn'], ['st', 'user', 'Students and staff', 0, 2], ['id', 'key', 'Sign-in', 1, 1], ['im', 'server', 'Desktop image', 2, 1], ['ds', 'cloud', 'Cloud desktops', 3, 0], ['bk', 'db', 'Coursework backup', 3, 2]],
      l: [['st', 'id'], ['lb', 'id'], ['id', 'im'], ['im', 'ds'], ['ds', 'bk']],
      s: [['Each PC by hand', 'Every lab PC has to be updated and fixed one at a time.', ['lb'], [], [['n', 'lb', 'alert'], ['f', 'lb', 'ring'], ['c', 'lb', 'Patched one by one', 'warn']]],
        ['One image', 'A single managed desktop image is updated once and used everywhere.', ['id', 'im'], ['id>im'], [['s', 'id>im', 'tok', 2], ['n', 'im', 'build'], ['c', 'im', 'Updated once', 'ok']]],
        ['Any device', 'Students and staff sign in from any device and get the same desktop.', ['st', 'id', 'im', 'ds'], ['st>id', 'id>im', 'im>ds'], [['s', 'st>id', 'tok', 3], ['s', 'im>ds', 'cube', 3, 1, 1.0], ['n', 'ds', 'build'], ['c', 'ds', 'Same desktop anywhere', 'up']]],
        ['Coursework backed up', 'Coursework and records are backed up, so a lost device is an inconvenience, not a loss.', ['ds', 'bk'], ['ds>bk'], [['s', 'ds>bk', 'doc', 3], ['b', 'bk', 'Saving coursework'], ['c', 'bk', 'Records protected', 'lock']]]],
    },
    'Energy & Utilities': {
      t: 'Energy and utilities', th: ['grid', 'warn', 'sparks', [['turbine', 0, 0, 0.8], ['pylon', 4, 0, 0.9], ['plant', 4, 2, 0.9], ['turbine', 0, 2, 0.7]]],
      n: [['cr', 'user', 'Control-room support', 0, 1], ['p1', 'server', 'Primary site', 1, 0], ['p2', 'server', 'Second site', 1, 2, 'good'], ['bk', 'db', 'Offline backup', 2, 1], ['rt', 'clock', 'Restore test each quarter', 3, 1], ['ok', 'goal', 'Recovery proven', 4, 1, 'good']],
      l: [['cr', 'p1'], ['cr', 'p2', 'good'], ['p1', 'p2', 'good'], ['p1', 'bk'], ['bk', 'rt'], ['rt', 'ok']],
      s: [['One site runs it', 'The support system for the control room lives on a single site.', ['cr', 'p1'], ['cr>p1'], [['s', 'cr>p1', 'dot', 3], ['n', 'p1', 'hot'], ['c', 'p1', 'Single point of failure', 'warn']]],
        ['A second site', 'Systems are replicated to a second site with a documented failover.', ['p1', 'p2'], ['p1>p2'], [['s', 'p1>p2', 'cube', 4, 1, 1.2], ['n', 'p2', 'build'], ['c', 'p2', 'Documented failover', 'ok']]],
        ['Fail over', 'If the primary site is lost, the control room carries on from the second site.', ['cr', 'p1', 'p2'], ['cr>p1', 'cr>p2'], [['n', 'p1', 'fail'], ['f', 'p1', 'smoke'], ['s', 'cr>p1', 'heart', 2, 0.7], ['s', 'cr>p2', 'dot', 3], ['n', 'p2', 'ok'], ['c', 'p2', 'Control room carries on', 'ok']]],
        ['Prove it', 'A restore test every quarter shows that the recovery really works.', ['p1', 'bk', 'rt', 'ok'], ['p1>bk', 'bk>rt', 'rt>ok'], [['s', 'p1>bk', 'cube', 3], ['s', 'bk>rt', 'cube', 3], ['s', 'rt>ok', 'dot', 3], ['b', 'rt', 'Restore test'], ['n', 'ok', 'ok'], ['c', 'ok', 'Tested every quarter', 'ok']]]],
    },
    'Government': {
      t: 'Government', th: ['ring', 'info', 'stars', [['gov', 0, 0, 1.0], ['book', 0, 2, 0.8], ['gov', 4, 2, 0.7]]],
      n: [['dc', 'doc', 'Documents', 0, 1], ['lb', 'shield', 'Sensitivity labels', 1, 0], ['pl', 'lock', 'Sharing policy', 2, 1], ['ap', 'globe', 'Approved channels', 3, 0, 'good'], ['ex', 'mail', 'Personal email or public upload', 3, 2, 'bad'], ['ev', 'doc', 'Evidence and records', 4, 1]],
      l: [['dc', 'lb'], ['lb', 'pl'], ['pl', 'ap', 'good'], ['pl', 'ex', 'bad'], ['ap', 'ev'], ['ex', 'ev']],
      s: [['Label by sensitivity', 'Documents are labelled as public, internal or restricted when they are created.', ['dc', 'lb'], ['dc>lb'], [['s', 'dc>lb', 'doc', 3], ['n', 'lb', 'scan'], ['c', 'lb', 'Public, internal, restricted', 'ok']]],
        ['Apply the policy', 'Sharing rules follow the label, so the document carries its own protection.', ['lb', 'pl'], ['lb>pl'], [['s', 'lb>pl', 'doc', 3], ['n', 'pl', 'hot'], ['c', 'pl', 'The policy follows the label', 'lock']]],
        ['Approved channels only', 'Restricted files can only leave through approved channels; other routes are stopped.', ['pl', 'ap', 'ex'], ['pl>ap', 'pl>ex'], [['s', 'pl>ap', 'doc', 3], ['s', 'pl>ex', 'doc', 3, 0.6], ['n', 'ex', 'block'], ['c', 'ex', 'Restricted file stopped', 'no']]],
        ['Keep the evidence', 'Written procedures and records show what is allowed and what happened.', ['ap', 'ex', 'ev'], ['ap>ev', 'ex>ev'], [['s', 'ap>ev', 'bit', 3], ['s', 'ex>ev', 'warn', 2], ['n', 'ev', 'ok'], ['c', 'ev', 'Procedures and records', 'ok']]]],
    },
  },
  // ---------------- reasons ----------------
  why: {
    'Experienced and forward-looking': {
      t: 'Experienced and forward-looking', th: ['hex', 'info', 'bits', [['eye', 0, 0, 0.8], ['book', 4, 2, 0.8]]],
      n: [['en', 'admin', 'Hands-on experience', 0, 1], ['id', 'key', 'Entra ID and MFA', 1, 0], ['df', 'shield', 'Defender and EDR', 1, 2], ['vb', 'db', 'Veeam backup', 2, 1], ['pr', 'chart', 'Plain-language report', 3, 1], ['ou', 'goal', 'Planned, safer steps', 4, 1, 'good']],
      l: [['en', 'id'], ['en', 'df'], ['id', 'vb'], ['df', 'vb'], ['vb', 'pr'], ['pr', 'ou']],
      s: [['Hands-on background', 'The people advising you also run these systems every day.', ['en'], [], [['n', 'en', 'hot'], ['f', 'en', 'ring'], ['c', 'en', 'We run these systems daily', 'ok']]],
        ['Modern tooling', 'Current tools for identity, endpoint protection and backup are used where they fit.', ['en', 'id', 'df', 'vb'], ['en>id', 'en>df', 'id>vb', 'df>vb'], [['s', 'en>id', 'tok', 2], ['s', 'en>df', 'bit', 4], ['s', 'id>vb', 'bit', 3], ['s', 'df>vb', 'bit', 3], ['n', 'vb', 'ok']]],
        ['Plain language', 'Findings are explained as risk, cost and next steps, not jargon.', ['vb', 'pr'], ['vb>pr'], [['s', 'vb>pr', 'doc', 3], ['n', 'pr', 'build'], ['c', 'pr', 'Risk, cost, next steps', 'ok']]],
        ['Planned steps', 'Changes such as moving from shared admin passwords to named accounts and MFA happen in planned steps.', ['pr', 'ou'], ['pr>ou'], [['s', 'pr>ou', 'dot', 3], ['n', 'ou', 'ok'], ['f', 'ou', 'ring'], ['c', 'ou', 'Named accounts and MFA', 'ok']]]],
    },
    'Built around you': {
      t: 'Built around you', th: ['dot', 'good', 'none', [['book', 0, 0, 0.8], ['goal', 4, 2, 0.8]]],
      n: [['di', 'eye', 'Discovery', 0, 1], ['sp', 'doc', 'Right-sized scope', 1, 1], ['m1', 'mail', 'Secure email', 2, 0], ['m2', 'db', 'Backup', 2, 1], ['m3', 'device', 'Device management', 2, 2], ['ok', 'goal', 'Value early', 3, 1, 'good']],
      l: [['di', 'sp'], ['sp', 'm1'], ['sp', 'm2'], ['sp', 'm3'], ['m1', 'ok'], ['m2', 'ok'], ['m3', 'ok']],
      s: [['Discovery first', 'We start by learning how your business works and what it needs.', ['di'], [], [['f', 'di', 'radar'], ['n', 'di', 'scan'], ['c', 'di', 'Your business first', 'ok']]],
        ['Right-sized scope', 'The scope covers what you need, not everything on a vendor’s list.', ['di', 'sp'], ['di>sp'], [['s', 'di>sp', 'doc', 3], ['n', 'sp', 'hot'], ['c', 'sp', 'Only what you need', 'ok']]],
        ['Phase one', 'The first phase delivers value early; the rest waits until it is needed.', ['sp', 'm1', 'ok'], ['sp>m1', 'm1>ok'], [['s', 'sp>m1', 'cube', 3], ['n', 'm1', 'build'], ['n', 'm2', 'ghost'], ['n', 'm3', 'ghost'], ['c', 'm1', 'Phase 1: secure email', 'ok']]],
        ['Adjust and continue', 'Later phases follow as priorities and budgets allow.', ['sp', 'm2', 'm3', 'ok'], ['sp>m2', 'sp>m3', 'm2>ok', 'm3>ok'], [['s', 'sp>m2', 'cube', 3], ['s', 'sp>m3', 'cube', 3], ['n', 'm2', 'build'], ['n', 'm3', 'build'], ['n', 'ok', 'ok'], ['c', 'ok', 'Phased and affordable', 'ok']]]],
    },
    'Proactive support': {
      t: 'Proactive support', th: ['grid', 'good', 'none', [['clock', 0, 0, 0.8], ['eye', 4, 2, 0.8]]],
      n: [['sc', 'clock', 'Scheduled review', 0, 1], ['bk', 'db', 'Backup job', 1, 0], ['mn', 'eye', 'Monitoring', 1, 2], ['fx', 'gear', 'Fix', 2, 1], ['es', 'user', 'Owner told', 3, 0], ['ok', 'goal', 'Fixed before it mattered', 3, 2, 'good']],
      l: [['sc', 'bk'], ['sc', 'mn'], ['bk', 'fx'], ['mn', 'fx'], ['fx', 'es'], ['fx', 'ok']],
      s: [['A planned review', 'Backups, patches and alerts are checked on a schedule, not only when something breaks.', ['sc', 'bk'], ['sc>bk'], [['s', 'sc>bk', 'heart', 3], ['n', 'bk', 'alert'], ['f', 'bk', 'ring'], ['c', 'bk', 'Backup job is failing', 'warn']]],
        ['Monitoring agrees', 'Monitoring flags the same job, so the problem is confirmed early.', ['sc', 'mn', 'fx'], ['sc>mn', 'mn>fx'], [['s', 'sc>mn', 'heart', 2], ['s', 'mn>fx', 'warn', 2], ['n', 'mn', 'hot'], ['c', 'mn', 'Confirmed early', 'ok']]],
        ['Fix it', 'The job is repaired and a test restore proves it works.', ['bk', 'fx'], ['bk>fx'], [['s', 'bk>fx', 'cube', 3], ['n', 'fx', 'hot'], ['n', 'bk', 'ok'], ['c', 'bk', 'Repaired and tested', 'ok']]],
        ['Escalate and close', 'The owner is told clearly, and nobody needed a restore to find out.', ['fx', 'es', 'ok'], ['fx>es', 'fx>ok'], [['s', 'fx>es', 'mail', 2], ['s', 'fx>ok', 'dot', 3], ['n', 'ok', 'ok'], ['f', 'ok', 'ring'], ['c', 'ok', 'Found in review, not in crisis', 'ok']]]],
    },
    'Current with technology': {
      t: 'Current with technology', th: ['ring', 'ai', 'bits', [['globe', 0, 0, 0.8], ['radar', 4, 2, 0.8]]],
      n: [['ne', 'globe', 'New tools and threats', 0, 1], ['as', 'chart', 'Assess need, risk, cost', 1, 1], ['lb', 'shield', 'Data labels and DLP', 2, 0], ['ai', 'ai', 'AI assistant', 3, 0], ['eo', 'clock', 'End-of-life flagged', 2, 2, 'warn'], ['bd', 'goal', 'Budgeted upgrade', 3, 2, 'good']],
      l: [['ne', 'as'], ['as', 'lb'], ['lb', 'ai'], ['as', 'eo'], ['eo', 'bd']],
      s: [['Evidence over hype', 'New tools and threats are assessed for need, risk and cost before anything changes.', ['ne', 'as'], ['ne>as'], [['s', 'ne>as', 'bit', 5], ['f', 'as', 'radar'], ['c', 'as', 'Need, risk and cost', 'ok']]],
        ['Guardrails first', 'Before staff adopt an AI assistant, sensitive data is labelled and upload policies are set.', ['as', 'lb', 'ai'], ['as>lb', 'lb>ai'], [['s', 'as>lb', 'doc', 3], ['n', 'lb', 'build'], ['s', 'lb>ai', 'tok', 2], ['n', 'ai', 'hot'], ['c', 'lb', 'Labels and upload policy', 'lock']]],
        ['Plan the upgrade', 'Systems nearing end of life are flagged early and budgeted for.', ['as', 'eo', 'bd'], ['as>eo', 'eo>bd'], [['s', 'as>eo', 'warn', 2], ['n', 'eo', 'alert'], ['s', 'eo>bd', 'coin', 3], ['n', 'bd', 'ok'], ['c', 'eo', 'End of life flagged', 'warn']]]],
    },
    'Long-term partnership': {
      t: 'Long-term partnership', th: ['dot', 'info', 'none', [['clock', 0, 0, 0.8], ['coin', 4, 2, 0.8]]],
      n: [['dc', 'doc', 'Documented work', 0, 1], ['rv', 'clock', 'Regular reviews', 1, 0], ['ad', 'user', 'Honest advice', 1, 2], ['lc', 'package', 'Unused licences', 2, 0, 'warn'], ['rp', 'doc', 'Recovery plan', 2, 2], ['ok', 'goal', 'Stronger every year', 3, 1, 'good']],
      l: [['dc', 'rv'], ['dc', 'ad'], ['rv', 'lc'], ['ad', 'rp'], ['lc', 'ok'], ['rp', 'ok']],
      s: [['Everything documented', 'Systems and decisions are written down so anyone can pick up the work.', ['dc'], [], [['n', 'dc', 'hot'], ['f', 'dc', 'ring'], ['c', 'dc', 'Written down, not in heads', 'ok']]],
        ['Regular reviews', 'Reviews keep priorities and risks current as the business changes.', ['dc', 'rv'], ['dc>rv'], [['s', 'dc>rv', 'doc', 3], ['n', 'rv', 'hot'], ['c', 'rv', 'Scheduled, not ad hoc', 'ok']]],
        ['Honest advice', 'If something is not needed, we say so.', ['dc', 'ad'], ['dc>ad'], [['s', 'dc>ad', 'mail', 2], ['n', 'ad', 'hot'], ['c', 'ad', 'Not needed? We say so', 'ok']]],
        ['A better year', 'A yearly review retires unused licences and brings the recovery plan up to date.', ['rv', 'ad', 'lc', 'rp', 'ok'], ['rv>lc', 'ad>rp', 'lc>ok', 'rp>ok'], [['s', 'rv>lc', 'coin', 3], ['n', 'lc', 'ghost'], ['s', 'ad>rp', 'doc', 3], ['n', 'rp', 'build'], ['s', 'lc>ok', 'dot', 2], ['s', 'rp>ok', 'dot', 2], ['n', 'ok', 'ok'], ['c', 'lc', 'Unused licences retired', 'down']]]],
    },
  },
  // ---------------- tips (the four steps keep the tip’s own wording; the scene, objects and effects are specific to each tip) ----------------
  tips: tipFlows(),
};

function tipSpecs() {
  return {
    'Turn on multi-factor authentication': {
      th: ['circ', 'info', 'bits', [['lock', 4, 0, 0.7], ['phone', 4, 2, 0.7]]],
      n: [['at', 'threat', 'Attacker with a stolen password', 0, 0], ['us', 'user', 'You', 0, 1], ['lg', 'key', 'Sign-in', 1, 1], ['mf', 'phone', 'Authenticator or passkey', 2, 0], ['lo', 'doc', 'Sign-in logs', 2, 2], ['ap', 'cloud', 'Email, admin, remote access', 3, 1]],
      l: [['at', 'lg', 'bad'], ['us', 'lg'], ['lg', 'mf'], ['mf', 'ap'], ['lg', 'lo']],
      v: [[['us', 'lg', 'mf', 'ap'], ['us>lg', 'lg>mf', 'mf>ap'], [['s', 'us>lg', 'tok', 2], ['s', 'lg>mf', 'tok', 2], ['s', 'mf>ap', 'tok', 3], ['n', 'mf', 'scan'], ['c', 'ap', 'Email, admin, remote', 'lock']]],
        [['lg', 'mf'], ['lg>mf'], [['s', 'lg>mf', 'tok', 3], ['f', 'mf', 'ring'], ['c', 'mf', 'App or passkey, not SMS', 'ok']]],
        [['lg', 'lo'], ['lg>lo'], [['s', 'lg>lo', 'bit', 4], ['f', 'lo', 'radar'], ['c', 'lo', 'Accounts without MFA', 'warn']]],
        [['at', 'lg', 'ap'], ['at>lg'], [['s', 'at>lg', 'bad', 3], ['s', 'at>ap', 'bad', 2], ['n', 'ap', 'alert'], ['c', 'ap', 'Legacy login skips MFA', 'no']]]],
    },
    'Patch on a schedule': {
      th: ['grid', 'warn', 'none', [['clock', 0, 0, 0.8]]],
      n: [['cv', 'threat', 'Known flaw (CVE)', 0, 1], ['sc', 'clock', 'Patch window', 1, 1], ['ep', 'device', 'Endpoints', 2, 0], ['sv', 'server', 'Servers', 2, 1], ['fw', 'firewall', 'Firewalls and apps', 2, 2], ['ex', 'doc', 'Exceptions: owner and date', 3, 1]],
      l: [['cv', 'sc', 'bad'], ['sc', 'ep'], ['sc', 'sv'], ['sc', 'fw'], ['sv', 'ex']],
      v: [[['sc', 'ep', 'sv', 'fw'], ['sc>ep', 'sc>sv', 'sc>fw'], [['f', 'sc', 'ring'], ['s', 'sc>ep', 'cube', 2], ['s', 'sc>sv', 'cube', 2], ['s', 'sc>fw', 'cube', 2], ['c', 'sc', 'Regular patch window', 'ok']]],
        [['cv', 'sc'], ['cv>sc'], [['s', 'cv>sc', 'warn', 3], ['n', 'cv', 'alert'], ['c', 'sc', 'Critical and high first', 'warn']]],
        [['sv', 'ex'], ['sv>ex'], [['s', 'sv>ex', 'doc', 3], ['n', 'ex', 'hot'], ['c', 'ex', 'Every exception has an owner', 'ok']]],
        [['ep', 'sv', 'fw'], [], [['n', 'ep', 'ok'], ['n', 'sv', 'alert'], ['n', 'fw', 'alert'], ['c', 'ep', 'Workstations patched', 'ok'], ['c', 'sv', 'Servers missed', 'no'], ['c', 'fw', 'Firewall missed', 'no']]]],
    },
    'Treat unexpected links and attachments as suspect': {
      th: ['dot', 'warn', 'none', [['mail', 4, 0, 0.7], ['bell', 4, 2, 0.7]]],
      n: [['ml', 'mail', 'Unexpected email', 0, 1, 'bad'], ['ot', 'user', 'Colleagues', 1, 0], ['us', 'user', 'You', 1, 1], ['vf', 'phone', 'Call the sender', 2, 0], ['rp', 'bell', 'Report it', 2, 2], ['fl', 'shield', 'Email security filtering', 3, 1]],
      l: [['ml', 'us'], ['ml', 'ot'], ['us', 'vf'], ['us', 'rp'], ['rp', 'fl']],
      v: [[['ml', 'us', 'vf'], ['ml>us', 'us>vf'], [['s', 'ml>us', 'mail', 2], ['n', 'us', 'alert'], ['s', 'us>vf', 'tok', 2], ['c', 'us', 'Do not click', 'no'], ['c', 'vf', 'Verify another way', 'ok']]],
        [['us', 'rp'], ['us>rp'], [['s', 'us>rp', 'mail', 2], ['n', 'rp', 'alert'], ['f', 'rp', 'ring'], ['c', 'rp', 'Report it', 'ok']]],
        [['rp', 'fl'], ['rp>fl'], [['s', 'rp>fl', 'doc', 2], ['n', 'fl', 'scan'], ['f', 'fl', 'radar'], ['c', 'fl', 'Links and attachments scanned', 'ok']]],
        [['ml', 'us', 'ot'], ['ml>us', 'ml>ot'], [['s', 'ml>us', 'mail', 2], ['s', 'ml>ot', 'mail', 3], ['n', 'us', 'fail'], ['n', 'ot', 'alert'], ['c', 'ot', 'Nobody else warned', 'no']]]],
    },
    'Limit privileged access': {
      th: ['hex', 'warn', 'none', [['vault', 4, 0, 0.7], ['key', 4, 2, 0.7]]],
      n: [['us', 'user', 'Everyone else', 0, 0], ['ad', 'admin', 'Admins', 0, 2], ['rl', 'shield', 'Role-based access', 1, 1], ['sa', 'key', 'Separate admin accounts', 2, 0], ['vt', 'vault', 'Rotated privileged credentials', 2, 2], ['rv', 'clock', 'Scheduled review', 3, 1]],
      l: [['us', 'rl'], ['ad', 'rl'], ['rl', 'sa'], ['rl', 'vt'], ['sa', 'rv'], ['vt', 'rv']],
      v: [[['us', 'rl'], ['us>rl'], [['s', 'us>rl', 'tok', 3], ['n', 'rl', 'scan'], ['c', 'rl', 'Only what the role needs', 'lock']]],
        [['ad', 'rl', 'sa', 'vt'], ['ad>rl', 'rl>sa', 'rl>vt'], [['s', 'ad>rl', 'tok', 2], ['s', 'rl>sa', 'tok', 2], ['s', 'rl>vt', 'tok', 2], ['n', 'vt', 'build'], ['c', 'vt', 'Credentials rotated', 'lock']]],
        [['sa', 'vt', 'rv'], ['sa>rv', 'vt>rv'], [['f', 'rv', 'radar'], ['s', 'sa>rv', 'bit', 3], ['s', 'vt>rv', 'bit', 3], ['c', 'rv', 'Admin accounts reviewed', 'ok']]],
        [['ad', 'rl'], ['ad>rl'], [['n', 'ad', 'alert'], ['f', 'ad', 'ring'], ['s', 'ad>rl', 'warn', 3], ['c', 'ad', 'Still admin after the project', 'no']]]],
    },
    'Follow 3-2-1': {
      th: ['hex', 'good', 'none', [['vault', 4, 0, 0.7], ['cloud', 4, 2, 0.8, 2.6]]],
      n: [['dt', 'server', 'Original data', 0, 1], ['d1', 'db', 'Disk backup', 1, 0], ['cl', 'cloud', 'Cloud copy (offsite)', 1, 2], ['rn', 'threat', 'Ransomware', 2, 0]],
      l: [['dt', 'd1'], ['dt', 'cl'], ['rn', 'd1', 'bad']],
      v: [[['dt', 'd1', 'cl'], ['dt>d1', 'dt>cl'], [['s', 'dt>d1', 'cube', 3], ['s', 'dt>cl', 'cube', 3], ['c', 'dt', 'Three copies', 'ok']]],
        [['d1', 'cl'], [], [['f', 'd1', 'ring'], ['f', 'cl', 'ring'], ['c', 'd1', 'Media 1: disk', 'ok'], ['c', 'cl', 'Media 2: cloud', 'ok']]],
        [['cl'], [], [['f', 'cl', 'beam'], ['n', 'cl', 'ok'], ['c', 'cl', 'One copy offsite', 'up']]],
        [['rn', 'd1', 'dt'], ['dt>d1', 'rn>d1'], [['s', 'rn>d1', 'bad', 3], ['s', 'dt>d1', 'cube', 2], ['n', 'd1', 'fail'], ['f', 'd1', 'smoke'], ['c', 'd1', 'Same share, same fate', 'no']]]],
    },
    'Keep one copy offline or immutable': {
      th: ['ring', 'bad', 'embers', [['vault', 4, 0, 0.8], ['lock', 4, 2, 0.7]]],
      n: [['rw', 'threat', 'Ransomware', 0, 1], ['pd', 'server', 'Production', 1, 0], ['bk', 'db', 'Network backup', 1, 2], ['im', 'vault', 'Immutable or offline copy', 2, 1, 'good'], ['al', 'bell', 'Deletion alert', 2, 2], ['cr', 'key', 'Separate backup credentials', 3, 1]],
      l: [['rw', 'bk', 'bad'], ['pd', 'im'], ['pd', 'bk'], ['cr', 'im'], ['bk', 'al']],
      v: [[['pd', 'im'], ['pd>im'], [['s', 'pd>im', 'cube', 3], ['n', 'im', 'scan'], ['c', 'im', 'Cannot be changed', 'lock']]],
        [['cr', 'im'], ['cr>im'], [['s', 'cr>im', 'tok', 2], ['n', 'cr', 'hot'], ['c', 'cr', 'Not the daily admin', 'lock']]],
        [['rw', 'bk', 'al'], ['rw>bk', 'bk>al'], [['s', 'rw>bk', 'bad', 3, 0.7], ['n', 'al', 'alert'], ['f', 'al', 'ring'], ['c', 'al', 'Deletion attempt alerted', 'warn']]],
        [['rw', 'bk'], ['rw>bk'], [['s', 'rw>bk', 'bad', 3], ['n', 'bk', 'fail'], ['f', 'bk', 'smoke'], ['c', 'bk', 'Reachable means encryptable', 'no']]]],
    },
    'Test restores, not just backup jobs': {
      th: ['rows', 'good', 'none', [['clock', 4, 0, 0.7]]],
      n: [['jb', 'gear', 'Backup job: green', 0, 1], ['sf', 'doc', 'Sample file', 1, 0], ['fs', 'server', 'Full system', 1, 2], ['tm', 'clock', 'Restore time', 2, 1], ['fx', 'gear', 'Fix and retest', 3, 1]],
      l: [['jb', 'sf'], ['jb', 'fs'], ['sf', 'tm'], ['fs', 'tm'], ['tm', 'fx']],
      v: [[['jb', 'sf', 'fs'], ['jb>sf', 'jb>fs'], [['s', 'jb>sf', 'doc', 3], ['s', 'jb>fs', 'cube', 3], ['n', 'jb', 'ok'], ['c', 'jb', 'Restore a file and a system', 'ok']]],
        [['sf', 'fs', 'tm'], ['sf>tm', 'fs>tm'], [['s', 'sf>tm', 'heart', 2], ['s', 'fs>tm', 'heart', 2], ['b', 'tm', 'Restore time'], ['c', 'tm', 'Time recorded', 'ok']]],
        [['tm', 'fx'], ['tm>fx'], [['s', 'tm>fx', 'warn', 3], ['n', 'fx', 'hot'], ['f', 'fx', 'ring'], ['c', 'fx', 'Fix and retest', 'ok']]],
        [['jb', 'fs'], ['jb>fs'], [['n', 'jb', 'ok'], ['n', 'fs', 'fail'], ['f', 'fs', 'smoke'], ['c', 'jb', 'Job shows green', 'ok'], ['c', 'fs', 'Restore is incomplete', 'no']]]],
    },
    'Write down RTO and RPO': {
      th: ['dot', 'info', 'none', [['clock', 0, 0, 0.8], ['db', 4, 2, 0.7]]],
      n: [['ks', 'server', 'Key systems', 0, 1], ['ag', 'user', 'Agree with the business', 1, 0], ['rt', 'clock', 'RTO: time down', 2, 0], ['rp', 'db', 'RPO: data lost', 2, 2], ['ck', 'chart', 'Does the design meet it?', 3, 1]],
      l: [['ks', 'ag'], ['ag', 'rt'], ['ag', 'rp'], ['rt', 'ck'], ['rp', 'ck']],
      v: [[['ks'], [], [['f', 'ks', 'ring'], ['n', 'ks', 'hot'], ['c', 'ks', 'List the key systems', 'ok']]],
        [['ks', 'ag', 'rt', 'rp'], ['ks>ag', 'ag>rt', 'ag>rp'], [['s', 'ks>ag', 'doc', 2], ['s', 'ag>rt', 'tok', 2], ['s', 'ag>rp', 'tok', 2], ['c', 'rt', 'How long can it be down?', 'ok'], ['c', 'rp', 'How much data can go?', 'ok']]],
        [['rt', 'rp', 'ck'], ['rt>ck', 'rp>ck'], [['s', 'rt>ck', 'heart', 2], ['s', 'rp>ck', 'heart', 2], ['n', 'ck', 'scan'], ['c', 'ck', 'Design meets targets', 'ok']]],
        [['rp', 'ck'], ['rp>ck'], [['n', 'rp', 'alert'], ['n', 'ck', 'fail'], ['s', 'rp>ck', 'warn', 3], ['c', 'ck', 'Backups too infrequent', 'no']]]],
    },
    'Keep confidential data out of public AI tools': {
      th: ['hex', 'ai', 'bits', [['ai', 4, 0, 0.7], ['lock', 4, 2, 0.7]]],
      n: [['us', 'user', 'Staff', 0, 1], ['tl', 'mail', 'Rule in plain words', 0, 2], ['rl', 'shield', 'Data classes never allowed', 1, 1], ['ap', 'ai', 'Approved AI tool', 2, 0, 'good'], ['pb', 'globe', 'Public AI tool', 2, 2, 'bad']],
      l: [['us', 'rl'], ['tl', 'us'], ['rl', 'ap', 'good'], ['rl', 'pb', 'bad']],
      v: [[['us', 'rl'], ['us>rl'], [['s', 'us>rl', 'doc', 3], ['n', 'rl', 'scan'], ['c', 'rl', 'Restricted data: never', 'no']]],
        [['rl', 'ap'], ['rl>ap'], [['s', 'rl>ap', 'doc', 3], ['n', 'ap', 'build'], ['c', 'ap', 'Approved alternative', 'ok']]],
        [['tl', 'us'], ['tl>us'], [['s', 'tl>us', 'mail', 3], ['f', 'tl', 'ring'], ['c', 'tl', 'Say it plainly, repeat it', 'ok']]],
        [['us', 'rl', 'pb'], ['us>rl', 'rl>pb'], [['s', 'us>rl', 'doc', 3], ['s', 'rl>pb', 'doc', 3], ['n', 'pb', 'alert'], ['c', 'pb', 'Use pushed out of sight', 'no']]]],
    },
    'Use DLP to catch sensitive data before it leaves': {
      th: ['ring', 'warn', 'none', [['usb', 4, 0, 0.7], ['mail', 4, 2, 0.7]]],
      n: [['cl', 'doc', 'Classified data', 0, 1], ['ch', 'router', 'Upload, paste, email, USB', 1, 0], ['po', 'shield', 'Policies', 1, 2], ['dl', 'lock', 'DLP engine', 2, 1], ['in', 'doc', 'Incidents: review and tune', 3, 1]],
      l: [['cl', 'ch'], ['cl', 'po'], ['ch', 'dl'], ['po', 'dl'], ['dl', 'in']],
      v: [[['cl'], [], [['f', 'cl', 'radar'], ['n', 'cl', 'scan'], ['c', 'cl', 'Public to restricted', 'ok']]],
        [['cl', 'ch', 'po', 'dl'], ['cl>ch', 'cl>po', 'ch>dl', 'po>dl'], [['s', 'cl>ch', 'doc', 3], ['s', 'cl>po', 'tok', 2], ['s', 'ch>dl', 'doc', 3], ['s', 'po>dl', 'tok', 2], ['n', 'dl', 'hot'], ['c', 'ch', 'Upload, paste, email, USB', 'ok']]],
        [['dl', 'in'], ['dl>in'], [['s', 'dl>in', 'warn', 3], ['f', 'in', 'ring'], ['n', 'in', 'hot'], ['c', 'in', 'Review and tune', 'ok']]],
        [['dl'], [], [['n', 'dl', 'fail'], ['f', 'dl', 'smoke'], ['c', 'dl', 'Blocked everything, then off', 'no']]]],
    },
    'Verify AI output before acting on it': {
      th: ['wave', 'ai', 'bits', [['eye', 4, 0, 0.7], ['book', 4, 2, 0.7]]],
      n: [['ai', 'ai', 'AI draft', 0, 1], ['hu', 'user', 'Human check', 1, 0], ['ck', 'doc', 'Figures, sources, contract text', 2, 0], ['cd', 'code', 'AI-written code', 2, 2], ['cu', 'mail', 'Customer', 3, 1]],
      l: [['ai', 'hu'], ['hu', 'ck'], ['ai', 'cd'], ['ai', 'cu']],
      v: [[['ai'], [], [['n', 'ai', 'hot'], ['f', 'ai', 'ring'], ['c', 'ai', 'Treat it as a draft', 'warn']]],
        [['ai', 'hu', 'ck'], ['ai>hu', 'hu>ck'], [['s', 'ai>hu', 'doc', 3], ['s', 'hu>ck', 'bit', 4], ['f', 'ck', 'radar'], ['c', 'ck', 'Figures, sources, legal text', 'ok']]],
        [['ai', 'cd'], ['ai>cd'], [['s', 'ai>cd', 'doc', 3], ['n', 'cd', 'scan'], ['b', 'cd', 'Tests'], ['c', 'cd', 'Review and test code', 'ok']]],
        [['ai', 'cu'], ['ai>cu'], [['s', 'ai>cu', 'mail', 3], ['n', 'cu', 'alert'], ['c', 'cu', 'No human read-through', 'no']]]],
    },
    'Review what AI assistants and agents can access': {
      th: ['hex', 'ai', 'bits', [['shield', 4, 0, 0.7], ['eye', 4, 2, 0.7]]],
      n: [['as', 'ai', 'AI assistant', 0, 1], ['lp', 'shield', 'Least privilege', 1, 1], ['lg', 'chart', 'Agent action log', 1, 2], ['dt', 'db', 'Connected data', 2, 0], ['tl', 'code', 'Connected tools', 2, 2], ['lb', 'doc', 'Sensitivity labels', 3, 0]],
      l: [['as', 'lp'], ['lp', 'dt'], ['lp', 'tl'], ['lb', 'dt'], ['as', 'lg']],
      v: [[['as', 'lp', 'dt', 'tl'], ['as>lp', 'lp>dt', 'lp>tl'], [['s', 'as>lp', 'tok', 2], ['s', 'lp>dt', 'tok', 2], ['s', 'lp>tl', 'tok', 2], ['n', 'lp', 'scan'], ['c', 'lp', 'Only what it needs', 'lock']]],
        [['lb', 'dt'], ['lb>dt'], [['s', 'lb>dt', 'doc', 3], ['s', 'dt>as', 'doc', 3, 0.5], ['n', 'dt', 'block'], ['c', 'dt', 'Restricted content excluded', 'lock']]],
        [['as', 'lg'], ['as>lg'], [['s', 'as>lg', 'bit', 4], ['n', 'lg', 'hot'], ['f', 'lg', 'radar'], ['c', 'lg', 'Actions logged and reviewed', 'ok']]],
        [['as', 'dt', 'tl'], [], [['s', 'as>dt', 'cube', 3], ['s', 'as>tl', 'cube', 3], ['n', 'dt', 'alert'], ['n', 'tl', 'alert'], ['c', 'dt', 'Access to everything', 'no']]]],
    },
    'Enrol every device in management': {
      th: ['circ', 'good', 'none', [['device', 4, 0, 0.7], ['phone', 4, 2, 0.7]]],
      n: [['dv', 'device', 'Laptop', 0, 0], ['ph', 'phone', 'Phone', 0, 2], ['mg', 'gear', 'Device management', 1, 1], ['pl', 'shield', 'Encryption, lock, updates', 2, 0], ['un', 'device', 'Personal unmanaged device', 2, 2, 'bad'], ['co', 'db', 'Company data', 3, 1]],
      l: [['dv', 'mg'], ['ph', 'mg'], ['mg', 'pl'], ['pl', 'co'], ['un', 'mg', 'bad'], ['un', 'co', 'bad']],
      v: [[['dv', 'ph', 'mg'], ['dv>mg', 'ph>mg'], [['s', 'dv>mg', 'tok', 2], ['s', 'ph>mg', 'tok', 2], ['n', 'mg', 'scan'], ['c', 'mg', 'Enrolled in Intune', 'ok']]],
        [['mg', 'pl'], ['mg>pl'], [['s', 'mg>pl', 'cube', 3], ['n', 'pl', 'build'], ['c', 'pl', 'Encryption, lock, updates', 'lock']]],
        [['mg', 'un'], ['un>mg'], [['s', 'un>mg', 'warn', 3, 0.6], ['n', 'un', 'alert'], ['c', 'un', 'Will not enrol: restricted', 'no']]],
        [['un', 'co'], ['un>co'], [['s', 'un>co', 'doc', 3], ['n', 'co', 'alert'], ['f', 'co', 'ring'], ['c', 'co', 'Data on a blind spot', 'no']]]],
    },
    'Use conditional access': {
      th: ['circ', 'info', 'bits', [['lock', 4, 0, 0.7], ['cloud', 4, 2, 0.8, 3]]],
      n: [['us', 'user', 'Sign-in', 0, 1], ['lg', 'firewall', 'Legacy authentication', 1, 0, 'bad'], ['ca', 'shield', 'Conditional access', 1, 1], ['mf', 'key', 'Require MFA for risky sign-ins', 2, 0], ['cp', 'device', 'Compliant devices only', 2, 2], ['ap', 'cloud', 'Sensitive apps', 3, 1]],
      l: [['us', 'ca'], ['lg', 'ca', 'bad'], ['ca', 'mf'], ['ca', 'cp'], ['mf', 'ap'], ['cp', 'ap']],
      v: [[['us', 'ca', 'mf'], ['us>ca', 'ca>mf'], [['s', 'us>ca', 'tok', 3], ['s', 'ca>mf', 'tok', 2], ['n', 'mf', 'scan'], ['c', 'mf', 'Risky sign-in: ask for MFA', 'warn']]],
        [['ca', 'cp', 'ap'], ['ca>cp', 'cp>ap'], [['s', 'ca>cp', 'heart', 2], ['s', 'cp>ap', 'tok', 3], ['f', 'cp', 'radar'], ['c', 'cp', 'Compliant devices only', 'ok']]],
        [['lg', 'ca'], ['lg>ca'], [['s', 'lg>ca', 'bad', 3, 0.55], ['n', 'ca', 'block'], ['c', 'lg', 'Legacy sign-in blocked', 'no']]],
        [['ca', 'ap'], [], [['n', 'ca', 'alert'], ['f', 'ca', 'ring'], ['c', 'ca', 'Exclusions forgotten', 'no']]]],
    },
    'Review cloud costs monthly': {
      th: ['dot', 'warn', 'bubbles', [['cloud', 4, 0, 0.9, 3], ['coin', 4, 2, 0.7]]],
      n: [['bl', 'chart', 'Monthly bill', 0, 1], ['us', 'chart', 'Usage', 1, 0], ['tg', 'doc', 'Owner tags', 1, 2], ['id', 'package', 'Idle resources', 2, 0, 'warn'], ['ts', 'server', 'Test environment', 2, 2, 'bad'], ['rs', 'gear', 'Right-size', 3, 1]],
      l: [['bl', 'us'], ['bl', 'tg'], ['us', 'id'], ['tg', 'ts'], ['id', 'rs'], ['ts', 'rs']],
      v: [[['bl', 'us'], ['bl>us'], [['s', 'bl>us', 'bit', 4], ['f', 'bl', 'radar'], ['c', 'bl', 'Bill and usage reviewed', 'ok']]],
        [['us', 'id'], ['us>id'], [['s', 'us>id', 'warn', 3], ['n', 'id', 'ghost'], ['c', 'id', 'Idle resources removed', 'down']]],
        [['tg', 'ts', 'rs'], ['tg>ts', 'ts>rs'], [['s', 'tg>ts', 'doc', 3], ['s', 'ts>rs', 'coin', 3], ['n', 'rs', 'hot'], ['c', 'tg', 'Owner tag on everything', 'ok'], ['c', 'rs', 'Right-sized', 'down']]],
        [['ts'], [], [['n', 'ts', 'alert'], ['f', 'ts', 'spark'], ['c', 'ts', 'Left running after the project', 'no']]]],
    },
    'Keep an inventory': {
      th: ['circ', 'good', 'none', [['device', 4, 0, 0.7], ['code', 4, 2, 0.7]]],
      n: [['hw', 'device', 'Devices', 0, 0], ['sw', 'code', 'Software and licences', 0, 2], ['in', 'doc', 'Inventory', 1, 1], ['jl', 'user', 'Joiners, leavers, role changes', 2, 0], ['rn', 'clock', 'Renewals and replacements', 2, 2], ['st', 'doc', 'Stale spreadsheet', 3, 1, 'bad']],
      l: [['hw', 'in'], ['sw', 'in'], ['jl', 'in'], ['in', 'rn'], ['in', 'st']],
      v: [[['hw', 'sw', 'in'], ['hw>in', 'sw>in'], [['s', 'hw>in', 'doc', 3], ['s', 'sw>in', 'doc', 3], ['n', 'in', 'build'], ['c', 'in', 'Devices, software, owners', 'ok']]],
        [['jl', 'in'], ['jl>in'], [['s', 'jl>in', 'mail', 3], ['f', 'in', 'ring'], ['c', 'in', 'Updated on every change', 'ok']]],
        [['in', 'rn'], ['in>rn'], [['s', 'in>rn', 'doc', 3], ['n', 'rn', 'hot'], ['c', 'rn', 'Plan renewals ahead', 'ok']]],
        [['in', 'st'], ['in>st'], [['s', 'in>st', 'doc', 2], ['n', 'st', 'ghost'], ['c', 'st', 'A file nobody updates', 'no']]]],
    },
  };
}
function clip(s, n) { return s.length > n ? s.slice(0, n - 1).trimEnd() + '\u2026' : s; }
// A tip keeps its own four points as the step text; the nodes, links and effects come from its scene.
function tipFlows() {
  const out = {};
  for (const [title, sp] of Object.entries(tipSpecs())) {
    const det = tipDetails[title]; if (!det) continue;
    out[title] = { t: title, th: sp.th, n: sp.n, l: sp.l, s: det.points.slice(0, 4).map(([a, b], k) => [clip(a, 40), clip(b, 238), sp.v[k][0], sp.v[k][1], sp.v[k][2]]) };
  }
  return out;
}

// Plain generated flow, used only if an item has no scene of its own.
const KIND_SETS = { tips: ['user', 'gear', 'chart', 'bell', 'doc'], why: ['user', 'gear', 'shield', 'chart', 'goal'], ind: ['doc', 'shield', 'gear', 'chart', 'goal'] };
const ROWS = [1, 0, 1, 2, 1, 0];
export const autoFlow = (set, title, points, example) => {
  const kinds = KIND_SETS[set] || KIND_SETS.why, pts = points.slice(0, 4), n = [], l = [], s = [];
  pts.forEach(([a, b], i) => { n.push(['p' + i, kinds[i % kinds.length], clip(a, 26), i, ROWS[i]]); if (i) l.push(['p' + (i - 1), 'p' + i]); s.push([clip(a, 40), clip(b, 230), i ? ['p' + (i - 1), 'p' + i] : ['p' + i], i ? ['p' + (i - 1) + '>p' + i] : []]); });
  if (example) { const k = pts.length; n.push(['ex', 'goal', 'Example', k, ROWS[k], 'good']); l.push(['p' + (k - 1), 'ex', 'good']); s.push(['Example', clip(example, 230), ['p' + (k - 1), 'ex'], ['p' + (k - 1) + '>ex']]); }
  return { t: title, n, l, s };
};

// Strict validation: used by the build (fails the build) and by scripts/check.mjs on the generated HTML.
export const validateFlow = (f, name) => {
  const bad = (m) => { throw new Error(`flow "${name}": ${m}`); };
  const num = (v, a, b) => typeof v === 'number' && v >= a && v <= b;
  if (!f || typeof f !== 'object') bad('not an object');
  if (typeof f.t !== 'string' || !f.t || f.t.length > 80) bad('bad title');
  if (!Array.isArray(f.n) || f.n.length < 2 || f.n.length > 12) bad('needs 2-12 nodes');
  const ids = new Set();
  for (const nd of f.n) {
    if (!Array.isArray(nd) || nd.length < 5) bad('bad node');
    const [id, kind, label, c, r, tone] = nd;
    if (typeof id !== 'string' || !/^[a-z0-9]{1,4}$/.test(id) || ids.has(id)) bad('bad or duplicate node id ' + id); ids.add(id);
    if (!KINDS.includes(kind)) bad('unknown kind ' + kind);
    if (typeof label !== 'string' || !label || label.length > 40) bad('bad label for ' + id);
    if (!Number.isInteger(c) || !Number.isInteger(r) || c < 0 || c > 6 || r < 0 || r > 3) bad('bad grid position for ' + id);
    if (tone !== undefined && !TONES.includes(tone)) bad('bad tone ' + tone);
  }
  const pos = new Set(f.n.map((x) => x[3] + ',' + x[4])); if (pos.size !== f.n.length) bad('two nodes share a grid cell');
  const lk = new Set();
  for (const e of f.l || []) { if (!Array.isArray(e) || !ids.has(e[0]) || !ids.has(e[1]) || e[0] === e[1]) bad('bad link ' + JSON.stringify(e)); if (e[2] !== undefined && !TONES.includes(e[2])) bad('bad link tone'); lk.add(e[0] + '>' + e[1]); }
  if ((f.l || []).length > 20) bad('too many links');
  if (f.th !== undefined) {
    const th = f.th; if (!Array.isArray(th) || !FLOORS.includes(th[0]) || !TONES.includes(th[1]) || !PARTS.includes(th[2])) bad('bad theme');
    if (th[3] !== undefined) { if (!Array.isArray(th[3]) || th[3].length > 6) bad('bad decor list'); for (const d of th[3]) if (!Array.isArray(d) || !KINDS.includes(d[0]) || !num(d[1], -1, 6) || !num(d[2], -1, 4) || (d[3] !== undefined && !num(d[3], 0.3, 2.5)) || (d[4] !== undefined && !num(d[4], 0, 6))) bad('bad decor ' + JSON.stringify(d)); }
  }
  if (!Array.isArray(f.s) || f.s.length < 1 || f.s.length > 6) bad('needs 1-6 steps');
  for (const st of f.s) {
    if (!Array.isArray(st) || st.length < 4 || st.length > 5) bad('bad step');
    const [t, d, nn, ll, fx] = st; if (typeof t !== 'string' || !t || t.length > 40 || typeof d !== 'string' || !d || d.length > 240) bad('bad step text');
    if (!Array.isArray(nn) || !nn.length || nn.some((x) => !ids.has(x))) bad('step references unknown node in "' + t + '"');
    if (!Array.isArray(ll) || ll.some((x) => !lk.has(x))) bad('step references unknown link in "' + t + '"');
    if (fx !== undefined) {
      if (!Array.isArray(fx) || fx.length > 14) bad('too many effects in "' + t + '"');
      for (const e of fx) {
        if (!Array.isArray(e)) bad('bad effect in "' + t + '"'); const w = (m) => bad(m + ' in "' + t + '": ' + JSON.stringify(e));
        if (e[0] === 's') { const pr = typeof e[1] === 'string' ? e[1].split('>') : []; if (pr.length !== 2 || !ids.has(pr[0]) || !ids.has(pr[1]) || pr[0] === pr[1]) w('bad stream'); if (!STYLES.includes(e[2])) w('bad stream style'); if (e[3] !== undefined && !(Number.isInteger(e[3]) && e[3] >= 1 && e[3] <= 8)) w('bad stream count'); if (e[4] !== undefined && !num(e[4], 0.3, 1)) w('bad stream end'); if (e[5] !== undefined && !num(e[5], 0, 3)) w('bad stream arc'); }
        else if (e[0] === 'n') { if (!ids.has(e[1]) || !STATES.includes(e[2])) w('bad state'); }
        else if (e[0] === 'f') { if (!ids.has(e[1]) || !FXS.includes(e[2])) w('bad node effect'); }
        else if (e[0] === 'c') { if (!ids.has(e[1]) || typeof e[2] !== 'string' || !e[2] || e[2].length > 30 || (e[3] !== undefined && !GLYPHS.includes(e[3]))) w('bad callout'); }
        else if (e[0] === 'b') { if (!ids.has(e[1]) || typeof e[2] !== 'string' || !e[2] || e[2].length > 24) w('bad bar'); }
        else w('unknown effect');
      }
    }
  }
  for (const z of f.z || []) { if (!Array.isArray(z) || z.length < 5 || typeof z[0] !== 'string' || z.slice(1, 5).some((v) => !Number.isInteger(v) || v < 0 || v > 6) || z[1] > z[3] || z[2] > z[4]) bad('bad zone'); }
  if ((f.z || []).length > 3) bad('too many zones');
  return f;
};
