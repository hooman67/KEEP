export const sendJSONResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};
