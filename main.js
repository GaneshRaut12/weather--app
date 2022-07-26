const getData = async (cityName, apiKey) => { 
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, { mode: "cors" });
  const data = await response.json();

  return data;
}

const processData = ({
  name,
  sys,
  main,
  visibility,
  wind,
  weather
}) => {
  const {
    temp,
    temp_max,
    feels_like,
    humidity,
    pressure
  } = main;
  const { speed } = wind;
  const { country } = sys;
  const { description } = weather[0];

  return {
    name,
    country,
    temp: Math.floor(temp - 273.15),
    temp_max: Math.floor(temp_max - 273.15),
    feels_like: Math.floor(feels_like - 273.15),
    humidity,
    pressure,
    visibility: Math.floor(visibility / 1000),
    windSpeed: Math.ceil(speed * 3.6),
    weather: description
  };
}

const createDataCard = (value, label) => {
  const dataCard = document.createElement("div");
  dataCard.classList.add("data-card");

  const valueSpan = document.createElement("span");
  valueSpan.textContent = value;

  const labelSpan = document.createElement("span");
  labelSpan.textContent = label;

  dataCard.append(valueSpan, labelSpan);

  return dataCard;
}

const renderWeather = ({
  name,
  country,
  temp,
  weather,
  temp_max,
  humidity,
  pressure,
  feels_like,
  visibility,
  windSpeed
}) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const location = document.createElement("h2");
  location.id = "location";
  location.textContent = `${name}, ${country}`;

  const aside = document.createElement("aside");

  const tempHeader = document.createElement("h3");
  tempHeader.id = "temp";
  tempHeader.textContent = `${temp}°C - ${weather}`;

  const tempMax = document.createElement("p");
  tempMax.id = "max-temp";
  tempMax.textContent = `Max temperature of ${temp_max}°C`;

  const info = document.createElement("div");
  info.id = "info";

  info.append(
    createDataCard(`${humidity}%`, "Humidity"),
    createDataCard(`${pressure} mb`, "Pressure"),
    createDataCard(`${feels_like}°C`, "Feels like"),
    createDataCard(`${visibility} km`, "Visibility"),
    createDataCard(`${windSpeed} km/h`, "Wind Speed")
  );

  aside.append(tempHeader, tempMax, info);

  main.append(location, aside);
}

const form = document.querySelector("form");
form.addEventListener("submit", async event => {
  event.preventDefault();

  const apiKey = "ffd79c2be71f146fbf388aa04b794f86";

  const input = document.querySelector("input");
  const cityName = input.value.trim();

  if (cityName === "") return;

  try {
    const data = await getData(cityName, apiKey);
    const weatherData = processData(data);

    renderWeather(weatherData);

    input.value = "";
  } catch (err) {
    alert("Error! City not found!");
    console.error(err);
  }
});