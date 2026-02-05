import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './components/OverviewPage';
import { EventImpactPage } from './components/EventImpactPage';
import { PredictionPage } from './components/PredictionPage';
import { TraceabilityPage } from './components/TraceabilityPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'event-impact':
        return <EventImpactPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'traceability':
        return <TraceabilityPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
