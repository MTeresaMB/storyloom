import React, { createContext, useContext, useState } from 'react';

type Project = { id: string; title: string; description: string; genre: string; currentWords: number; targetWords: number; status: 'Writing' | 'Planning' | 'Draft'; lastModified: string; };
type User = { id: string; email: string } | null;

type AppContextType = {
  user: User; setUser: React.Dispatch<React.SetStateAction<User>>;
  currentProject: Project | null; setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>;
  projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  sidebarCollapsed: boolean; setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useApp = () => { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp must be used within AppProvider'); return ctx; };

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'The Last Kingdom',
      description: 'An epic fantasy tale of magic and mystery',
      genre: 'Fantasy',
      currentWords: 45420,
      targetWords: 120000,
      status: 'Writing',
      lastModified: '2024-03-15'
    },
    {
      id: '2',
      title: 'Shadows in Manhattan',
      description: 'A psychological thriller in NYC',
      genre: 'Thriller',
      currentWords: 28750,
      targetWords: 80000,
      status: 'Writing',
      lastModified: '2024-03-10'
    }
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AppContext.Provider value={{ user, setUser, currentProject, setCurrentProject, projects, setProjects, sidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </AppContext.Provider>
  );
};