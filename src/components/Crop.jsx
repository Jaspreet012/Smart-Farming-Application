import { useState } from "react";

const Crop = () => {
  const [soilData, setSoilData] = useState(null);
  const [npkValues, setNpkValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSoilData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Example coordinates (replace with dynamic values if needed)
      const lat = 51.57;
      const lon = 5.39;

      const response = await fetch(
        `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&properties=phh2o,ocd,cec,sand,clay&depth=0-5cm`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch soil data");
      }

      const data = await response.json();
      setSoilData(data);
      calculateNPK(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateNPK = (soilData) => {
    if (!soilData?.properties?.layers) return;

    const getLayerValue = (name) => {
      const layer = soilData.properties.layers.find((l) => l.name === name);
      if (!layer) return null;
      const depth = layer.depths.find((d) => d.label === "0-5cm");
      return depth ? depth.values.mean / (layer.unit_measure?.d_factor || 1) : null;
    };

    // Extract soil properties
    const phh2o = getLayerValue("phh2o");
    const ocd = getLayerValue("ocd");
    const cec = getLayerValue("cec");
    const sand = getLayerValue("sand");
    const clay = getLayerValue("clay");

    // Calculate NPK values
    const nitrogen = ocd ? Math.round(ocd * 50) : null; // ocd to ppm conversion
    const phosphorus = phh2o ? Math.round(30 + (phh2o - 5.5) * 15) : null; // pH-based estimate
    const potassium = cec ? Math.round(cec * 390 * (clay > 35 ? 0.05 : 0.03)) : null; // CEC-based

    setNpkValues({
      nitrogen: nitrogen !== null ? `${nitrogen} mg/kg` : "N/A",
      phosphorus: phosphorus !== null ? `${phosphorus} mg/kg` : "N/A",
      potassium: potassium !== null ? `${potassium} mg/kg` : "N/A",
      ph: phh2o?.toFixed(1) || "N/A",
      texture: sand > 70 ? "sandy" : clay > 35 ? "clay" : "loamy"
    });
  };

  const handleButtonClick = () => {
    if (!npkValues) {
      fetchSoilData();
    } else {
      setNpkValues(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg">
      <button
        onClick={handleButtonClick}
        className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${
          loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading ? "Analyzing Soil..." : npkValues ? "Reset" : "Get NPK Values"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {npkValues && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Soil NPK Analysis (0-5cm depth)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Nutrient Values</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nitrogen (N):</span>
                  <span className="font-medium">{npkValues.nitrogen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phosphorus (P):</span>
                  <span className="font-medium">{npkValues.phosphorus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potassium (K):</span>
                  <span className="font-medium">{npkValues.potassium}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Soil Properties</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Texture:</span>
                  <span className="font-medium capitalize">
                    {npkValues.texture}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">pH Level:</span>
                  <span className="font-medium">{npkValues.ph}</span>
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