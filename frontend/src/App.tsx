import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import CharactersView from './views/CharactersView';
import StoryView from './views/StoryView';
import Dashboard from './views/Dashboard';
import PlacesView from './views/PlacesView';
import ObjectsView from './views/ObjectsView';

function Views({ activeView }: { activeView: string }) {
  switch (activeView) {
    case 'dashboard': return <Dashboard />;
    case 'story': return <StoryView />;
    case 'characters': return <CharactersView />;
    case 'places': return <PlacesView />;
    case 'objects': return <ObjectsView />;
    default: return <StoryView />;
  }
}

function Shell() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  return (
    <div className="flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 min-h-screen bg-gray-50 p-6">
        <Views activeView={activeView} />
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