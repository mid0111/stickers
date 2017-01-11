(function() {
  var clipboard = new Clipboard('.btn-copy');
  clipboard.on('success', function (e) {
    e.clearSelection();
  });
})();
