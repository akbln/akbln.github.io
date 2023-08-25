export function setCookie(cookieName, cookieValue, expirationDays) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  const cookieString = `${cookieName}=${encodeURIComponent(
    cookieValue
  )}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}

export function deleteCookie(cookieName) {
  setCookie(cookieName, null, null);
}

export function getCookie(cookieName) {
  const decoded = decodeURIComponent(document.cookie);
  const cookies = decoded.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const sub = cookies[i].substring(0, cookies[i].indexOf("="));
    if (sub === cookieName) {
      return cookies[i];
    }
  }
  return null;
}