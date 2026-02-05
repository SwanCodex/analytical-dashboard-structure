import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { eventImpacts } from '../data/mockData';
import { Fragment } from 'react';

export function EventImpactPage() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (eventId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedRows(newExpanded);
  };

  // Prepare data for return chart
  const returnData = eventImpacts.map((event) => ({
    name: event.eventName.replace(/ /g, '\n'),
    '1 Day': event.avgReturn1D,
    '3 Days': event.avgReturn3D,
    '7 Days': event.avgReturn7D,
    '30 Days': event.avgReturn30D,
  }));

  // Prepare data for volatility chart
  const volatilityData = eventImpacts.map((event) => ({
    name: event.eventName.replace(/ /g, '\n'),
    '1 Day': event.volatility1D,
    '3 Days': event.volatility3D,
    '7 Days': event.volatility7D,
    '30 Days': event.volatility30D,
  }));

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Event Impact Analysis</h1>
          <p className="text-slate-600">
            Historical market responses to different macro event categories
          </p>
        </div>

        {/* Average Returns Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Average Market Returns by Event Type
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Comparison of average percentage returns across different post-event time horizons
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={returnData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="1 Day" fill="#3b82f6" />
              <Bar dataKey="3 Days" fill="#8b5cf6" />
              <Bar dataKey="7 Days" fill="#10b981" />
              <Bar dataKey="30 Days" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volatility Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Market Volatility by Event Type
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Comparison of market volatility (standard deviation) across different post-event time horizons
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis label={{ value: 'Volatility (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="1 Day" fill="#ef4444" />
              <Bar dataKey="3 Days" fill="#f97316" />
              <Bar dataKey="7 Days" fill="#eab308" />
              <Bar dataKey="30 Days" fill="#84cc16" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Raw Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Event Impact Statistics (Raw Data)
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Click on any row to expand and view detailed statistics
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Event Category
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Event Count
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Avg 1D Return
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Avg 30D Return
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {eventImpacts.map((event) => {
                  const isExpanded = expandedRows.has(event.eventId);
                  return (
                    <Fragment key={event.eventId}>
                      <tr
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                        onClick={() => toggleRow(event.eventId)}
                      >
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {event.eventName}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {event.eventCount}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span
                            className={
                              event.avgReturn1D >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {event.avgReturn1D.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span
                            className={
                              event.avgReturn30D >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {event.avgReturn30D.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={5} className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                  Average Returns by Horizon
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">1 Day:</span>
                                    <span
                                      className={
                                        event.avgReturn1D >= 0
                                          ? 'text-green-600 font-medium'
                                          : 'text-red-600 font-medium'
                                      }
                                    >
                                      {event.avgReturn1D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">3 Days:</span>
                                    <span
                                      className={
                                        event.avgReturn3D >= 0
                                          ? 'text-green-600 font-medium'
                                          : 'text-red-600 font-medium'
                                      }
                                    >
                                      {event.avgReturn3D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">7 Days:</span>
                                    <span
                                      className={
                                        event.avgReturn7D >= 0
                                          ? 'text-green-600 font-medium'
                                          : 'text-red-600 font-medium'
                                      }
                                    >
                                      {event.avgReturn7D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">30 Days:</span>
                                    <span
                                      className={
                                        event.avgReturn30D >= 0
                                          ? 'text-green-600 font-medium'
                                          : 'text-red-600 font-medium'
                                      }
                                    >
                                      {event.avgReturn30D.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                  Volatility by Horizon
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">1 Day:</span>
                                    <span className="text-slate-900 font-medium">
                                      {event.volatility1D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">3 Days:</span>
                                    <span className="text-slate-900 font-medium">
                                      {event.volatility3D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">7 Days:</span>
                                    <span className="text-slate-900 font-medium">
                                      {event.volatility7D.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">30 Days:</span>
                                    <span className="text-slate-900 font-medium">
                                      {event.volatility30D.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Returns and volatility are calculated as percentage changes in the S&P 500 index
            following each event occurrence. Negative returns indicate market declines.
          </p>
        </div>
      </div>
    </div>
  );
}