import { useState } from "react";
import "./App.css";

const apiKey = "db4dcf464e2d37fba075e65f8f4effbb";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Define types for weather data
interface WeatherData {
  city: string;
  temp: string;
  humidity: string;
  wind: string;
  icon: string;
}

function App() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkWeather = async (city: string) => {
    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setWeather({
          city: data.name,
          temp: Math.round(data.main.temp) + "°C",
          humidity: data.main.humidity + "%",
          wind: data.wind.speed + " km/h",
          icon: getWeatherIcon(data.weather[0].main),
        });
        setError(null);
      } else if (response.status === 404) {
        setError("Invalid city name");
        setWeather(null);
      } else {
        setError("An error occurred. Please try again.");
        setWeather(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      setWeather(null);
    }
  };

  const getWeatherIcon = (weather: string): string => {
    switch (weather) {
      case "Clouds":
        return "images/clouds.png";
      case "Clear":
        return "images/clear.png";
      case "Rain":
        return "images/rain.png";
      case "Drizzle":
        return "images/drizzle.png";
      case "Mist":
        return "images/mist.png";
      default:
        return "images/default.png";
    }
  };

  return (
    <div className="card">
      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          spellCheck="false"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => checkWeather(city)}>
          <img src="images/search.png" alt="Search" />
        </button>
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      {weather && (
        <div className="weather">
          <img src={weather.icon} className="weather-icon" alt="Weather icon" />
          <h1 className="temp">{weather.temp}</h1>
          <h2 className="city">{weather.city}</h2>
          <div className="details">
            <div className="col">
              <img src="images/humidity.png" alt="Humidity" />
              <div>
                <p className="humidity">{weather.humidity}</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col">
              <img src="images/wind.png" alt="Wind Speed" />
              <div>
                <p className="wind">{weather.wind}</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
