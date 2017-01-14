var mylib = mylib || (function() {
  function init(serverBaseUrl) {
    if(!navigator.serviceWorker) {
      // push 通知未対応の場合はなにもしない
      return false;
    }

    navigator.serviceWorker.register('assets/js/service-worker.js')
      .then(function(registration) {
        return registration.pushManager.getSubscription()
          .then(function(subscription) {
            if(subscription) {
              return subscription;
            }

            return registration.pushManager.subscribe({
              userVisibleOnly: true
            });
          });
      })
      .then(function(subscription) {
        fetch(serverBaseUrl + '/register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            key: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))))
              .replace(/\+/g, '-').replace(/\//g, '_'),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
              .replace(/\+/g, '-').replace(/\//g, '_')
          })
        });
      })
      .catch(function(err) {
        console.log(err);
      });

    return true;
  };

  var clipboard = new Clipboard('.btn-copy');
  clipboard.on('success', function (e) {
    e.clearSelection();
  });

  return {
    init: init
  };
})();
