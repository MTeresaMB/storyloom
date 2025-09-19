import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ProjectCard from "../components/projects/ProjectCard";
import CurrentProjectCard from "../components/projects/CurrentProjectCard";

export default function Dashboard({ onOpenStory }: { onOpenStory?: () => void }) {
  const { projects, currentProject, setCurrentProject, createProject, updateProjectTitle } = useApp();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");

  useEffect(() => {
    if (!currentProject && projects.length > 0) {
      setCurrentProject(projects[0]);
    }
  }, [currentProject, projects, setCurrentProject]);

  const handleCreateProject = async () => {
    setCreating(true);
    try {
      await createProject("Untitled");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempTitle("");
  };

  const commitEdit = async (id: string) => {
    const title = tempTitle.trim();
    if (!title) return cancelEdit();
    await updateProjectTitle(id, title);
    cancelEdit();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your writing projects"
        actions={
          <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={handleCreateProject} disabled={creating}>
            {creating ? "Creating..." : "New Project"}
          </Button>
        }
      />
      <div className="p-8">
        {currentProject && <CurrentProjectCard project={currentProject} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              isEditing={editingId === project.id}
              tempTitle={tempTitle}
              onStartEdit={startEdit}
              onChangeTitle={setTempTitle}
              onCommitEdit={commitEdit}
              onCancelEdit={cancelEdit}
              onOpen={() => { setCurrentProject(project); onOpenStory && onOpenStory(); }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}