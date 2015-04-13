(function() {
  var action, addButtonListener, app, ipc, lastTitle, remote, shell, titleElement, webview, _i, _len, _ref;

  remote = require('remote');

  app = remote.require('app');

  ipc = require('ipc');

  shell = require('shell');

  addButtonListener = function(action) {
    return document.querySelector("#btn-" + action).addEventListener('click', function(e) {
      e.preventDefault();
      return ipc.send('do-native-action', action);
    });
  };

  _ref = ['close', 'minimize'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    action = _ref[_i];
    addButtonListener(action);
  }

  document.body.classList.add('ready');

  titleElement = document.querySelector('#title');

  webview = document.getElementById("messenger");

  webview.addEventListener('did-finish-load', function() {
    return webview.focus();
  });

  webview.addEventListener('new-window', function(e) {
    e.preventDefault();
    return shell.openExternal(e.url);
  });

  window.addEventListener('focus', function() {
    return webview.focus();
  });

  lastTitle = null;

  setInterval(function() {
    var badgeResult, title;
    title = webview.getTitle();
    if (title && title !== lastTitle && title.indexOf('http') !== 0) {
      titleElement.innerHTML = title;
      badgeResult = /(?:\(([0-9])\) )?messenger/ig.exec(title);
      if (badgeResult) {
        app.dock.setBadge(badgeResult[1] || '');
      }
      return lastTitle = title;
    }
  }, 300);

  require('./js/menu');

}).call(this);
