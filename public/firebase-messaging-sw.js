importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "SeniorEase";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: payload.notification?.tag || "default",
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { entityType, entityId } = event.notification.data ?? {};
  let url = "/dashboard";

  if (entityType === "task" && entityId) {
    url = `/tasks/${entityId}`;
  } else if (entityType === "reminder") {
    url = "/reminders";
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
