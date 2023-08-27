import { getCookie } from "./mgr.js";
import { setCookie } from "./mgr.js";

let colorScheme = null;
const darkToggle = document.getElementById("dark-check");

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
      applyMode("darkColorScheme");
      setCookie("colorScheme", "darkColorScheme", 365);
    } else {
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
  removeStylesheetByHref(`./CSS/${colorScheme}.css`);

  colorScheme = mode;

  let linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = `./CSS/${mode}.css`;
  document.head.appendChild(linkElement);
}
