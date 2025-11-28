export function formatChatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const oneDay = 24 * 60 * 60 * 1000;
  const diff = now - date;

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  if (diff < 7 * oneDay) {
    return date.toLocaleDateString([], { weekday: "short" }); // Mon, Tue
  }

  return date.toLocaleDateString([], { day: 'numeric', month: 'short' }); // 2 Nov
}
