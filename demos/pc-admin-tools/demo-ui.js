/* Demo-only UI layer: scenarios, "view script" modal, speed, log download.
   Runs after the real page script, so it can use its globals (selected, paramValues, renderTasks, runTasks ...). */
(function () {
  'use strict';
  const D = window.DemoEngine, $ = id => document.getElementById(id);
  const GITHUB = 'https://github.com/MohamedAbdullahKhan/PC-AdminTools';

  // prefill the connection panel with harmless demo values
  $('hostname').value = 'DEMO-PC01'; $('username').value = 'CORP\\admin1'; $('password').value = 'demo-password';

  // keep the layout height right whatever the banner height is
  const bar = $('demoBar'), hint = $('scenHint');
  const fit = () => document.documentElement.style.setProperty('--demoH', (bar.offsetHeight + (hint.style.display === 'block' ? hint.offsetHeight : 0)) + 'px');
  window.addEventListener('resize', fit); fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(bar);

  // ── speed ──
  $('spd').onchange = e => { const v = parseFloat(e.target.value); D.speed = Number.isFinite(v) && v >= 0 ? v : 1; };

  // ── last-log download (the real tool saves logs on the host machine) ──
  function download(name, text) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  window.dlLog = name => { const l = D.logs.find(x => x.name === name); if (l) download(l.name, l.text); return false; };
  $('dlLast').onclick = () => { if (!D.last) { alert('Run something first -- then the log of the last run can be downloaded here.'); return; } download(D.last.name, D.last.text); };

  // ── "</> script" modal ──
  const modal = $('scrModal');
  window.showScript = function (id) {
    const op = OPS.find(o => o.id === id); let s = window.DEMO_SCRIPTS[id] || '';
    const pv = paramValues[id] || {};
    s = s.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => (pv[k] !== undefined && String(pv[k]).trim() !== '') ? pv[k] : m);
    const flags = [];
    if (op.danger) flags.push('<span class="badge d">sensitive</span>'); if (op.push) flags.push('<span class="badge">push mode</span>'); if (op.detached || op.net_disruptive) flags.push('<span class="badge">background job on target</span>'); if (op.monitor) flags.push('<span class="badge">runs inside the tool</span>');
    $('scrTitle').innerHTML = op.label + ' &nbsp;' + flags.join('');
    $('scrCode').textContent = op.monitor
      ? '# The Ping Monitor runs inside the admin tool (Python): it pings the host name and up to two IPs about once a second\n# until you press Stop, resolves the name every cycle and probes WinRM port 5985. Nothing is sent to the target PC.\n# (monitor_gen() in app.py)'
      : s;
    modal.style.display = 'flex';
  };
  $('scrClose').onclick = () => { modal.style.display = 'none'; };
  modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.style.display = 'none'; });
  $('scrCopy').onclick = () => { const t = $('scrCode').textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { $('scrCopy').textContent = 'Copied'; setTimeout(() => $('scrCopy').textContent = 'Copy', 1200); }).catch(() => { }); };

  // ── scenarios ──
  const host = () => $('hostname').value.trim() || 'DEMO-PC01';
  const net3 = ip => ip.split('.').slice(0, 3).join('.');
  function choose(ids, params, cat) {
    selected.clear(); ids.forEach(i => selected.add(i));
    Object.keys(params || {}).forEach(id => { paramValues[id] = Object.assign({}, paramValues[id] || {}, params[id]); });
    activeCat = cat || 'all'; renderTasks(); updateCount();
  }
  const staticParams = (ip, gw, extra) => Object.assign({ ADAPTER: 'Ethernet', IP: ip, MASK: '255.255.255.0', GATEWAY: gw, DNS1: net3(ip) + '.5', DNS2: '8.8.8.8' }, extra || {});
  const SCEN = {
    health: { hint: '<b>Health check</b> -- four read-only reports. Press <b>RUN SELECTED TASKS</b>. Watch the header, per-task Category/Purpose lines, colour-coded output, progress bar and the final tally.',
      load() { choose(['system_info', 'top_processes', 'disk_space_report', 'net_ip_config'], {}, 'all'); } },
    cleanup: { hint: '<b>Cleanup run</b> -- press RUN. Empty Recycle Bin is a <b>sensitive</b> operation (amber, "!"), so you get the confirmation popup. Run it twice: the second run frees almost nothing, because the simulated PC remembers what was cleaned.',
      load() { choose(['clear_user_temp', 'clear_windows_temp', 'clear_browser_cache', 'empty_recycle_bin'], {}, 'Cleanup'); } },
    pushwatch: { auto: true, hint: '<b>Push an IP, then watch it</b> -- the tool pushes <i>Static IP set command pushed to the target machine</i> (no waiting), then automatically starts the <b>Ping Monitor</b>. Watch the old IP go silent, "NOTHING answers" for a few seconds, the new IP come alive, WinRM open, and the host name catching up a few seconds later. Press <b>STOP</b> when done.',
      async load() { D.ensure(host()); const T = D.T, nip = net3(T.ip) + '.222';
        choose(['np_set_static_ip'], { np_set_static_ip: staticParams(nip, T.gw) }, 'Network Push');
        await runTasks(); if (!/PUSHED/.test($('log').textContent)) return;
        const saved = $('log').innerHTML;   // runTasks() clears the log (as the real tool does) -- keep the push result visible
        choose(['np_ping_monitor'], { np_ping_monitor: { IP1: T.ip, IP2: nip } }, 'Network Push'); runTasks();
        $('log').innerHTML = saved + '<div class="l-demo">── Ping Monitor started automatically: the push is now being applied on the target ──</div>'; } },
    typo: { hint: '<b>The gateway typo</b> -- IP 192.168.16.205 with gateway 192.168.6.1 (a real mistake from the project\'s history: the old tool silently ignored the gateway and still said "Completed"). Press RUN: the read-only pre-check refuses it and says nothing was pushed.',
      load() { D.ensure(host()); choose(['np_set_static_ip'], { np_set_static_ip: staticParams('192.168.16.205', '192.168.6.1', { DNS1: '196.1.1.55', DNS2: '196.1.1.57' }) }, 'Network Push'); } },
    rollback: { hint: '<b>Auto-rollback safety net</b> -- this verified "Set Static IP" is pointed at an address on a <i>different network</i> (10.20.30.40). With <b>Auto-rollback ticked</b> the PC puts its old settings back and you get <b>REVERTED</b>. Now untick the box and run again: the tool loses the PC and reports TARGET_NOT_REACHED.',
      load() { D.ensure(host()); choose(['rt_set_static_ip'], { rt_set_static_ip: staticParams('10.20.30.40', '10.20.30.1', { ROLLBACK: 'true' }) }, 'Remote Tools'); } },
    validation: { hint: '<b>Input validation</b> -- the IP below is invalid (999.1.1.1). The field turns red, and pressing RUN lists exactly what to fix. The real server re-checks every value too, so a hand-made request cannot sneak a bad value through.',
      load() { choose(['rt_set_static_ip'], { rt_set_static_ip: { ADAPTER: 'Ethernet', IP: '999.1.1.1', MASK: '255.255.255.0', GATEWAY: '192.168.10.1' } }, 'Remote Tools'); } },
    reboot: { hint: '<b>Forced restart</b> -- press RUN, confirm the warning. The simulated PC goes down for ~28 s. Then run the <b>Ping Monitor</b> (Network Push tab, run it alone) to watch it disappear and come back.',
      load() { choose(['pr_force_restart'], {}, 'Power Recycle'); } },
    quick: { hint: '<b>Quick clean-up</b> -- temp files, browser cache, recycle bin, then a disk report. Press <b>RUN SELECTED TASKS</b>; the Recycle Bin step is sensitive and asks for confirmation.',
      load() { choose(['clear_user_temp', 'clear_windows_temp', 'clear_browser_cache', 'empty_recycle_bin', 'disk_space_report'], {}, 'sel'); } },
    inline: { hint: '<b>Change IP inline + reconnect</b> -- the verified Set Static IP applies the address and the connection drops (expected). The tool reconnects on the <b>NEW</b> IP and prints the status. Watch the tiles above the log.',
      load() { D.ensure(host()); const T = D.T; choose(['rt_set_static_ip'], { rt_set_static_ip: staticParams(net3(T.ip) + '.231', T.gw, { ROLLBACK: 'true' }) }, 'sel'); } },
    rename: { hint: '<b>Rename PC + restart</b> -- domain-joined rename with automatic restart. Tasks that follow are skipped while the PC reboots.',
      load() { choose(['system_info', 'rt_rename_pc_domain', 'run_dism'], { rt_rename_pc_domain: { NEW_NAME: 'FINANCE-PC07', AUTO_RESTART: 'true' } }, 'sel'); } },
    mapdrive: { hint: '<b>Map a network drive</b> -- map Z: for a user, then list that user\'s mapped drives.',
      load() { choose(['rt_map_network_drive', 'rt_list_mapped_drives'], { rt_map_network_drive: { SHARE_PATH: '\\\\fs01\\shared', DRIVE_LETTER: 'Z', USER_ACCOUNT: 'CORP\\demo.user', APPLY_NOW: 'true', REPLACE_EXISTING: 'false' }, rt_list_mapped_drives: { USER_ACCOUNT: 'CORP\\demo.user' } }, 'sel'); } },
    vss: { hint: '<b>Shadow copies (VSS)</b> -- view, delete the oldest, resize storage to 20GB, then check the size report.',
      load() { choose(['rt_vss_view', 'rt_vss_delete_oldest', 'rt_vss_set_maxsize', 'rt_vss_size_report'], { rt_vss_delete_oldest: { VOLUME: 'C' }, rt_vss_set_maxsize: { VOLUME: 'C', MAX_SIZE: '20GB', STORAGE_VOLUME: 'C' } }, 'sel'); } },
    longjobs: { hint: '<b>Long jobs: SFC, DISM, CHKDSK</b> -- these run as background jobs on the target. Watch the \"still running\" heartbeat lines.',
      load() { choose(['run_sfc', 'run_dism', 'disk_health_scan'], {}, 'sel'); } },
  };
  $('scenGo').onclick = async () => {
    const k = $('scen').value; if (!k) { alert('Pick a scenario first.'); return; }
    if (running) { alert('A run is in progress -- press STOP first.'); return; }
    hint.innerHTML = SCEN[k].hint; hint.style.display = 'block'; fit();
    document.getElementById('log').innerHTML = ''; await SCEN[k].load();
  };

  // ── welcome text in the log pane ──
  const L = (t, x) => logLine(t, x);
  L('hdr', 'LIVE DEMO of the PC Admin & Performance Tool (Web-Service Edition)');
  L('dim', '  This is the real web interface. Behind it, a browser-side stand-in plays the part of the server and of a');
  L('dim', '  fictional Windows PC called ' + 'DEMO-PC01' + '. Nothing you do here reaches a real computer.');
  L('dim', '');
  L('info', '  1. Press "Test Connection" (any password works), 2. pick tabs and tick tasks, 3. press RUN SELECTED TASKS.');
  L('info', '  Or pick a ready-made scenario in the blue bar above. Use "</> script" on any task to read the real PowerShell it runs.');
  L('dim', '  Tip: host names containing "unreachable" or ending ".invalid" simulate failures; password "wrong" simulates a bad login.');

  // deep link from the landing page: demo/?scenario=pushwatch
  const q = new URLSearchParams(location.search).get('scenario');
  if (q && SCEN[q]) { $('scen').value = q; setTimeout(() => $('scenGo').click(), 500); }

  // ── V19-style scenario cards, virtual PC tiles, log buttons ──
  document.querySelectorAll('#scenCards button').forEach(b => { b.onclick = () => { $('scen').value = b.dataset.scen; $('scenGo').click(); $('scenHint').scrollIntoView({ block: 'nearest' }); }; });
  $('clrLog').onclick = () => { $('log').innerHTML = ''; };
  $('cpLog').onclick = () => { const t = $('log').textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { $('cpLog').textContent = 'Copied'; setTimeout(() => $('cpLog').textContent = 'Copy log', 1200); }).catch(() => { }); };
  const dur = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 86400) + 'd ' + Math.floor(s % 86400 / 3600) + 'h ' + Math.floor(s % 3600 / 60) + 'm'; };
  function tiles() {
    const T = D.T, down = D.isDown(), link = $('vpLink');
    $('vpName').textContent = T.name + ' - ' + T.domain;
    $('vpNet').textContent = T.ip + ' /' + T.prefix + (T.dhcp ? ' (DHCP)' : ' (static)');
    link.textContent = down ? 'DOWN (no answer)' : (T.unreachable.has(T.ip) ? 'UP but not routable from here' : 'UP at ' + T.ip); link.className = down ? 'down' : 'up';
    $('vpDns').textContent = T.host === T.ip ? T.nameIp : T.name.toLowerCase() + ' -> ' + T.nameIp;
    $('vpUp').textContent = down && Date.now() < T.rebootUntil ? 'rebooting' : dur(Date.now() - T.bootTime);
    $('vpClk').textContent = D.clock(new Date());
  }
  tiles(); setInterval(tiles, 1000);
})();
