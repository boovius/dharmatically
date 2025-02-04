export const oneWeekAgo = () => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return weekAgo;
}

export const oneMonthAgo = () => {
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getMonth() - 1);
  return monthAgo;
}