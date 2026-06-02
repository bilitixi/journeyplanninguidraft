import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { journeyAPI, weatherAPI, recommendationsAPI } from '../services/api';
import { Calendar, DollarSign, Users, ArrowLeft, Cloud, Sparkles, Thermometer, Droplets } from 'lucide-react';

const JourneyDetail = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJourney();
  }, [journeyId]);

  const fetchJourney = async () => {
    try {
      const data = await journeyAPI.getJourneyById(journeyId);
      setJourney(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const data = await weatherAPI.getWeatherForecast(journeyId);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setRecommendationsLoading(true);
    try {
      const data = await recommendationsAPI.getRecommendations(journeyId);
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading journey details...</p>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Journey not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-indigo-600 font-semibold hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Journey Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{journey.destination}</h1>
              <p className="text-gray-600">Your upcoming adventure</p>
            </div>
            <button
              onClick={() => navigate(`/journeys/${journeyId}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Edit Journey
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-semibold text-gray-900">
                  {new Date(journey.start_date).toLocaleDateString()} - {new Date(journey.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-semibold text-gray-900">${Number(journey.budget).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Travelers</p>
                <p className="font-semibold text-gray-900">{journey.people}</p>
              </div>
            </div>
          </div>

          {journey.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="text-gray-900">{journey.notes}</p>
            </div>
          )}
        </div>

        {/* Weather Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Weather Forecast in the 5 days range</h2>
            </div>
            {!weather && (
              <button
                onClick={fetchWeather}
                disabled={weatherLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {weatherLoading ? 'Loading...' : 'Get Weather'}
              </button>
            )}
          </div>

          {weatherLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading weather forecast...</p>
            </div>
          ) : weather ? (
            <div>
              <p className="text-gray-600 mb-4">Weather forecast for {weather.destination}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-3">{new Date(day.date).toLocaleDateString()}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Thermometer className="w-4 h-4" />
                        <span>{day.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Cloud className="w-4 h-4" />
                        <span>{day.condition}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Droplets className="w-4 h-4" />
                        <span>{day.rain_probability}% rain chance</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Click "Get Weather" to see the forecast for your journey</p>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
            </div>
            {!recommendations && (
              <button
                onClick={fetchRecommendations}
                disabled={recommendationsLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recommendationsLoading ? 'Generating...' : 'Get Recommendations'}
              </button>
            )}
          </div>

          {recommendationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating AI recommendations...</p>
            </div>
          ) : recommendations ? (
            <div>
              <p className="text-gray-600 mb-4">AI-powered recommendations for {recommendations.destination}</p>
              <ul className="space-y-3">
                {recommendations.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-gray-900">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Click "Get Recommendations" to receive AI-powered travel suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JourneyDetail;
