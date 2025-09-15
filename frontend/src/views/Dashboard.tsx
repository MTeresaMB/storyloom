import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Metric } from "../utils/metric";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

export default function Dashboard() {
  const { projects, currentProject, setCurrentProject } = useApp();

  useEffect(() => {
    if (!currentProject && projects.length > 0) {
      setCurrentProject(projects[0]);
    }
  }, [currentProject, projects, setCurrentProject]);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your writing projects"
        actions={
          <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            New Project
          </Button>
        }
      />
      <div className="p-8">
        {currentProject && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Current Project</h2>
                <h3 className="text-2xl font-bold text-gray-900">{currentProject.title}</h3>
                <p className="text-gray-600 mt-2">{currentProject.description}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {currentProject.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">
              <Metric label="Words Written" value={currentProject.currentWords.toLocaleString()} className="text-blue-600" />
              <Metric label="Progress" value={`${Math.round((currentProject.currentWords / currentProject.targetWords) * 100)}%`} className="text-green-600" />
              <Metric label="Target Words" value={currentProject.targetWords.toLocaleString()} className="text-purple-600" />
              <Metric label="Genre" value={currentProject.genre} className="text-orange-600" />
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((currentProject.currentWords / currentProject.targetWords) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentProject.currentWords / currentProject.targetWords) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <article key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${project.status === 'Writing' ? 'bg-green-100 text-green-800' :
                    project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{Math.round((project.currentWords / project.targetWords) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(project.currentWords / project.targetWords) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{project.currentWords.toLocaleString()} words</span>
                    <span>{project.genre}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="primary" onClick={() => setCurrentProject(project)} iconLeft={<Eye className="h-4 w-4" />}>Open</Button>
                  <Button variant="secondary" iconLeft={<Edit3 className="h-4 w-4" />} />
                  <Button variant="danger" iconLeft={<Trash2 className="h-4 w-4" />} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}