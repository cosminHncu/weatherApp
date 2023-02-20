/////℃
////
///`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=863f242f7191482cbba7f7bf999c9391`
//1.Setting up the map
const showInfoBtn = document.querySelector(`.showInfo-btn`);
const showText = document.querySelector(`.showInfo-txt`);
const overlay = document.querySelector(`.overlay`);
const menu = document.querySelector(`.menu`);
const menuInfoLocation = document.querySelector(`.location`);
const menuInfoDateTime = document.querySelector(`.date`);
const menuInfoContinent = document.querySelector(`.continent`);
const menuIcon = document.querySelector(`.menu-info-icon`);
const menuDescription = document.querySelector(`.desc`);
const map = L.map("map").setView([51.505, -0.09], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "weatherApp",
}).addTo(map);
//GUIDE
const showInfo = () => {
  showInfoBtn.addEventListener(`click`, () => {
    overlay.classList.remove(`displayOFF`);
    showText.classList.remove(`displayOFF`);
  });
  overlay.addEventListener(`click`, () => {
    overlay.classList.add(`displayOFF`);
    showText.classList.add(`displayOFF`);
  });
};
//HELPERS
const celsius = (value) => Math.floor(value - 273.15);
const bar = (value) => value / 1000;
//GETTING DATA
const getTime = () => {
  const now = new Date();
  const mins = String(
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
  );
  const hours = String(now.getHours());
  return [hours, mins];
};
const getDate = () => {
  const months = [
    `JAN`,
    `FEB`,
    `MAR`,
    `APR`,
    `MAY`,
    `JUN`,
    `JUL`,
    `AUG`,
    `SEP`,
    `OCT`,
    `NOV`,
    `DEC`,
  ];
  const now = new Date();
  const day = new Date().getDate();
  const month = months.filter((m, indx) =>
    indx === new Date().getMonth() ? m : ``
  );
  return [day, ...month];
};
const getLocation = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=863f242f7191482cbba7f7bf999c9391`
    );
    const data = await response.json();
    const [resp] = data.results;
    console.log(resp);
    let countryData = resp.components;
    const {
      county,
      continent,
      country,
      village,
      city,
      town,
      suburb,
      neighbourhood,
      state,
    } = countryData;

    countryData = [
      county,
      continent,
      country,
      village,
      city,
      town,
      suburb,
      neighbourhood,
      state,
    ];
    return countryData;
  } catch (err) {
    menuInfoLocation.textContent = `Faild to get your location`;
    menuInfoLocation.style.border = `none`;
    menuInfoDateTime.style.color = `#fff`;
    menuDescription.textContent = ``;
    menuIcon.src = `/img/location.svg`;
  }
};
const getWeather = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=c76107c737103214c93cef455f364d83`
    );
    const data = await response.json();
    const tempData = data;
    const [weatherText] = tempData.weather;
    const windSpeed = tempData.wind;
    const windData = windSpeed.speed;
    const { temp, temp_max, temp_min, humidity, pressure } = tempData.main;
    const weather = [
      temp,
      temp_max,
      temp_min,
      humidity,
      windData,
      pressure,
      weatherText,
    ];
    return weather;
  } catch (err) {
    menuInfoLocation.textContent = `Faild to get your location`;
    menuInfoLocation.style.border = `none`;
    menuInfoDateTime.style.color = `#fff`;
    menuDescription.textContent = ``;
    menuIcon.src = `/img/location.svg`;
  }
};
//RENDER COMPONENTS
const renderMenu_date_space = (data) => {
  const day = data[0];
  const time = data[1];
  menuInfoDateTime.textContent = `${day[1]} ${day[0]} | ${time[0]}:${time[1]}`;
  menuInfoDateTime.style.color = `#555`;
};

const renderMenu_location = (data) => {
  const [
    county,
    continent,
    country,
    village,
    city,
    town,
    suburb,
    neighbourhood,
    state,
  ] = data;
  const first = city
    ? city
    : town
    ? town
    : village
    ? village
    : suburb
    ? suburb
    : neighbourhood
    ? neighbourhood
    : state
    ? state
    : county
    ? county
    : `N/A`;
  menuInfoContinent.textContent = `${continent}`;
  menuInfoContinent.classList.remove(`displayOFF`);
  menuIcon.style.marginBottom = `1.4rem`;
  menu.style.height = `90%`;
  menuInfoLocation.textContent = `${first}, ${country ? country : `N/A`}`;
};
const renderMenuIconAndDesc = (data) => {
  const weatherPack = data.pop();
  //const wCode = weatherPack.icon;
  //console.log(wCode);
  const { main, description } = weatherPack;
  menuDescription.textContent = `${main.toUpperCase()} - ${description}`;
  const getIcon = (code) => {
    let icon;
    switch (code) {
      case `Thunderstorm`:
        icon = src = "img/11.svg";
        break;
      case `Clouds`:
        icon = src = "img/4.svg";
        break;
      case `Drizzle`:
        icon = src = "img/9.svg";
        break;
      case `Rain`:
        icon = src = "img/10.svg";
        break;
      case `Snow`:
        icon = src = "img/13.svg";
        break;
      case `Clear`:
        icon = src = "img/1.svg";
        break;
      case `Mist`:
        icon = src = "img/haze.svg";
        break;
      case `Smoke`:
        icon = src = "img/haze.svg";
        break;
      case `Haze`:
        icon = src = "img/haze.svg";
        break;
      case `Dust`:
        icon = src = "img/haze.svg";
        break;
      case `Fog`:
        icon = src = "img/haze.svg";
        break;
      case `Sand`:
        icon = src = "img/haze.svg";
        break;
      case `Ash`:
        icon = src = "img/haze.svg";
        break;
      case `Squall`:
        icon = src = "img/haze.svg";
        break;
      case `Tornado`:
        icon = src = "img/haze.svg";
        break;
      default:
        alert(`hmm`);
    }
    return icon;
  };
  const icon = getIcon(main);
  menuIcon.src = icon;
};
const renderWeatherOnMap = (data) => {
  const html = `
 <div class="menu-weather ">
          <div class="menu-l temp">${celsius(
            data[0]
          )}℃<img class="weatherIcon" src="img/wi-thermometer.svg" alt=""></div>
          <div class="menu-l humidity">${
            data[3]
          }<img class="weatherIcon" src="img/wi-humidity.svg" alt=""></div>
          <div class="menu-l wind">${
            data[4]
          }<img class="weatherIcon" src="img/wind-icon.svg" alt=""></div>
          <div class="menu-l atm">${bar(
            data[5]
          )} <img class="weatherIcon" src="img/wi-barometer.svg" alt=""></div>
        </div>`;
  return html;
};

//WHERE THE ACTION STARTS
showInfo();
const popup = L.popup((className = `pop-style`));
const clickOnMap = async (e) => {
  const { lat, lng } = e.latlng;
  //next
  const dataLocation = await getLocation(lat, lng);
  const dataWeather = await getWeather(lat, lng);
  const dataTime = getTime();
  const dataDate = getDate();
  renderMenu_date_space([dataDate, dataTime]);
  renderMenu_location(dataLocation);
  renderMenuIconAndDesc(dataWeather);
  /////////POPUP CONTENT
  popup
    .setLatLng(e.latlng)
    .setContent(renderWeatherOnMap(dataWeather))
    .openOn(map);
};
map.on("click", clickOnMap);
