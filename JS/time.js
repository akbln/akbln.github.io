function getTime() {
  let currentTime = new Date();
  let am_pm = "AM";
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  if (hours > 12) {
    hours = hours - 12;
    am_pm = "PM";
  } else if (hours == 12) {
    am_pm = "PM";
  }
  let time =
    hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + am_pm;
  return time;
}

function updatePageTime() {
  // console.log(getTime());
  document.getElementById("time").innerHTML = getTime();
}
updatePageTime();
setInterval(function () {
  updatePageTime();
}, 3000);

document.querySelector(".logo-img").addEventListener("click", function () {
  window.location.href = "./index.html";
});

const path = window.location.pathname;
const page = path.split("/").pop();

if (page === "contact.html") {
  document.querySelector(".submit").addEventListener("click", function () {
    window.location.href = "./index.html";
  });
}
