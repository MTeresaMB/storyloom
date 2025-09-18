import { Home, Users, MapPin, Package, BookOpen, Menu, Settings, Download, ChevronRight, ChevronDown, StickyNote, List } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import Button from '../ui/Button';

type SectionKey = 'project' | 'writing';

type Props = { activeView: string; setActiveView: (v: string) => void };
export default function Sidebar({ activeView, setActiveView }: Props) {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({ project: false, writing: false });
  const sections: Array<{ key: SectionKey; title: string; items: Array<{ id: string; label: string; icon: any }> }> = [
    {
      key: 'project',
      title: 'Project',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'characters', label: 'Characters', icon: Users },
        { id: 'places', label: 'Places', icon: MapPin },
        { id: 'objects', label: 'Objects', icon: Package },
      ]
    },
    {
      key: 'writing',
      title: 'Writing',
      items: [
        { id: 'story', label: 'Chapters', icon: BookOpen },
        { id: 'notes', label: 'Notes', icon: StickyNote },
        { id: 'outline', label: 'Outline', icon: List },
      ]
    }
  ];

  const toggle = (key: SectionKey) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  return (
    <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-gray-300 flex flex-col transition-all border-r border-gray-800`} aria-label="Sidebar">
      <div className="p-4 border-b border-gray-800 flex justify-between">
        {!sidebarCollapsed && <div className="text-white font-semibold">StoryLoom</div>}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {sections.map(section => (
          <div key={section.key} className="mb-6">
            {!sidebarCollapsed && (
              <button
                onClick={() => toggle(section.key)}
                className="flex items-center justify-between w-full text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3 hover:text-gray-300 transition-colors"
              >
                {section.title}
                {expanded[section.key] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            )}

            {(expanded[section.key] || sidebarCollapsed) && (
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon
                  const active = activeView === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${active ? 'bg-gray-800 text-white border-l-2 border-blue-400' : 'hover:bg-gray-800/50 hover:text-white'
                        }`}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-blue-400' : ''}`} />
                      {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
          <Settings className="h-4 w-4" />
          {!sidebarCollapsed && <span className="text-sm">Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
          <Download className="h-4 w-4" />
          {!sidebarCollapsed && <span className="text-sm">Export</span>}
        </button>
      </div>
    </aside>
  );
}