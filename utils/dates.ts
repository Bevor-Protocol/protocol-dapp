export const timeSince = (time: Date): string => {
  const seconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);

  let interval = seconds / 31_536_000;

  if (interval > 1) {
    return Math.floor(interval) + " yrs ago";
  }
  interval = seconds / 2_592_000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hrs ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " mins ago";
  }
  return Math.floor(seconds) + " secs ago";
};
