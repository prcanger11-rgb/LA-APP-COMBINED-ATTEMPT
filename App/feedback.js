// ─── FEEDBACK PROMPTS ──────────────────────────────────────────────────────
// Self-contained on purpose: no dependency on app.js internals, so it can't
// break the app if something here goes wrong. Tracks ACTIVE time (mouse /
// keyboard / scroll / touch activity while the tab is in the foreground),
// not wall-clock time - someone who opens the app and walks away won't get
// pinged while they're gone.
//
// Fires at 5, 20, and 60 active minutes, once each, then stops for the
// rest of the browser session (sessionStorage - closing the tab resets it,
// so a returning visitor gets asked again rather than being locked out
// forever after one visit).
//
// Replace YOUR_FEEDBACK_FORM_ID below with your Formspree form ID
// (same pattern as the landing page waitlist form).

(function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeeybvvn';
  var MILESTONES = [
    { minutes: 0.2,  key: 'fb_5',  prompt: 'Quick gut check - what\'s your first impression?' },
    { minutes: 0.6, key: 'fb_20', prompt: 'You\'ve been at this a bit. Anything confusing, missing, or annoying so far?' },
    { minutes: 1, key: 'fb_60', prompt: 'Last one, promise. What would make you actually keep using this?' }
  ];
  var IDLE_LIMIT_MS = 60 * 1000; // stop counting "active" after 60s of no interaction

  var activeSeconds = 0;
  var lastActivity = Date.now();
  var modalOpen = false;

  function shownSet() {
    try { return JSON.parse(sessionStorage.getItem('mindstack_fb_shown') || '[]'); }
    catch (e) { return []; }
  }
  function markShown(key) {
    var s = shownSet();
    if (s.indexOf(key) === -1) s.push(key);
    try { sessionStorage.setItem('mindstack_fb_shown', JSON.stringify(s)); } catch (e) {}
  }

  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
    document.addEventListener(evt, function () { lastActivity = Date.now(); }, { passive: true });
  });

  setInterval(function () {
    if (modalOpen) return;
    var visible = document.visibilityState === 'visible';
    var recentlyActive = (Date.now() - lastActivity) < IDLE_LIMIT_MS;
    if (!visible || !recentlyActive) return;

    activeSeconds++;
    var activeMinutes = activeSeconds / 60;
    var shown = shownSet();

    for (var i = 0; i < MILESTONES.length; i++) {
      var m = MILESTONES[i];
      if (activeMinutes >= m.minutes && shown.indexOf(m.key) === -1) {
        showFeedbackModal(m);
        break; // one at a time
      }
    }
  }, 1000);

  function showFeedbackModal(milestone) {
    modalOpen = true;
    markShown(milestone.key);

    var overlay = document.createElement('div');
    overlay.className = 'fb-overlay';
    overlay.innerHTML =
      '<div class="fb-modal">' +
        '<button class="fb-close" aria-label="Close">&times;</button>' +
        '<div class="fb-body">' +
          '<div class="fb-title serif">Got a sec?</div>' +
          '<p class="fb-prompt">' + milestone.prompt + '</p>' +
          '<textarea class="fb-input" placeholder="Type whatever comes to mind - even one sentence helps."></textarea>' +
          '<div class="fb-actions">' +
            '<button class="fb-skip">Not now</button>' +
            '<button class="fb-submit">Send feedback</button>' +
          '</div>' +
          '<div class="fb-msg"></div>' +
        '</div>' +
        '<div class="fb-thanks" style="display:none">' +
          '<div class="fb-check">&#10003;</div>' +
          '<div class="fb-title serif">Thanks</div>' +
          '<p class="fb-prompt">Genuinely helpful. Back to it.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      modalOpen = false;
    }

    overlay.querySelector('.fb-close').onclick = close;
    overlay.querySelector('.fb-skip').onclick = close;
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    overlay.querySelector('.fb-submit').onclick = function () {
      var btn = overlay.querySelector('.fb-submit');
      var text = overlay.querySelector('.fb-input').value.trim();
      var msg = overlay.querySelector('.fb-msg');
      if (!text) { msg.textContent = 'Type something first - even a few words.'; return; }

      btn.disabled = true;
      btn.textContent = 'Sending...';
      msg.textContent = '';

      var userType = null;
      try { userType = localStorage.getItem('mindstack_type'); } catch (e) {}

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          milestone: milestone.key,
          active_minutes: milestone.minutes,
          feedback: text,
          mbti_type: userType || 'unknown',
          page: window.location.href
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('failed');
          overlay.querySelector('.fb-body').style.display = 'none';
          overlay.querySelector('.fb-thanks').style.display = 'block';
          if (typeof gtag === 'function') {
            gtag('event', 'feedback_submitted', { milestone: milestone.key });
          }
          setTimeout(close, 1600);
        })
        .catch(function () {
          msg.textContent = 'Could not send just now - try again in a moment.';
          btn.disabled = false;
          btn.textContent = 'Send feedback';
        });
    };
  }
})();
