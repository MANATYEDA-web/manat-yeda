
import {
  initializeApp,
  getApps,
  getApp
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCb4QkKbMyFmS62EYJqIuzrnZRDHaMtZWk',
  authDomain: 'manat-yeda.firebaseapp.com',
  projectId: 'manat-yeda',
  storageBucket: 'manat-yeda.firebasestorage.app',
  messagingSenderId: '757701710296',
  appId: '1:757701710296:web:409beb00189754b984a2ad'
};

const VAPID_KEY =
  'BEIrtiH_g5Yf3jvnBP2cEVeUdtpbMYWR__SRv9skLQNmU462l8OOKjmGAmotUcDEm1qgAnJlBbHPNCgelzKcQjI';

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const panel = document.createElement('div');

panel.className = 'notice';

const heading = document.createElement('strong');

heading.textContent = '🔔 התראות על פרקים חדשים';

const description = document.createElement('p');

description.textContent =
  'קבלו התראה בכל פעם שפרק חדש מוכן להאזנה.';

const button = document.createElement('button');

button.className = 'btn secondary';

button.textContent = 'הפעלת התראות';

const status = document.createElement('p');

status.className = 'muted small';

status.setAttribute('role', 'status');

panel.append(
  heading,
  description,
  button,
  status
);

document.querySelector('.auth').after(panel);

let messaging;

async function prepareNotifications() {

  if (
    !('Notification' in window) ||
    !('serviceWorker' in navigator) ||
    !await isSupported()
  ) {

    button.disabled = true;

    status.textContent =
      'הדפדפן אינו תומך בהתראות במצב הנוכחי.';

    return;

  }

  messaging = getMessaging(app);

  onMessage(messaging, async payload => {

    const data = payload.data || {};

    const registration =
      await navigator.serviceWorker.getRegistration();

    if (registration) {

      await registration.showNotification(
        data.title || 'מנת ידע',
        {
          body: data.body || 'פרק חדש מחכה לכם!',
          data: {
            category: data.category || 'daily'
          }
        }
      );

    }

  });

  if (Notification.permission === 'granted') {

    button.textContent = 'בדיקת התראות';

    status.textContent =
      'הרשאת התראות כבר ניתנה.';

  }

  button.onclick = async () => {

    button.disabled = true;

    status.textContent = 'מגדיר התראות...';

    try {

      const permission =
        await Notification.requestPermission();

      if (permission !== 'granted') {

        status.textContent =
          'לא ניתנה הרשאה לקבלת התראות.';

        return;

      }

      const registration =
        await navigator.serviceWorker.register(
          './firebase-messaging-sw.js'
        );

      await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (!token) {

        throw new Error('No notification token');

      }

      localStorage.setItem(
        'manatNotificationToken',
        token
      );

      await registration.showNotification(
        '🎙️ מנת ידע',
        {
          body: 'מנגנון ההתראות פועל בהצלחה!',
          data: {
            category: 'daily'
          }
        }
      );

      status.textContent =
        'ההתראות הוגדרו בהצלחה במכשיר זה.';

      button.textContent = 'בדיקת התראות';

    } catch (error) {

      console.error(error);

      status.textContent =
        'שגיאה בהגדרת ההתראות: ' +
        error.message;

    } finally {

      button.disabled = false;

    }

  };

}

prepareNotifications().catch(error => {

  button.disabled = true;

  status.textContent =
    'לא ניתן להפעיל התראות: ' +
    error.message;

});
