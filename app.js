// ─── STATE ───────────────────────────────────────────────────────────────────
var userType = null;
var quizIdx = 0;
var quizScores = {};
var quizAnswered = [];
var multiSel = [];
var learnTab = 'stack';
var jMode = 'write';
var exploreViewer = null;
var entries = [];          // {id, date(ISO), mode, text, private, insight}
var expandedEntryId = null;

var LS_TYPE = 'mindstack_type';
var LS_ENTRIES = 'mindstack_entries';

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function loadEntries() {
  try { entries = JSON.parse(localStorage.getItem(LS_ENTRIES) || '[]'); }
  catch (e) { entries = []; }
}
function persistEntries() {
  try { localStorage.setItem(LS_ENTRIES, JSON.stringify(entries)); } catch (e) {}
}
function saveEntry(obj) {
  entries.unshift({
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    date: new Date().toISOString(),
    mode: obj.mode,
    text: obj.text,
    private: !!obj.private,
    insight: obj.insight || null
  });
  persistEntries();
}
function escapeHTML(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ─── ONBOARD ─────────────────────────────────────────────────────────────────
function buildTypeGrid(id, multi) {
  var g = document.getElementById(id);
  g.innerHTML = '';
  TYPES.forEach(function(t) {
    var b = document.createElement('button');
    b.className = 'type-btn';
    b.textContent = t;
    if (multi) {
      b.onclick = function() {
        b.classList.toggle('sel');
        multiSel = Array.from(document.querySelectorAll('#tg-multi .type-btn.sel')).map(function(x){return x.textContent;});
        document.getElementById('btn-quiz').disabled = multiSel.length === 0;
        document.getElementById('multi-hint').textContent = multiSel.length ? multiSel.length + ' selected - continue to narrow down' : 'Select one or more';
      };
    } else {
      b.onclick = function() {
        document.querySelectorAll('#tg-know .type-btn').forEach(function(x){x.classList.remove('sel');});
        b.classList.add('sel');
        userType = t;
        document.getElementById('btn-start').disabled = false;
      };
    }
    g.appendChild(b);
  });
}

buildTypeGrid('tg-know', false);
buildTypeGrid('tg-multi', true);

function setMode(m) {
  document.getElementById('m-know').classList.toggle('active', m === 'know');
  document.getElementById('m-unsure').classList.toggle('active', m === 'unsure');
  document.getElementById('sec-know').style.display = m === 'know' ? 'block' : 'none';
  document.getElementById('sec-unsure').style.display = m === 'unsure' ? 'block' : 'none';
}

function showPage(id) {
  document.querySelectorAll('.shell > .page').forEach(function(p){p.classList.remove('active');});
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function startQuiz() {
  quizIdx = 0; quizScores = {}; quizAnswered = [];
  renderQuiz();
  showPage('p-quiz');
}

function renderQuiz() {
  var q = QUIZ[quizIdx];
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-sub').textContent = q.sub;
  var oo = document.getElementById('quiz-opts');
  oo.innerHTML = '';
  q.opts.forEach(function(o, i) {
    var b = document.createElement('button');
    b.className = 'q-opt' + (quizAnswered[quizIdx] === i ? ' sel' : '');
    b.textContent = o.t;
    b.onclick = function() {
      quizAnswered[quizIdx] = i;
      Object.keys(o.s).forEach(function(k){ quizScores[k] = (quizScores[k]||0) + o.s[k]; });
      document.querySelectorAll('.q-opt').forEach(function(x){x.classList.remove('sel');});
      b.classList.add('sel');
      setTimeout(function() {
        if (quizIdx < QUIZ.length - 1) { quizIdx++; renderQuiz(); } else { showResult(); }
      }, 280);
    };
    oo.appendChild(b);
  });
  var pp = document.getElementById('quiz-prog');
  pp.innerHTML = '';
  QUIZ.forEach(function(_, i) {
    var p = document.createElement('div');
    p.className = 'q-pip' + (i < quizIdx ? ' done' : i === quizIdx ? ' cur' : '');
    pp.appendChild(p);
  });
}

function typeFromScores(s) {
  return ((s.E||0)>(s.I||0)?'E':'I')+((s.N||0)>(s.S||0)?'N':'S')+((s.T||0)>(s.F||0)?'T':'F')+((s.J||0)>(s.P||0)?'J':'P');
}

function getStack() { return STACKS[userType] || STUB_STACK; }

function showResult() {
  userType = typeFromScores(quizScores);
  document.getElementById('res-type').textContent = userType;
  document.getElementById('res-desc').textContent = TYPE_DESC[userType] || '';
  var s = getStack();
  var badges = ['b-dom','b-aux','b-ter','b-inf'];
  var html = '<div class="c-lbl">' + userType + ' cognitive stack</div>';
  s.fns.forEach(function(f, i) {
    var border = i === s.fns.length - 1 ? 'border:none' : '';
    html += '<div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:.5px solid var(--border);' + border + '"><span class="fn-badge ' + badges[i] + '">' + s.roles[i] + '</span><span style="font-size:14px;font-weight:500">' + f + '</span></div>';
  });
  document.getElementById('res-stack').innerHTML = html;
  showPage('p-result');
}

// ─── START APP / SIGN OUT ─────────────────────────────────────────────────────
function startApp() {
  try { localStorage.setItem(LS_TYPE, userType); } catch (e) {}
  loadEntries();
  document.querySelectorAll('.shell > .page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('main-app').style.display = 'block';
  document.getElementById('main-nav').style.display = 'flex';
  document.getElementById('so-type').textContent = userType;
  buildLearn();
  buildExplore();
  buildJournal();
  buildHistory();
  buildDashboard();
  switchTab('journal');
}

function signOut() {
  try { localStorage.removeItem(LS_TYPE); } catch (e) {}
  userType = null;
  quizIdx = 0; quizScores = {}; quizAnswered = []; multiSel = [];
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
  document.querySelectorAll('#tg-know .type-btn, #tg-multi .type-btn').forEach(function(b){b.classList.remove('sel');});
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-quiz').disabled = true;
  document.getElementById('multi-hint').textContent = 'Select one or more';
  setMode('know');
  showPage('p-onboard');
}

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────
var TAB_ORDER = ['journal','learn','explore','history','dashboard','signout'];
function switchTab(tab) {
  document.querySelectorAll('#main-app .page').forEach(function(p){p.style.display='none';p.classList.remove('active');});
  var el = document.getElementById('tab-' + tab);
  if (el) { el.style.display = 'block'; el.classList.add('active'); }
  var idx = TAB_ORDER.indexOf(tab);
  document.querySelectorAll('.nav-item').forEach(function(n, i){ n.classList.toggle('active', i === idx); });
  if (tab === 'history') buildHistory();
  if (tab === 'dashboard') buildDashboard();
  if (tab === 'journal') buildJournal();
}

// ─── LEARN ────────────────────────────────────────────────────────────────────
function setLearnTab(t) {
  learnTab = t;
  document.querySelectorAll('.l-tab').forEach(function(b, i) {
    b.classList.toggle('active', ['stack','glossary','growth'][i] === t);
  });
  document.getElementById('lv-stack').style.display = t === 'stack' ? 'block' : 'none';
  document.getElementById('lv-glossary').style.display = t === 'glossary' ? 'block' : 'none';
  document.getElementById('lv-growth').style.display = t === 'growth' ? 'block' : 'none';
}

function buildLearn() {
  document.getElementById('learn-title').textContent = userType + ' cognitive stack';
  var stack = getStack();
  var badges = ['b-dom','b-aux','b-ter','b-inf'];

  var sc = document.getElementById('lv-stack');
  sc.innerHTML = '';
  stack.fns.forEach(function(fn, i) {
    var d = stack.data[fn];
    if (!d || !d.what) return;
    var card = document.createElement('div');
    card.className = 'fn-card';
    var h = '<span class="fn-badge ' + badges[i] + '">' + stack.roles[i] + ' - ' + fn + '</span>';
    h += '<div class="fn-name serif">' + d.name + '</div>';
    if (d.what) h += '<div class="fn-sec"><div class="fn-sec-lbl">What it is</div><p>' + d.what + '</p></div>';
    if (d.gives) h += '<div class="fn-sec"><div class="fn-sec-lbl">What it gives you</div><p>' + d.gives + '</p></div>';
    if (d.aware) h += '<div class="fn-sec"><div class="fn-sec-lbl">What to be aware of</div><p>' + d.aware + '</p></div>';
    if (d.watch) h += '<div class="fn-sec"><div class="fn-sec-lbl">Watch for this</div><p class="fn-watch">' + d.watch + '</p></div>';
    card.innerHTML = h;
    sc.appendChild(card);
  });

  var gc = document.getElementById('lv-glossary');
  gc.innerHTML = '<p style="font-size:14px;color:var(--text2);margin-bottom:16px;line-height:1.6">The eight cognitive functions - what each one is and how it changes based on where it sits in a stack.</p>';
  GLOSSARY.forEach(function(fn) {
    var card = document.createElement('div');
    card.className = 'gloss-fn';
    var posHTML = '';
    fn.positions.forEach(function(p) {
      posHTML += '<div class="pos-item"><span class="fn-badge ' + p.badge + ' pos-badge">' + p.role + '</span><span class="pos-text">' + p.text + '</span></div>';
    });
    card.innerHTML = '<div class="gloss-symbol">' + fn.sym + '</div><div class="gloss-name">' + fn.name + '</div><p class="gloss-body">' + fn.body + '</p><div class="fn-sec-lbl" style="margin-bottom:8px">By position</div><div class="pos-row">' + posHTML + '</div>';
    gc.appendChild(card);
  });

  buildGrowth();
}

function buildGrowth() {
  var g = GROWTH[userType] || STUB_GROWTH;
  var container = document.getElementById('lv-growth');
  container.innerHTML = '';
  var sections = [
    {data: g.healthy,   bg: 'var(--green-l)',  border: '#7DC4A0',       dot: 'var(--green)'},
    {data: g.unhealthy, bg: 'var(--red-l)',    border: '#E8A0A0',       dot: 'var(--red)'},
    {data: g.growth,    bg: 'var(--purple-l)', border: 'var(--purple-m)', dot: 'var(--purple)'}
  ];
  sections.forEach(function(s) {
    var card = document.createElement('div');
    card.className = 'fn-card';
    card.style.borderColor = s.border;
    var items = '';
    s.data.points.forEach(function(p) {
      items += '<div class="growth-point"><div class="growth-dot" style="background:' + s.dot + '"></div><div class="growth-text">' + p + '</div></div>';
    });
    card.innerHTML = '<div class="fn-name serif">' + s.data.title + '</div><div style="background:' + s.bg + ';border-radius:var(--rs);padding:14px;margin-top:4px">' + items + '</div>';
    container.appendChild(card);
  });
}

// ─── EXPLORE ──────────────────────────────────────────────────────────────────
function buildExplore() {
  exploreViewer = userType;

  // Build viewer dropdown
  var sel = document.getElementById('viewer-select');
  sel.innerHTML = '';
  TYPES.forEach(function(t) {
    var opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t === userType ? t + ' (your type)' : t;
    if (t === userType) opt.selected = true;
    sel.appendChild(opt);
  });

  // Build target type grid
  var g = document.getElementById('ex-type-grid');
  g.innerHTML = '';
  TYPES.forEach(function(t) {
    var b = document.createElement('button');
    b.className = 'ex-btn';
    b.textContent = t;
    b.onclick = function() {
      document.querySelectorAll('#ex-type-grid .ex-btn').forEach(function(x){x.classList.remove('sel');});
      b.classList.add('sel');
      loadExploreDetail(t);
    };
    g.appendChild(b);
  });

  document.getElementById('ex-detail').innerHTML = '';
}

function onViewerChange(val) {
  exploreViewer = val;
  // Re-render detail if a target is already selected
  var selTarget = document.querySelector('#ex-type-grid .ex-btn.sel');
  if (selTarget) loadExploreDetail(selTarget.textContent);
}

function loadExploreDetail(type) {
  var det = document.getElementById('ex-detail');
  var viewer = exploreViewer || userType;
  var cacheKey = viewer + '-' + type;
  var d = EXPLORE_PAIRS[cacheKey] || EXPLORE_PAIRS[type+'-'+viewer] || {};
  var isSelf = type === viewer;
  var viewerLabel = viewer === userType ? 'your type (' + viewer + ')' : viewer;

  if (!d.overview) {
    det.innerHTML = '<div class="card"><p style="color:var(--text2);font-size:14px">This pair hasn\'t been updated yet.</p></div>';
    return;
  }

  var html = '<div class="card"><div class="c-lbl" style="margin-bottom:2px">' + type + ' - overview</div>' +
    '<p style="font-size:11px;color:var(--text3);margin-bottom:10px">Seen from ' + viewerLabel + '</p>' +
    '<p style="font-size:14px;color:var(--text);line-height:1.75;margin-bottom:12px">' + (d.overview || TYPE_DESC[type] || '') + '</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
    '<div style="background:var(--green-l);border-radius:var(--rs);padding:12px"><div class="fn-sec-lbl" style="margin-bottom:5px">Strengths</div><p style="font-size:13px;line-height:1.6">' + (d.strengths || '') + '</p></div>' +
    '<div style="background:var(--amber-l);border-radius:var(--rs);padding:12px"><div class="fn-sec-lbl" style="margin-bottom:5px">Blind spots</div><p style="font-size:13px;line-height:1.6">' + (d.shadow || '') + '</p></div>' +
    '</div></div>';

    html += '<div class="card"><div class="c-lbl">' + viewer + ' + ' + type + ' dynamic</div>' +
      '<p style="font-size:14px;line-height:1.75;margin-bottom:14px">' + (d.dynamic || '') + '</p>' +
      '<div style="background:var(--purple-l);border-radius:var(--rs);padding:14px;margin-bottom:10px">' +
      '<div class="fn-sec-lbl" style="margin-bottom:6px">How to work with them</div>' +
      '<p style="font-size:13px;color:#2D2580;line-height:1.7">' + (d.working || '') + '</p></div>' +
      '<div style="background:var(--red-l);border-radius:var(--rs);padding:14px">' +
      '<div class="fn-sec-lbl" style="margin-bottom:6px">Where friction happens</div>' +
      '<p style="font-size:13px;color:var(--red);line-height:1.7">' + (d.friction || '') + '</p></div></div>';
    
console.log(d);
console.log(html);
  det.innerHTML = html;
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function setJMode(m) {
  jMode = m;
  document.getElementById('jm-write').classList.toggle('active', m === 'write');
  document.getElementById('jm-scenario').classList.toggle('active', m === 'scenario');
  document.getElementById('jv-write').style.display = m === 'write' ? 'block' : 'none';
  document.getElementById('jv-scenario').style.display = m === 'scenario' ? 'block' : 'none';
}

function dayKey(iso) { return iso.slice(0, 10); }

function getStreak() {
  var days = {};
  entries.forEach(function(e){ days[dayKey(e.date)] = true; });
  var streak = 0;
  var cursor = new Date();
  // if nothing logged today, streak counts back from yesterday (still "alive")
  if (!days[dayKey(cursor.toISOString())]) cursor.setDate(cursor.getDate() - 1);
  while (days[dayKey(cursor.toISOString())]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function buildJournal() {
  document.getElementById('s-streak').textContent = getStreak();
  document.getElementById('s-entries').textContent = entries.length;
  document.getElementById('s-type').textContent = userType || '--';

  var days = {};
  entries.forEach(function(e){ days[dayKey(e.date)] = true; });
  var row = document.getElementById('streak-row');
  row.innerHTML = '';
  var letters = ['S','M','T','W','T','F','S'];
  for (var i = 6; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var key = dayKey(d.toISOString());
    var dot = document.createElement('div');
    dot.className = 's-dot' + (days[key] ? ' done' : '') + (i === 0 ? ' today' : '');
    dot.textContent = days[key] ? '\u2713' : letters[d.getDay()];
    row.appendChild(dot);
  }
}

async function callInsightAPI(system, userContent) {
  try {
    var res = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({system: system, userContent: userContent})
    });
    var data = await res.json();
    if (!res.ok) { console.error('Insight API error:', data); return null; }
    var blocks = data.content || [];
    var text = blocks.filter(function(b){ return b.type === 'text'; }).map(function(b){ return b.text; }).join('\n').trim();
    return text || null;
  } catch (err) {
    console.error('Insight fetch failed:', err);
    return null;
  }
}

function journalSystemPrompt() {
  var stack = getStack();
  var fnList = stack.fns.join('-');
  var blind = BLIND_SPOTS[userType] || '';
  return 'You are a perceptive, warm journaling companion with deep knowledge of MBTI cognitive functions. ' +
    'The person journaling is type ' + userType + ' (function stack ' + fnList + '). ' +
    'Their type\'s known recurring blind spot: ' + blind + ' ' +
    'Read what they wrote and offer a short, specific, grounded reflection (3-5 sentences) that connects it to a pattern in how they process experience. ' +
    'Be gentle, direct, and non-generic - avoid clinical language, avoid diagnosing, and do not open by labeling them ("As an INFJ..."). ' +
    'Only reference a cognitive function by name if it genuinely clarifies something; otherwise describe the pattern in plain language.';
}

async function submitFreeWrite() {
  var ta = document.getElementById('entry-input');
  var text = ta.value.trim();
  if (!text) return;
  var excluded = document.getElementById('excl-tog').checked;
  var out = document.getElementById('insight-out');
  var btn = document.getElementById('btn-submit');

  if (excluded) {
    saveEntry({mode: 'write', text: text, private: true, insight: null});
    ta.value = '';
    document.getElementById('excl-tog').checked = false;
    out.innerHTML = '<div class="private-card">Saved privately on this device - not sent anywhere.</div>';
    buildJournal();
    return;
  }

  btn.disabled = true;
  out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Reading this</div><div class="loader"><span></span><span></span><span></span></div></div>';
  var insight = await callInsightAPI(journalSystemPrompt(), text);
  btn.disabled = false;

  saveEntry({mode: 'write', text: text, private: false, insight: insight});
  if (insight) {
    out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Insight</div><p>' + escapeHTML(insight) + '</p></div>';
  } else {
    out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Insight</div><p>Could not reach the insight service just now - your entry was still saved and you can revisit it in History.</p></div>';
  }
  ta.value = '';
  document.getElementById('excl-tog').checked = false;
  buildJournal();
}

async function submitScenario() {
  var s1 = document.getElementById('sc-1').value.trim();
  var s2 = document.getElementById('sc-2').value.trim();
  var s3 = document.getElementById('sc-3').value.trim();
  if (!s1 && !s2 && !s3) return;
  var excluded = document.getElementById('excl-tog-sc').checked;
  var out = document.getElementById('insight-out');
  var btn = document.getElementById('btn-scenario');
  var combined = 'What happened: ' + s1 + '\n\nTheir immediate reaction: ' + s2 + '\n\nWhat they actually want: ' + s3;

  if (excluded) {
    saveEntry({mode: 'scenario', text: combined, private: true, insight: null});
    document.getElementById('sc-1').value = '';
    document.getElementById('sc-2').value = '';
    document.getElementById('sc-3').value = '';
    document.getElementById('excl-tog-sc').checked = false;
    out.innerHTML = '<div class="private-card">Saved privately on this device - not sent anywhere.</div>';
    buildJournal();
    return;
  }

  btn.disabled = true;
  out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Walking through this</div><div class="loader"><span></span><span></span><span></span></div></div>';
  var scenarioPrompt = journalSystemPrompt() + ' The person has broken the situation into three parts: what happened, their immediate reaction, and what they actually want. Name the pattern connecting their reaction to their wiring, then offer one concrete, specific next step toward what they said they want.';
  var insight = await callInsightAPI(scenarioPrompt, combined);
  btn.disabled = false;

  saveEntry({mode: 'scenario', text: combined, private: false, insight: insight});
  if (insight) {
    out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Insight</div><p>' + escapeHTML(insight) + '</p></div>';
  } else {
    out.innerHTML = '<div class="insight-card"><div class="insight-hdr">Insight</div><p>Could not reach the insight service just now - your entry was still saved and you can revisit it in History.</p></div>';
  }
  document.getElementById('sc-1').value = '';
  document.getElementById('sc-2').value = '';
  document.getElementById('sc-3').value = '';
  document.getElementById('excl-tog-sc').checked = false;
  buildJournal();
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildHistory() {
  var now = new Date();
  var year = now.getFullYear(), month = now.getMonth();
  document.getElementById('month-lbl').textContent = MONTH_NAMES[month] + ' ' + year;

  var byDay = {};
  entries.forEach(function(e) {
    var d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      var key = d.getDate();
      if (!byDay[key]) byDay[key] = {ai: false, priv: false};
      if (e.private) byDay[key].priv = true; else byDay[key].ai = true;
    }
  });

  var grid = document.getElementById('month-grid');
  grid.innerHTML = '';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(l) {
    var lbl = document.createElement('div');
    lbl.className = 'm-day-lbl';
    lbl.textContent = l;
    grid.appendChild(lbl);
  });
  var firstDow = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  for (var i = 0; i < firstDow; i++) {
    var blank = document.createElement('div');
    grid.appendChild(blank);
  }
  for (var day = 1; day <= daysInMonth; day++) {
    var cell = document.createElement('div');
    var info = byDay[day];
    var cls = 'day-cell';
    if (info && info.ai) cls += ' ai';
    else if (info && info.priv) cls += ' priv';
    if (day === now.getDate()) cls += ' tod';
    cell.className = cls;
    cell.textContent = day;
    grid.appendChild(cell);
  }

  renderEntriesList();
}

function renderEntriesList() {
  var list = document.getElementById('entries-list');
  list.innerHTML = '';
  if (!entries.length) {
    list.innerHTML = '<p class="empty-note">No entries yet - write your first one in the Journal tab.</p>';
    return;
  }
  entries.forEach(function(e) {
    var row = document.createElement('div');
    row.className = 'entry-row';
    var d = new Date(e.date);
    var dateStr = d.toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) + ' \u00b7 ' + d.toLocaleTimeString(undefined, {hour:'numeric', minute:'2-digit'});
    var expanded = expandedEntryId === e.id;
    var preview = expanded ? escapeHTML(e.text) : escapeHTML(e.text.length > 90 ? e.text.slice(0, 90) + '\u2026' : e.text);
    var extra = '';
    if (expanded && e.insight) {
      extra = '<div style="margin-top:8px;padding-top:8px;border-top:.5px solid var(--border)"><div class="fn-sec-lbl">Insight</div><p style="font-size:13px;color:var(--text);line-height:1.6;margin-top:3px">' + escapeHTML(e.insight) + '</p></div>';
    }
    row.innerHTML = '<div class="e-date">' + dateStr + '</div>' +
      '<div class="e-preview" style="white-space:' + (expanded ? 'normal' : 'nowrap') + '">' + preview + '</div>' +
      '<span class="e-tag ' + (e.private ? 'tag-priv' : 'tag-ai') + '">' + (e.private ? 'Private' : 'AI insight') + '</span>' +
      extra;
    row.onclick = function() {
      expandedEntryId = expandedEntryId === e.id ? null : e.id;
      renderEntriesList();
    };
    list.appendChild(row);
  });
}

// ─── PATTERNS / DASHBOARD ─────────────────────────────────────────────────────
var THEME_KEYWORDS = {
  'Future / planning': ['plan','future','going to','will ','next week','next month','goal'],
  'Relationships': ['friend','partner','family','they said','talked','conversation','relationship'],
  'Performance': ['work','project','deadline','finish','done','task','job'],
  'Self-doubt': ['doubt','unsure','worried','anxious','nervous','afraid','behind'],
  'Clarity moments': ['clear','realized','understood','makes sense','figured out']
};
var STOPWORDS = ['about','after','again','their','there','which','would','could','should','because','still','being','doing','going','think','thing','things','really','something','someone','before','where','other','these','those','around','today','never','always','maybe','right','feel','feels','felt'];

function buildDashboard() {
  var blindEl = document.getElementById('blind-spot');
  blindEl.textContent = BLIND_SPOTS[userType] || '';

  var themeEl = document.getElementById('theme-bars');
  var patEl = document.getElementById('pattern-rows');
  var wordEl = document.getElementById('word-chips');

  if (!entries.length) {
    themeEl.innerHTML = '<p class="empty-note">Add a few entries and themes will start to show up here.</p>';
    patEl.innerHTML = '<p class="empty-note">Recurring situations appear once you have logged more than a couple of entries.</p>';
    wordEl.innerHTML = '<p class="empty-note">No words yet - your journal is empty.</p>';
    return;
  }

  var allText = entries.map(function(e){ return e.text.toLowerCase(); });

  themeEl.innerHTML = '';
  Object.keys(THEME_KEYWORDS).forEach(function(theme) {
    var kws = THEME_KEYWORDS[theme];
    var count = allText.filter(function(t){ return kws.some(function(k){ return t.indexOf(k) !== -1; }); }).length;
    var pct = Math.round((count / entries.length) * 100);
    var row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = '<div class="bar-lbl">' + theme + '</div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div><div class="bar-val">' + pct + '%</div>';
    themeEl.appendChild(row);
  });

  var situations = [
    {icon:'\u{1F501}', bg:'var(--purple-l)', label:'Processing decisions alone', test: function(t){ return t.indexOf('alone') !== -1 || t.indexOf('by myself') !== -1; }},
    {icon:'\u26A1', bg:'var(--amber-l)', label:'Post-conversation replays', test: function(t){ return t.indexOf('conversation') !== -1 || t.indexOf('talked') !== -1 || t.indexOf('said') !== -1; }},
    {icon:'\u{1F3AF}', bg:'var(--blue-l)', label:'Progress vs. vision gap', test: function(t){ return t.indexOf('behind') !== -1 || t.indexOf('should be') !== -1 || t.indexOf('not enough') !== -1; }},
    {icon:'\u{1F331}', bg:'var(--green-l)', label:'Rare ease', test: function(t){ return t.indexOf('calm') !== -1 || t.indexOf('easy') !== -1 || t.indexOf('relaxed') !== -1 || t.indexOf('good day') !== -1; }}
  ];
  patEl.innerHTML = '';
  situations.forEach(function(s) {
    var count = allText.filter(s.test).length;
    var sub = count ? 'Shows up in ' + count + ' of your last ' + entries.length + ' entries' : 'Has not shown up yet';
    var row = document.createElement('div');
    row.className = 'pat-row';
    row.innerHTML = '<div class="pat-icon" style="background:' + s.bg + '">' + s.icon + '</div><div><div class="pat-lbl">' + s.label + '</div><div class="pat-sub">' + sub + '</div></div>';
    patEl.appendChild(row);
  });

  var freq = {};
  entries.forEach(function(e) {
    var words = e.text.toLowerCase().replace(/[^a-z\s']/g, '').split(/\s+/);
    words.forEach(function(w) {
      if (w.length < 5 || STOPWORDS.indexOf(w) !== -1) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  });
  var top = Object.keys(freq).sort(function(a,b){ return freq[b]-freq[a]; }).slice(0, 9);
  wordEl.innerHTML = top.length
    ? top.map(function(w){ return '<span class="chip">' + escapeHTML(w) + '</span>'; }).join('')
    : '<p class="empty-note">Write a bit more and recurring words will show up here.</p>';
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
(function init() {
  loadEntries();
  var savedType = null;
  try { savedType = localStorage.getItem(LS_TYPE); } catch (e) {}
  if (savedType && TYPES.indexOf(savedType) !== -1) {
    userType = savedType;
    startApp();
  }
})();
