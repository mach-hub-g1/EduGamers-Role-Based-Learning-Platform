importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebase = self.firebase // Declare the firebase variable

firebase.initializeApp({
  apiKey: "AIzaSyDIuoPSdOCQc6DEUqSBshKLiFdv3rbo50g",
  authDomain: "edugamers-76530.firebaseapp.com",
  projectId: "edugamers-76530",
  storageBucket: "edugamers-76530.firebasestorage.app",
  messagingSenderId: "498888509783",
  appId: "1:498888509783:web:2b9641b0cb933f9e739612",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
