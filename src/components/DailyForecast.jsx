const DailyForecast = ({ dailyForecasts }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">6-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {dailyForecasts.map((day, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-lg font-semibold text-gray-700 mb-4">
              {new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Min Temp:</span>
                <span className="text-gray-800 font-medium">{day.temp_min}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Max Temp:</span>
                <span className="text-gray-800 font-medium">{day.temp_max}°C</span>
              </div>
            </div>
            {/* <div className="mt-4 flex items-center space-x-3">
              <img
                src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.weather}
                className="w-12 h-12"
              />
              <p className="text-lg text-gray-700 capitalize">{day.weather}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;