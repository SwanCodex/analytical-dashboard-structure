import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Newspaper, Filter } from 'lucide-react';
import { eventCategories, newsArticles } from '../data/mockData';

export function TraceabilityPage() {
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  // Filter articles based on selections
  const filteredArticles = newsArticles.filter((article) => {
    const matchesEvent =
      selectedEventId === 'all' || article.eventCategoryId === selectedEventId;
    const matchesSentiment =
      selectedSentiment === 'all' || article.sentiment === selectedSentiment;
    return matchesEvent && matchesSentiment;
  });

  const getSentimentBadge = (sentiment: string, score: number) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Positive ({score.toFixed(2)})
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Negative ({score.toFixed(2)})
          </span>
        );
      case 'neutral':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            Neutral ({score.toFixed(2)})
          </span>
        );
    }
  };

  const getEventCategoryName = (eventCategoryId: string) => {
    const category = eventCategories.find((cat) => cat.id === eventCategoryId);
    return category?.name || eventCategoryId;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">News Traceability</h1>
          <p className="text-slate-600">
            Explore individual news articles and their associated market impacts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Category
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {eventCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sentiment
              </label>
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            Showing <strong>{filteredArticles.length}</strong> article
            {filteredArticles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No articles match the selected filters</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Newspaper className="w-4 h-4" />
                        <span>{article.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-4">{article.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Event Category</div>
                    <div className="font-medium text-slate-900">
                      {getEventCategoryName(article.eventCategoryId)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-600 mb-1">NLP Sentiment</div>
                    <div>{getSentimentBadge(article.sentiment, article.sentimentScore)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-600 mb-1">
                      Next-Day Market Reaction
                    </div>
                    <div
                      className={`flex items-center gap-1 font-semibold ${
                        article.nextDayReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {article.nextDayReturn >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {article.nextDayReturn >= 0 ? '+' : ''}
                        {article.nextDayReturn.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About This Page</h3>
          <p className="text-sm text-blue-800 mb-3">
            The News Traceability page provides full transparency into the data sources behind
            the system's insights. Each article shown here was:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Classified into a macro event category using NLP models</li>
            <li>Analyzed for sentiment polarity and intensity</li>
            <li>Linked to the observed next-day market movement</li>
            <li>Used to compute aggregate statistics shown in other dashboard sections</li>
          </ul>
          <p className="text-sm text-blue-800 mt-3">
            This ensures that every high-level insight can be traced back to specific news events,
            supporting interpretability and trust in the system's analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
