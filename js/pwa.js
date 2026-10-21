/* 📲 Installable web app + full-screen button */
(function () {
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
  var standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone;
  var fs = document.getElementById('fsBtn'), inst = document.getElementById('installBtn'), el = document.documentElement;
  var req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!standalone && req) {
    fs.hidden = false;
    fs.onclick = function () {
      if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else req.call(el);
    };
    document.addEventListener('fullscreenchange', function () {
      fs.textContent = document.fullscreenElement ? '⤡ Exit full screen' : '⛶ Full screen';
    });
  }
  var deferred = null;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (!standalone) inst.hidden = false; });
  inst.onclick = async function () { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; inst.hidden = true; };
  addEventListener('appinstalled', function () { inst.hidden = true; });
})();
