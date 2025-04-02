import { useState } from "react";

const Crop = () => {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({ ...formData });
  };

  const handleReset = () => {
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      ph: "",
      temperature: "",
      humidity: "",
      rainfall: "",
    });
    setSubmittedData(null);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-black-800 mb-6">
        Soil and Climate Input
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Soil Nutrients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black-700">
              Soil Nutrients (mg/kg)
            </h3>
            <div>
              <label className="block text-gray-700 mb-1">Nitrogen (N)</label>
              <input
                type="number"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 90"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phosphorus (P)</label>
              <input
                type="number"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 42"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Potassium (K)</label>
              <input
                type="number"
                name="potassium"
                value={formData.potassium}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 43"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Soil pH</label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                min="0"
                max="14"
                step="0.1"
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 6.5"
                required
              />
            </div>
          </div>

          {/* Climate Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black-700">
              Climate Factors
            </h3>
            <div>
              <label className="block text-gray-700 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 25.5"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 80"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. 200"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Data
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Submitted Soil and Climate Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Soil Nutrients</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nitrogen (N):</span>
                  <span className="font-medium">
                    {submittedData.nitrogen} mg/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phosphorus (P):</span>
                  <span className="font-medium">
                    {submittedData.phosphorus} mg/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potassium (K):</span>
                  <span className="font-medium">
                    {submittedData.potassium} mg/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil pH:</span>
                  <span className="font-medium">{submittedData.ph}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Climate Factors</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">
                    {submittedData.temperature} °C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-medium">{submittedData.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rainfall:</span>
                  <span className="font-medium">
                    {submittedData.rainfall} mm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crop;
