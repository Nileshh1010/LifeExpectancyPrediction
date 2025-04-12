import React, { useState, useEffect } from 'react';
import { Brain, Activity, LineChart, GitMerge } from 'lucide-react';
import axios from 'axios';

interface PredictionForm {
  year: string;
  country: string;
  gender: string;
  tuberculosisTreatment: string;
  hospitalBeds: string;
  urbanPopulation: string;
  ruralPopulation: string;
  gdp: string;
  model: string;
}

const initialFormState: PredictionForm = {
  year: '',
  country: '',
  gender: 'male',
  tuberculosisTreatment: '',
  hospitalBeds: '',
  urbanPopulation: '',
  ruralPopulation: '',
  gdp: '',
  model: 'ensemble'
};

function App() {
  const [form, setForm] = useState<PredictionForm>(initialFormState);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    // Fetch countries from backend
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/countries');
        setCountries(response.data.countries);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/predict', form);
      setPrediction(response.data.prediction);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const models = [
    { id: 'linear', name: 'Linear Regression', icon: LineChart },
    { id: 'gradient', name: 'Gradient Boosting', icon: Activity },
    { id: 'random_forest', name: 'Random Forest', icon: Brain },
    { id: 'ensemble', name: 'Ensemble Model', icon: GitMerge },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Life Expectancy Predictor</h1>
          <p className="text-gray-600">Enter the features below to predict life expectancy</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuberculosis Treatment</label>
              <input
                type="number"
                name="tuberculosisTreatment"
                value={form.tuberculosisTreatment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Beds</label>
              <input
                type="number"
                name="hospitalBeds"
                value={form.hospitalBeds}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urban Population</label>
              <input
                type="number"
                name="urbanPopulation"
                value={form.urbanPopulation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rural Population</label>
              <input
                type="number"
                name="ruralPopulation"
                value={form.ruralPopulation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GDP</label>
              <input
                type="number"
                name="gdp"
                value={form.gdp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Model</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {models.map(({ id, name, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors
                    ${form.model === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={id}
                    checked={form.model === id}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Icon className={`w-6 h-6 mb-2 ${form.model === id ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${form.model === id ? 'text-blue-700' : 'text-gray-600'}`}>
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Predicting...' : 'Predict Life Expectancy'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {prediction !== null && !error && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-md text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Prediction Result</h3>
            <p className="text-3xl font-bold text-green-600">{prediction.toFixed(2)} years</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;