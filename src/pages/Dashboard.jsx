import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { journeyAPI } from '../services/api';
import { MapPin, Calendar, DollarSign, Users, Plus, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
     const fetchJourneys = async () => {
    try {
      const data = await journeyAPI.getAllJourneys();
      setJourneys(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    fetchJourneys();
  }, []);



  const handleDelete = async (journeyId) => {
    if (!window.confirm('Are you sure you want to delete this journey?')) {
      return;
    }

    try {
      await journeyAPI.deleteJourney(journeyId);
      setJourneys(journeys.filter((j) => j.journey_id !== journeyId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your journeys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Journeys</h1>
            <p className="text-gray-600 mt-1">Manage and plan your upcoming trips</p>
          </div>
          <button
            onClick={() => navigate('/journeys/new')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Journey
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {journeys.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No journeys yet</h3>
            <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
            <button
              onClick={() => navigate('/journeys/new')}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
                   Create Your First Journey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey) => (
              <div
                key={journey.journey_id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{journey.destination}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/journeys/${journey.journey_id}/edit`)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(journey.journey_id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <span>
                        {new Date(journey.start_date).toLocaleDateString()} -{' '}
                        {new Date(journey.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span>${Number(journey.budget).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span>{journey.people} traveler{journey.people !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {journey.notes && (
                    <p className="mt-4 text-sm text-gray-500 line-clamp-2">{journey.notes}</p>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() => navigate(`/journeys/${journey.journey_id}`)}
                    className="w-full text-indigo-600 font-semibold hover:text-indigo-700 text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
