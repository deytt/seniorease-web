import { getMessaging, isSupported } from "firebase/messaging";
import { firebaseApp } from "./config";

// Initialize FCM only if supported (not supported in server-side rendering)
export const messaging = isSupported().then((supported) => {
  if (supported) {
    return getMessaging(firebaseApp);
  }
  return null;
});

export default firebaseApp;
