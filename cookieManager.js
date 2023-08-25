function setCookie(cookieName, cookieValue, expirationDays) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  const cookieString = `${cookieName}=${encodeURIComponent(
    cookieValue
  )}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}

function deleteCookie(cookieName) {
  setCookie(cookieName, null, null);
}

function getCookie(cookieName) {
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
let mode = false;
let darkToggle = document.getElementById("dark-check");


function getMode() {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (darkMode) {
    mode = true;
    darkToggle.checked = true;
  }
}
getMode();
darkToggle.addEventListener('change', function() {
  if (this.checked) {
    console.log("checked")
  } else {
    console.log("off now")
  }
});
