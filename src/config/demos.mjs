// Live demos hosted inside InfoXteK (v3.2.0).
// Source files live in /demos/<slug>/ (copied unchanged from the owner's demo bundles, then patched at build time:
// CSP meta, noindex, external links open in a new tab). Built output: /demos/<slug>/ . The InfoXteK page that shows them: /products/<slug>/demo/ .
// To add or replace a demo: replace the files in /demos/<slug>/, edit the text below, run `npm run build && npm run check`.
// Standalone live pages from the owner's own repos are kept here for reference only (not linked from the site).
export const demoStandalone = {
  'net-monit': ['https://infoxtek.github.io/Net-Monit/', 'https://mohamedabdullahkhan.github.io/Net-Monit/index.html'],
  'pc-admin-tools': ['https://infoxtek.github.io/PC-AdminTools/', 'https://infoxtek.github.io/PC_Admin_Tools_Demo/', 'https://mohamedabdullahkhan.github.io/PC-AdminTools/', 'https://mohamedabdullahkhan.github.io/PC_Admin_Tools-old'],
  ifinex: ['https://infoxtek.github.io/iFiNeX-Demo/', 'https://squadsplit.github.io/iFiNeX-Demo/'],
};

// Pages the visitor can open inside the demo frame without leaving InfoXteK.
// views: [label, path under /demos/<slug>/, hint]. The first view loads by default.
export const demos = {
  'net-monit': {
    entry: 'index.html', height: 'tall',
    version: 'V11.4 demo of Net-Monit V11.3',
    lead: 'The real Net-Monit pages, running on fake data in your browser. Use Explain mode and Page guide in the bottom bar to read what every control does. Nothing is installed, sent or saved on a server.',
    views: [['Dashboard', 'index.html'], ['Devices', 'devices.html'], ['Alerts', 'alerts.html'], ['Sites', 'urlmonitor.html'], ['Speed test', 'speedtest.html'], ['Network scan', 'networkscan.html'], ['Settings', 'settings.html'], ['Admin', 'admin.html'], ['License', 'activation.html']],
    tryIt: [
      'Open Dashboard: 17 demo devices with live changing numbers. Use the severity filters and switch between grid and list.',
      'Open Settings, then the threshold section, and lower a threshold. Watch an alert fire on the Alerts page, then Acknowledge and Resolve it.',
      'Open Devices, add a device, edit its notification and escalation settings, then delete it.',
      'Open Sites, add a URL containing "fail" and run a check: it returns an HTTP 503 like a real outage.',
      'Open Speed test and run the simulated WAN test: ping, download and upload phases with a live gauge.',
      'Open Network scan and start a scan: results appear after a few seconds and can be added to your devices.',
      'Open Admin to see users, token generation and the audit log that records what you did.',
    ],
    groups: [
      ['Dashboard', [['Live tiles', 'One tile per monitored device with live values, status colour and category.'], ['Severity filters', 'Show only healthy, warning, critical or offline devices.'], ['Grid and list views', 'Switch layout; edit, resize and hide tiles to build your own dashboard.'], ['Quick add', 'Add a device straight from the dashboard.']]],
      ['Devices', [['Add, edit, delete', 'Servers, network gear and sites with their own addresses and check methods.'], ['Test a device', 'Run an on-demand check and see the result at once.'], ['Notify and escalate', 'Per-device L1, L2 and L3 escalation with email, SMS and voice call steps.']]],
      ['Alerts', [['Threshold-driven alerts', 'An alert is raised when a metric crosses warning or critical, and cleared when it recovers.'], ['Acknowledge and Resolve', 'The same workflow as the real app, with the audit trail.'], ['Layered thresholds', 'Built-in default, then global, then method, then type, then per-device override. Lower is worse for SSL days.']]],
      ['Thresholds', [['Global, per type and per device', 'Set warning and critical values at the level you need.'], ['Validation', 'Warning must sit on the correct side of critical and inside the allowed range, or the value is refused.']]],
      ['Sites (URL monitor)', [['Results table', 'Status, response time and SSL expiry for each monitored URL.'], ['On-demand check', 'Run a check now. In the demo a URL containing fail, down or bad returns 503.']]],
      ['Speed test', [['WAN test', 'Ping, download and upload phases with a live gauge, saved to a history table.'], ['PC (browser) test', 'Measures your own connection against Cloudflare. This is the one real network test in the demo.']]],
      ['Network scan', [['Subnet scan', 'Discovers hosts and shows device type with open TCP and UDP ports.'], ['Add to devices', 'Turn a scan result into a monitored device in one step.']]],
      ['Settings', [['SMTP, SMS and call gateways', 'Where alerts are sent. Test buttons answer that nothing was sent in the demo.'], ['Organisation and templates', 'Notification text, escalation timing and offline detection.']]],
      ['Admin', [['Users and roles', 'Add and delete users; Admin and read-only Viewer roles (the viewer sees hosts masked).'], ['Access tokens', 'Generate a sign-in token for a user.'], ['Audit log and export', 'Every demo action is logged; export the configuration as JSON.']]],
      ['License', [['Device ID and Activation Code', 'How the real app identifies one installation.'], ['Key check', 'The demo accepts a key that starts with NM1- and is long enough. Real keys are Ed25519-signed and verified offline.']]],
    ],
    simulated: 'Ping, SNMP, SSH, PowerShell, scanning, email, SMS and voice calls are simulated. Data is fake and resets when you reset the demo or open a new tab. The browser speed test is the only real measurement and contacts Cloudflare only when you press it.',
  },
  'pc-admin-tools': {
    entry: 'index.html', height: 'tall',
    version: 'Web edition demo v4.0',
    lead: 'The real Web edition interface running against a simulated Windows PC. Every operation returns realistic output; no real PC is touched.',
    views: [['Full tool', 'index.html'], ['Push an IP and watch', 'index.html?scenario=pushwatch'], ['Gateway typo check', 'index.html?scenario=typo'], ['Auto-rollback', 'index.html?scenario=rollback'], ['Health check', 'index.html?scenario=health'], ['Cleanup and danger popup', 'index.html?scenario=cleanup'], ['Input validation', 'index.html?scenario=validation']],
    tryIt: [
      'Pick "Push an IP and watch": push a new IP, see "command pushed" at once, then the old IP die, a short outage and the new IP answering.',
      'Pick "Gateway typo check": an IP and gateway on different networks are refused before anything is sent.',
      'Pick "Auto-rollback": set a static IP on the wrong network and the PC reverts itself. Untick rollback and watch the tool lose the host.',
      'Pick "Health check": four read-only reports with realistic output, a progress bar and a run summary.',
      'Pick "Cleanup and danger popup": clear temp files and browser caches, then empty the Recycle Bin behind a confirmation. Run twice: the second run frees almost nothing.',
      'Pick "Input validation": an invalid IP turns red and Run lists exactly what to fix.',
      'Open "Full tool" and browse all nine category tabs. Amber cards with "!" are sensitive operations that ask for confirmation.',
    ],
    howItWorks: [['Connect', 'Enter the hostname or IP, an admin account (DOMAIN\\user or user@domain), a password and a transport. Test Connection checks DNS, WinRM and credentials.'], ['Choose tasks', 'Tabs by category, one card per operation. Operations that need input show validated fields. Sensitive ones are amber with "!".'], ['Run and watch', 'Live, colour-coded output with a progress bar and a Stop button. Every run ends with a tally and a saved log file.']],
    simulated: 'Nothing is executed on any machine. WinRM, PowerShell, rename, reboot and network pushes are simulated in your browser. The real tool needs WinRM enabled on the target and an account with admin rights.',
  },
  ifinex: {
    entry: 'index.html', height: 'tall',
    version: 'Web v9.6 demo, mobile app v2.11',
    lead: 'The real iFiNeX web app and Android app experience on fictional people and fake data. It never contacts a server and resets when you reload.',
    views: [['Choose', 'index.html'], ['Website', 'web.html'], ['Mobile app', 'mobile.html'], ['Both at once', 'both.html']],
    tryIt: [
      'Choose Website: you are Alex, the admin. Open Bill Tracker and look at cards, payees, who owes whom and payments.',
      'Switch the module to Squad Split: open the Weekend Trip and Flat 12 squads, add an expense and check the balances.',
      'Use the user switch to become Priya, a member, and see what a non-admin can and cannot do.',
      'Choose Mobile app: the same app in a phone frame, full screen on a real phone.',
      'Choose Both at once: add an expense in one view and watch the realtime activity feed on the other.',
      'Use Reset to restore the fake data at any time.',
    ],
    groups: [
      ['Bill Tracker', [['Cards and due days', 'Track card payments with due day, colour and reminders.'], ['Payees and parties', 'Who you owe and who owes you, with a ledger per party.'], ['Payments and plans', 'Record payments and instalment plans.']]],
      ['Expense Tracker', [['Monthly, events and trips', 'Separate trackers per type, plus custom types you define.'], ['Edit anything', 'Edit the tracker, entries and categories.'], ['Export', 'Select entries and export to Excel or PDF.']]],
      ['Squad Split', [['Several squads', 'Each squad has its own people, expenses and settlements.'], ['Shared people', 'Pick people from any squad or create new ones.'], ['Settle up', 'Balances, settlements and carry-forward from the previous month.']]],
      ['Budget and Salary Planner', [['Income and budget lines', 'Plan the month against your income.'], ['Savings goals', 'Track progress towards goals.']]],
      ['Backup and Restore', [['File backup', 'Export and import all your data.'], ['Google Drive backup', 'Optional scheduled backup to your own Drive (not available in the demo).']]],
      ['Android app', [['Same app, native wrapper', 'Alerts and in-app updates on Android.']]],
    ],
    simulated: 'All people and amounts are fictional. The backend is a fake in your browser: no database, no Google Drive and no notifications are used. Download the Android app from the GitHub Releases page to use it for real.',
  },
};
