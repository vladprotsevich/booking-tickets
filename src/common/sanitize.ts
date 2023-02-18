export const sanitizeBody = function (body: object) {
  const sanitiazed = Object.entries(body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {},
  );
  return sanitiazed;
};
