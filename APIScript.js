// Boolean value that represents if the first call of all apis is finished
// Its set true by the last call of an API function

let bool = false;

// Function to get either current time or current time + amount of hours as a full string of data

function getCertainTime(hoursToAdd) {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentTime = new Date();
  let newTime = new Date(currentTime.getTime() + hoursToAdd * 3600 * 1000);
  let hours = newTime.getHours();
  let minutes = newTime.getMinutes();
  let dayOfWeek = daysOfWeek[newTime.getDay()];
  let date = newTime.getDate();
  let month = monthsOfYear[newTime.getMonth()];
  let am_pm = "AM";
  if (hours > 12) {
    hours = hours - 12;
    am_pm = "PM";
  } else if (hours == 12) {
    am_pm = "PM";
  }
  let fulltime =
    dayOfWeek +
    " " +
    month +
    " " +
    date +
    ",  " +
    hours +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    am_pm;
  return fulltime;
}

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

function updateTableTime() {
  for (let i = 0; i < 6; i++) {
    let string = "t" + i;
    document.getElementById(string).innerHTML = getCertainTime(i);
  }
}

function updatePageTime() {
  // console.log(getTime());
  document.getElementById("time").innerHTML = getTime();
}
updatePageTime();

// Set initial table time values
updateTableTime();

// Get IP Function using ipify.org API
const getIp = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  // Return an IP without " "
  return JSON.stringify(data.ip).replace(/"|'/g, "");
};

// Get IP
const ip = await getIp();
console.log(ip);

// Make Location Request String
const LocationRequest = "https://ipapi.co/" + ip;

// Get location function
const getLocation = async (LRequest) => {
  const res = await fetch(LRequest);
  const data = await res.json();
  return data;
};

// Get longtitude and latitude
let current_Lon = await getLocation(LocationRequest + "/longitude");
let current_Lat = await getLocation(LocationRequest + "/latitude");

// Get elevation function
const getElevation = async (lat, lon) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`
  );
  const data = await res.json();
  return data.elevation[0];
};

// Call elevation function
let current_Elevation = await getElevation(current_Lat, current_Lon);

const getTemperature = async (lat, lon, elev) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=${elev}&hourly=temperature_2m&forecast_days=1`
  );
  const data = await res.json();
  bool = true;
  // console.log(data.hourly.temperature_2m);
  return data.hourly.temperature_2m;
};

// This function sets geoData (Address) using Open Street Maps free api
// When testing some values had a (suburb or village or city) in their address field
// so use of hasOwnProperty to check if the adress field has that property or not was needed

const getGeoData = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  const data = await res.json();
  // console.log(data);

  if (data.address.hasOwnProperty("suburb")) {
    return data.address.suburb + ", " + data.address.country;
  } else if (data.address.hasOwnProperty("village")) {
    return data.address.village + ", " + data.address.country;
  } else if (data.address.hasOwnProperty("town")) {
    return data.address.town + ", " + data.address.country;
  } else if (data.address.hasOwnProperty("city")) {
    return data.address.city + ", " + data.address.country;
  } else {
    return data.address.country;
  }
};

let geoData = await getGeoData(current_Lat, current_Lon);

document.getElementById("address").innerHTML = geoData;

let current_Temp = await getTemperature(
  current_Lat,
  current_Lon,
  current_Elevation
);

for (let i = 0; i < current_Temp.length; i++) {
  current_Temp[i] = Math.round(current_Temp[i]);
}

// console.log(current_Temp);

// This function updates weather data in table and is called once at loading of the page (to be later called by updateContent function)

const updateTable = () => {
  for (let i = 0; i < 6; i++) {
    let string = "w" + i;
    document.getElementById(string).innerHTML = current_Temp[i] + "° C";
  }
};
updateTable();

//Embeded code to use predefined map from leafjs (modified to change the current saved coordinates on click and sets default location by ip)

let map = L.map("map").setView([current_Lat, current_Lon], 13); // Set initial view of the map to user location via previous coordinates aquired by ip

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

let marker = L.marker([current_Lat, current_Lon]).addTo(map); // Add a marker to the map

map.on("click", function (e) {
  marker.setLatLng(e.latlng); // Update the marker position to the location where the user clicked

  let functionObject = e.latlng;
  current_Lat = functionObject.lat;
  current_Lon = functionObject.lng;
});

//This function updates the saved elevation variable using the coordinates that were modified by the map
// Then gets a new set of tempreture data for that location and then updates the tempreture table
// Then updates the geoData saved (address) using the geodata function and the new coordinates and updates location field
// To be called on click of the update button

const updateContent = async () => {
  document.getElementById("address").innerHTML = "Loading...";
  current_Elevation = await getElevation(current_Lat, current_Lon);
  current_Temp = await getTemperature(
    current_Lat,
    current_Lon,
    current_Elevation
  );
  for (let i = 0; i < current_Temp.length; i++) {
    current_Temp[i] = Math.round(current_Temp[i]);
  }
  await updateTable();

  geoData = await getGeoData(current_Lat, current_Lon);

  document.getElementById("address").innerHTML = geoData;
};

// Button to press that updates content by calling the updateContent function

let button1 = document.getElementById("mapButton");
button1.addEventListener("click", async () => {
  await updateContent();
});
