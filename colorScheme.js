import { getCookie } from "./cookieManager.js";
import { setCookie } from "./cookieManager.js";

let colorScheme = null;
const darkToggle = document.getElementById("dark-check");

console.log(getCookie("colorScheme"));
if (getCookie("colorScheme") == null) {
  getMode();
} else {
  colorScheme = getCookie("colorScheme").substring(
    getCookie("colorScheme").indexOf("=") + 1
  );
  if (darkToggle !== null) {
    colorScheme === "darkColorScheme"
      ? (darkToggle.checked = true)
      : (darkToggle.checked = false);
  }
  console.log(colorScheme);
}

function getMode() {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (darkMode) {
    colorScheme = "darkColorScheme";
    if (darkToggle !== null) {
      darkToggle.checked = true;
    }
  } else {
    colorScheme = "lightColorScheme";
  }
}

applyMode(colorScheme);

if (darkToggle !== null) {
  darkToggle.addEventListener("change", function () {
    if (this.checked) {
      console.log("checked");
      applyMode("darkColorScheme");
      setCookie("colorScheme", "darkColorScheme", 365);
    } else {
      console.log("off now");
      applyMode("lightColorScheme");
      setCookie("colorScheme", "lightColorScheme", 365);
    }
  });
}

function removeStylesheetByHref(href) {
  let linkElements = document.querySelectorAll('link[rel="stylesheet"]');

  for (let i = 0; i < linkElements.length; i++) {
    if (linkElements[i].getAttribute("href") === href) {
      document.head.removeChild(linkElements[i]);
      break;
    }
  }
}

function applyMode(mode) {
  removeStylesheetByHref(`./${colorScheme}.css`);

  colorScheme = mode;

  let linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = `./${mode}.css`;
  document.head.appendChild(linkElement);
}
