import { useState, useEffect } from 'react';
import DailyForecast from './DailyForecast';

// Weather icon mapping
const weatherIcons = {
  '01d': '☀️', // clear sky (day)
  '01n': '🌙', // clear sky (night)
  '02d': '⛅', // few clouds (day)
  '02n': '⛅', // few clouds (night)
  '03d': '☁️', // scattered clouds
  '03n': '☁️', // scattered clouds
  '04d': '☁️', // broken clouds
  '04n': '☁️', // broken clouds
  '09d': '🌧️', // shower rain
  '09n': '🌧️', // shower rain
  '10d': '🌦️', // rain (day)
  '10n': '🌧️', // rain (night)
  '11d': '⚡', // thunderstorm
  '11n': '⚡', // thunderstorm
  '13d': '❄️', // snow
  '13n': '❄️', // snow
  '50d': '🌫️', // mist
  '50n': '🌫️', // mist
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_KEY = '90c71378d132e1f47bdc5b17f613ef21'; // Replace with your OpenWeather API key

  // Fetch user's location using IP-API
  const fetchUserLocation = async () => {
    try {
      const response = await fetch('http://ip-api.com/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      if (data.status === 'fail') {
        throw new Error(data.message);
      }
      return { lat: data.lat, lon: data.lon };
    } catch (error) {
      setError('Unable to retrieve your location. Please enter a city manually.');
      setLoading(false);
      return null;
    }
  };

  // Fetch weather data using OpenWeather API
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch weather data by city name
  const fetchWeatherByCity = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      fetchWeatherData(data.coord.lat, data.coord.lon); // Fetch forecast using lat/lon
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      setError(null);
      fetchWeatherByCity(searchQuery);
    }
  };

  // Fetch user's location and weather data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const location = await fetchUserLocation();
      if (location) {
        fetchWeatherData(location.lat, location.lon);
      }
    };

    fetchData();
  }, []);

  // Get custom weather icon based on OpenWeather icon code
  const getWeatherIcon = (iconCode) => {
    return weatherIcons[iconCode] || '☀️'; // Default to sun if code not found
  };

  // Aggregate 3-hour interval data into daily forecasts
  const getDailyForecasts = (list) => {
    const dailyForecasts = {};

    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]; // Extract date (YYYY-MM-DD)
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          precipitation: item.rain ? item.rain['3h'] || 0 : 0, // Precipitation in mm
          weather: item.weather[0].description,
          icon: getWeatherIcon(item.weather[0].icon),
          iconCode: item.weather[0].icon,
        };
      } else {
        // Update min and max temperatures
        if (item.main.temp_min < dailyForecasts[date].temp_min) {
          dailyForecasts[date].temp_min = item.main.temp_min;
        }
        if (item.main.temp_max > dailyForecasts[date].temp_max) {
          dailyForecasts[date].temp_max = item.main.temp_max;
        }
        // Update precipitation
        dailyForecasts[date].precipitation += item.rain ? item.rain['3h'] || 0 : 0;
      }
    });

    return Object.entries(dailyForecasts).map(([date, data]) => ({
      date,
      ...data,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">Error: {error}</p>
        <form onSubmit={handleSearch} className="mt-4 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a city name"
            className="p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-3 px-6 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  if (!weatherData || !weatherData.list) {
    return (
      <div className="text-center mt-8 text-green-700">
        No weather data available.
        <form onSubmit={handleSearch} className="mt-4 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a city name"
            className="p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-3 px-6 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  const dailyForecasts = getDailyForecasts(weatherData.list);

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg max-w-8xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a city name"
            className="p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full bg-white"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-3 px-6 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Current Weather - Simplified UI */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-green-100 m-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Main Weather Info */}
          <div className="flex items-center gap-6 pl-10">
            <span className="text-7xl">
              {getWeatherIcon(weatherData.list[0].weather[0].icon)}
            </span>
            <div>
              <p className="text-5xl font-bold text-gray-800">
                {Math.round(weatherData.list[0].main.temp)}°C
              </p>
              <p className="text-xl text-gray-600 capitalize mt-2">
                {weatherData.list[0].weather[0].description}
              </p>
            </div>
          </div>

          {/* Weather Details - Only wind, humidity, precipitation */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto pr-10">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Humidity</p>
              <p className="text-2xl font-semibold text-green-700">
                {weatherData.list[0].main.humidity}%
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Wind Speed</p>
              <p className="text-2xl font-semibold text-green-700">
                {weatherData.list[0].wind.speed} m/s
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Precipitation</p>
              <p className="text-2xl font-semibold text-green-700">
                {weatherData.list[0].rain ? weatherData.list[0].rain['3h'] || 0 : 0} mm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <DailyForecast dailyForecasts={dailyForecasts} />
    </div>
  );
};

export default Weather;