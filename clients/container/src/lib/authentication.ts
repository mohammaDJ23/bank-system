export function showPath() {
  const splitedCookie = document.cookie.split(';');
  const findedToken = splitedCookie.find(item => item.trim().startsWith('access_token'));
  const findedTokenExpiration = splitedCookie.find(item =>
    item.trim().startsWith('access_token_expiration'),
  );

  if (findedToken && findedTokenExpiration) {
    const [tokenExpirationName, tokenExpiration] = findedTokenExpiration.split('=');
    if (new Date().getTime() > new Date(tokenExpiration).getTime()) return false;
  }

  return true;
}
