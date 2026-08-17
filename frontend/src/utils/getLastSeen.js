function getLastSeen(lastSeenAt) {
  const now = new Date();
  const last = new Date(lastSeenAt);
  const diffMs = now - last; // milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day ago`;
}

export default getLastSeen;