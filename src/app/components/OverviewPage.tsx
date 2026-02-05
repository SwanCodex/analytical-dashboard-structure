import { FileText, Layers, TrendingUp, Calendar } from 'lucide-react';
import { systemStats, eventCategories } from '../data/mockData';

export function OverviewPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Overview</h1>
          <p className="text-slate-600">
            High-level summary of the Market Impact Intelligence Engine analysis
          </p>
        </div>

        {/* System Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {systemStats.totalArticles.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">News Articles Analyzed</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {systemStats.eventCategories}
            </div>
            <div className="text-sm text-slate-600">Event Categories</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {systemStats.marketIndex}
            </div>
            <div className="text-sm text-slate-600">Market Index</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {systemStats.analysisWindow}
            </div>
            <div className="text-sm text-slate-600">Analysis Window</div>
          </div>
        </div>

        {/* Event Categories Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Event Categories Covered</h2>
          <p className="text-sm text-slate-600 mb-6">
            The system analyzes market responses across the following macro event categories:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventCategories.map((category) => (
              <div
                key={category.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Context Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About This System</h3>
          <p className="text-sm text-blue-800 mb-3">
            The Market Impact Intelligence Engine analyzes historical news events and their corresponding
            market responses to provide insights into how different types of macro events affect market behavior.
          </p>
          <p className="text-sm text-blue-800">
            Use the navigation menu to explore event impact analysis, market predictions, and traceable
            news sources that support all system insights.
          </p>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-right">
          Last updated: {systemStats.lastUpdated}
        </div>
      </div>
    </div>
  );
}
