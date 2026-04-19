// KCET concept-audio floating dock — multi-chapter, auto-wired.
// Include on any Day visual-revision page:
//   <link rel="stylesheet" href="../audio/player.css">
//   <script src="../audio/player.js" defer></script>
// Then annotate chapter sections:
//   <section class="chap" data-audio="../audio/dayN-chapter.mp3"
//            data-audio-title="Coordination" data-audio-duration="5:25">
(function(){
  function init(){
    var sections = document.querySelectorAll('section.chap[data-audio]');
    if (!sections.length) return;

    // Inject dock if the page didn't declare it inline
    var dock = document.getElementById('adDock');
    if (!dock) {
      dock = document.createElement('div');
      dock.className = 'ad-dock';
      dock.id = 'adDock';
      dock.hidden = true;
      dock.innerHTML =
        '<button class="ad-pill" id="adPill" type="button" aria-label="Open concept audio">' +
          '<span class="ad-dot" aria-hidden="true"></span>' +
          '<span id="adPillText">🎧 Listen</span>' +
        '</button>' +
        '<div class="ad-panel" role="region" aria-label="Concept audio player">' +
          '<div class="ad-hd">' +
            '<div class="ad-title" id="adTitle">—</div>' +
            '<button class="ad-x" id="adClose" type="button" aria-label="Minimise">×</button>' +
          '</div>' +
          '<div class="ad-sub" id="adSub">Concept audio</div>' +
          '<audio id="adAudio" controls preload="metadata"></audio>' +
          '<div class="ad-speeds">' +
            '<span>Speed</span>' +
            '<button class="ad-speed active" data-sp="1">1×</button>' +
            '<button class="ad-speed" data-sp="1.25">1.25×</button>' +
            '<button class="ad-speed" data-sp="1.5">1.5×</button>' +
            '<button class="ad-speed" data-sp="1.75">1.75×</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(dock);
    }
    var pill = document.getElementById('adPill');
    var pillText = document.getElementById('adPillText');
    var closeBtn = document.getElementById('adClose');
    var titleEl = document.getElementById('adTitle');
    var subEl = document.getElementById('adSub');
    var audio = document.getElementById('adAudio');
    var speedBtns = dock.querySelectorAll('.ad-speed');

    var currentSection = null;
    var storeKeyFor = function(src){ return 'kcet-audio-pos:' + src; };

    function savePos(){
      if (!currentSection) return;
      var src = currentSection.getAttribute('data-audio');
      if (src && audio.currentTime > 0)
        localStorage.setItem(storeKeyFor(src), String(audio.currentTime));
    }

    function loadSection(sec, shouldPlay){
      if (currentSection === sec){
        if (shouldPlay) audio.paused ? audio.play().catch(function(){}) : audio.pause();
        dock.classList.add('open');
        return;
      }
      savePos();
      var src = sec.getAttribute('data-audio');
      var t = sec.getAttribute('data-audio-title') || 'Concept audio';
      var dur = sec.getAttribute('data-audio-duration') || '';
      audio.src = src;
      titleEl.textContent = t;
      subEl.textContent = 'Concept audio' + (dur ? ' · ' + dur : '') + ' · ElevenLabs';
      pillText.textContent = '🎧 ' + t + (dur ? ' · ' + dur : '');
      currentSection = sec;

      audio.addEventListener('loadedmetadata', function once(){
        var saved = parseFloat(localStorage.getItem(storeKeyFor(src)) || '0');
        if (saved > 0 && saved < (audio.duration || Infinity) - 2) audio.currentTime = saved;
        audio.removeEventListener('loadedmetadata', once);
        if (shouldPlay) audio.play().catch(function(){});
      });

      sections.forEach(function(s){
        var chip = s.querySelector('.ad-chip');
        if (chip) chip.classList.toggle('active', s === sec);
      });

      dock.classList.add('open');
    }

    // Inject 🎧 chips into each chapter header
    sections.forEach(function(sec){
      var header = sec.querySelector('.chap-h');
      if (!header || header.querySelector('.ad-chip')) return;
      var t = sec.getAttribute('data-audio-title') || '';
      var dur = sec.getAttribute('data-audio-duration') || '';
      var chip = document.createElement('button');
      chip.className = 'ad-chip';
      chip.type = 'button';
      chip.innerHTML = '🎧 ' + (dur ? dur : 'listen');
      chip.title = 'Play concept audio: ' + t;
      chip.addEventListener('click', function(e){
        e.stopPropagation();
        loadSection(sec, true);
      });
      var badge = header.querySelector('.badge');
      if (badge) header.insertBefore(chip, badge);
      else header.appendChild(chip);
    });

    audio.playbackRate = 1;

    audio.addEventListener('timeupdate', function(){ if (!audio.paused) savePos(); });
    audio.addEventListener('ended', function(){
      if (currentSection)
        localStorage.removeItem(storeKeyFor(currentSection.getAttribute('data-audio')));
    });
    audio.addEventListener('play', function(){ pill.setAttribute('data-playing','true'); });
    audio.addEventListener('pause', function(){ pill.setAttribute('data-playing','false'); });

    pill.addEventListener('click', function(){ dock.classList.add('open'); });
    closeBtn.addEventListener('click', function(){ dock.classList.remove('open'); });

    speedBtns.forEach(function(b){
      b.addEventListener('click', function(){
        audio.playbackRate = parseFloat(b.getAttribute('data-sp'));
        speedBtns.forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
      });
    });

    document.addEventListener('keydown', function(e){
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'k' || e.key === 'K'){ e.preventDefault(); audio.paused ? audio.play().catch(function(){}) : audio.pause(); }
      else if (e.key === 'j' || e.key === 'J'){ audio.currentTime = Math.max(0, audio.currentTime - 10); }
      else if (e.key === 'l' || e.key === 'L'){ audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); }
    });

    // Pre-load first chapter's metadata (don't autoplay)
    loadSection(sections[0], false);
    dock.classList.remove('open');
    dock.hidden = false;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
