/* Visit-counter footer addon for kcetprep.
   Mirrors the assets/footer.js pattern from ~/pers/karate/ — additive
   variant: appends a hits.sh badge to whichever <footer> the page
   already has, so per-page footer content (source attribution, nav,
   timestamps) stays intact. */

(function () {
  var footer = document.querySelector('footer');
  if (!footer) return;

  // Site-wide counter (path = repo). hits.sh keys by full URL so this
  // captures every page under /kcetprep/ as one tally.
  var counterURL =
    'https://hits.sh/rajeshgheware.github.io/kcetprep.svg' +
    '?style=flat-square&label=visits&color=2563a8&labelColor=0b6b3a';

  var span = document.createElement('span');
  span.className = 'visit-counter';
  span.innerHTML =
    '<a href="https://github.com/rajeshgheware/kcetprep" ' +
    'target="_blank" rel="noopener" ' +
    'style="border:0;display:inline-block;" ' +
    'title="View source on GitHub">' +
    '<img src="' + counterURL + '" alt="visits" ' +
    'style="vertical-align:middle;height:18px;"></a>';
  footer.appendChild(span);
})();
