export const getDaysArray = function (s, e) {
  const a = [];
  for (const d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }
  return a;
};
