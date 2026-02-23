const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: "default" | null;
  channelId?: string;
}

export async function sendPushNotification(message: PushMessage) {
  const tokens = Array.isArray(message.to) ? message.to : [message.to];

  if (tokens.length === 0) return false;

  // Expo Push API accepts an array of messages for batch sending
  const messages = tokens.map((token) => ({
    to: token,
    title: message.title,
    body: message.body,
    data: message.data,
    sound: message.sound ?? "default",
    channelId: message.channelId ?? "orders",
  }));

  const response = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();

  // Check for errors in the batch response
  const errors = result.data?.filter(
    (r: { status: string }) => r.status === "error"
  );
  if (errors?.length > 0) {
    console.error("Some push notifications failed:", errors);
  }

  return true;
}
