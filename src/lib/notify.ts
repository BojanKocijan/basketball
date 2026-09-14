/** Asks for notification permission, if it hasn't been granted or denied yet. Call from a user gesture. */
export function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {
      // ignore
    })
  }
}

/** Best-effort browser notification — silently does nothing if unsupported or not permitted. */
export function notify(title: string, body?: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body })
  } catch {
    // some browsers (e.g. mobile Safari) can throw here; nothing to recover
  }
}
