export const requestBrowserNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return Notification.requestPermission();
};

export const showBrowserNotification = ({ title, body, tag }) => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return null;
  }

  const notification = new Notification(title, {
    body,
    tag,
    icon: "/logo192.png",
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = "/notifications";
  };

  return notification;
};
