import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import CharactersView from './views/CharactersView';
import StoryView from './views/StoryView';
import Dashboard from './views/Dashboard';
import PlacesView from './views/PlacesView';
import ObjectsView from './views/ObjectsView';
import { AppProvider } from './providers/AppProvider';
import AnalyticsView from './views/AnalyticsView';

function Views({ activeView, onOpenStory }: { activeView: string; onOpenStory: () => void }) {
  switch (activeView) {
    case 'dashboard': return <Dashboard onOpenStory={onOpenStory} />;
    case 'story': return <StoryView />;
    case 'characters': return <CharactersView />;
    case 'places': return <PlacesView />;
    case 'objects': return <ObjectsView />;
    case 'analytics': return <AnalyticsView />;
    default: return <StoryView />;
  }
}

function Shell() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className={`flex-1 bg-gray-50 ${activeView === 'story' ? '' : 'p-6'}`}>
        <Views activeView={activeView} onOpenStory={() => setActiveView('story')} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}