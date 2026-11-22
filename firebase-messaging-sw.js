
importScripts(
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyCb4QkKbMyFmS62EYJqIuzrnZRDHaMtZWk',
  authDomain: 'manat-yeda.firebaseapp.com',
  projectId: 'manat-yeda',
  storageBucket: 'manat-yeda.firebasestorage.app',
  messagingSenderId: '757701710296',
  appId: '1:757701710296:web:409beb00189754b984a2ad'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {

  const data = payload.data || {};

  const title = data.title || 'מנת ידע';

  const options = {
    body: data.body || 'פרק חדש מחכה לכם!',
    data: {
      category: data.category || 'daily'
    }
  };

  return self.registration.showNotification(
    title,
    options
  );

});

self.addEventListener('notificationclick', event => {

  event.notification.close();

  const category =
    event.notification.data?.category === 'nba'
      ? 'nba'
      : 'daily';

  const url =
    'https://manatyeda-web.github.io/manat-yeda/?podcast='
    + category;

  event.waitUntil(clients.openWindow(url));

});
