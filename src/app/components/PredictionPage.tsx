import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { eventCategories, marketPredictions } from '../data/mockData';

export function PredictionPage() {
  const [selectedEventId, setSelectedEventId] = useState('fed-policy');

  const selectedPrediction = marketPredictions.find(
    (pred) => pred.eventId === selectedEventId
  );

  const selectedEvent = eventCategories.find((cat) => cat.id === selectedEventId);

  if (!selectedPrediction || !selectedEvent) return null;

  // Prepare data for main probability chart
  const probabilityData = [
    {
      name: 'Rise',
      probability: selectedPrediction.riseProb,
      color: '#10b981',
    },
    {
      name: 'Fall',
      probability: selectedPrediction.fallProb,
      color: '#ef4444',
    },
    {
      name: 'Neutral',
      probability: selectedPrediction.neutralProb,
      color: '#94a3b8',
    },
  ];

  // Prepare data for horizon breakdown
  const horizonData = [
    {
      horizon: '1 Day',
      Rise: selectedPrediction.horizon1D.rise,
      Fall: selectedPrediction.horizon1D.fall,
      Neutral: selectedPrediction.horizon1D.neutral,
    },
    {
      horizon: '3 Days',
      Rise: selectedPrediction.horizon3D.rise,
      Fall: selectedPrediction.horizon3D.fall,
      Neutral: selectedPrediction.horizon3D.neutral,
    },
    {
      horizon: '7 Days',
      Rise: selectedPrediction.horizon7D.rise,
      Fall: selectedPrediction.horizon7D.fall,
      Neutral: selectedPrediction.horizon7D.neutral,
    },
    {
      horizon: '30 Days',
      Rise: selectedPrediction.horizon30D.rise,
      Fall: selectedPrediction.horizon30D.fall,
      Neutral: selectedPrediction.horizon30D.neutral,
    },
  ];

  const hasSufficientData = selectedPrediction.sampleSize >= 30;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sector & Market Prediction
          </h1>
          <p className="text-slate-600">
            Probabilistic market behavior estimation based on historical event patterns
          </p>
        </div>

        {/* Event Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Select Event Category
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {eventCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-slate-600">{selectedEvent.description}</p>
        </div>

        {/* Warning if insufficient data */}
        {!hasSufficientData && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Limited Historical Data
              </h3>
              <p className="text-sm text-amber-800">
                This event category has only {selectedPrediction.sampleSize} historical
                occurrences. Predictions are shown but should be interpreted with caution.
                A minimum of 30 events is recommended for reliable probability estimates.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Overall Probability Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Market Movement Probability
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Expected market direction following {selectedEvent.name.toLowerCase()} events
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={probabilityData}
                  dataKey="probability"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, probability }) => `${name}: ${probability}%`}
                >
                  {probabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Market Rise</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {selectedPrediction.riseProb}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">Market Fall</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {selectedPrediction.fallProb}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Minus className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Neutral Movement</span>
                </div>
                <span className="text-2xl font-bold text-slate-600">
                  {selectedPrediction.neutralProb}%
                </span>
              </div>
            </div>
          </div>

          {/* Sample Size and Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Analysis Details</h2>
            <p className="text-sm text-slate-600 mb-6">
              Statistical foundation for probability estimates
            </p>

            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-4">
                <div className="text-sm text-slate-600 mb-1">Historical Sample Size</div>
                <div className="text-3xl font-bold text-slate-900">
                  {selectedPrediction.sampleSize}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Total events analyzed for this category
                </div>
              </div>

              <div className="border-b border-slate-200 pb-4">
                <div className="text-sm text-slate-600 mb-1">Dominant Direction</div>
                <div className="text-xl font-bold">
                  {selectedPrediction.riseProb > selectedPrediction.fallProb ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Bullish Tendency
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Bearish Tendency
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Confidence Level</div>
                <div className="text-xl font-bold text-slate-900">
                  {hasSufficientData ? 'High' : 'Moderate'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Based on sample size and historical consistency
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                How Probabilities Are Calculated
              </h4>
              <p className="text-xs text-blue-800">
                Probabilities are derived from historical post-event market behavior across
                multiple time horizons. Each occurrence is classified as rise, fall, or neutral
                based on the direction and magnitude of market movement.
              </p>
            </div>
          </div>
        </div>

        {/* Probability by Time Horizon */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Probability Distribution by Time Horizon
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            How market movement probabilities evolve across different post-event time periods
          </p>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={horizonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="horizon" />
              <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Rise" stackId="a" fill="#10b981" />
              <Bar dataKey="Neutral" stackId="a" fill="#94a3b8" />
              <Bar dataKey="Fall" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 text-sm text-slate-600">
            <strong>Interpretation:</strong> The stacked bars show how probabilities change over
            time. Short-term reactions may differ from longer-term trends as markets digest and
            respond to event implications.
          </div>
        </div>
      </div>
    </div>
  );
}
