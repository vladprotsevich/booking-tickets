export default () => ({
  access_token_key: process.env.JWT_SECRET_ACCESS_KEY,
  refresh_token_key: process.env.JWT_SECRET_REFRESH_KEY,
});
