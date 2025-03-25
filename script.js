const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");

const searchCitySection = document.querySelector(".search-city");

const countryText = document.querySelector(".country-txt");
const tempText = document.querySelector(".temp-txt");
const conditionText = document.querySelector(".condition-txt");
const humidityText = document.querySelector(".humidity-value-txt");
const windText = document.querySelector(".wind-value-txt");
const weatherSummaryImage = document.querySelector(".weather-summary-image");
const currentDataText = document.querySelector(".current-date-txt");
const forecastItemContainer = document.querySelector(
  ".forecast-item-container"
);

const apiKey = "aac67a109597771398f412e797424696";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id === 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();

  const options = { weekday: "short", month: "short", day: "2-digit" };
  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod !== 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + "°C";
  conditionText.textContent = main;
  humidityText.textContent = humidity + "%";
  windText.textContent = speed + "M/s";

  currentDataText.textContent = getCurrentDate();
  weatherSummaryImage.src = `./assets/assets/weather/${getWeatherIcon(id)}`;

  await updateForecastInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    main: { temp },
    weather: [{ id }],
  } = weatherData;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img
              src="./assets/assets/weather/${getWeatherIcon(id)}"
              alt=""
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
          </div>`;
  forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (elem) => (elem.style.display = "none")
  );

  section.style.display = "flex";
}
