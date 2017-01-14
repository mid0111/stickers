self.addEventListener('push', function(event) {
  if(event.data && event.data.json()) {
    var data = event.data.json();

    event.waitUntil(
      self.registration.showNotification(data.title, {
        lang: 'ja',
        body: data.message,
        icon: '../images/notification-icon.png'
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
