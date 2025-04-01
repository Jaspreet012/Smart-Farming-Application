import { useState, useEffect } from 'react';
import DailyForecast from './DailyForecast';

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
          icon: item.weather[0].icon,
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
    return <div className="text-center mt-8 text-green-700">Loading weather data...</div>;
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
            className="p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  if (!weatherData || !weatherData.list) {
    return <div className="text-center mt-8 text-green-700">No weather data available.</div>;
  }

  const dailyForecasts = getDailyForecasts(weatherData.list);

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a city name"
            className="p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Current Weather */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Current Weather</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`}
              alt={weatherData.list[0].weather[0].description}
              className="w-12 h-12"
            />
            <p className="text-lg text-gray-700 capitalize">
              {weatherData.list[0].weather[0].description}
            </p>
          </div>
          <div className="flex space-x-6">
            <div>
              <p className="text-gray-600">Temperature</p>
              <p className="text-gray-800 font-medium">{weatherData.list[0].main.temp}°C</p>
            </div>
            <div>
              <p className="text-gray-600">Humidity</p>
              <p className="text-gray-800 font-medium">{weatherData.list[0].main.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-600">Wind Speed</p>
              <p className="text-gray-800 font-medium">{weatherData.list[0].wind.speed} m/s</p>
            </div>
            <div>
              <p className="text-gray-600">Precipitation</p>
              <p className="text-gray-800 font-medium">
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