import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus } from "lucide-react";
import { useDashboardAnalytics } from "../hooks/dashboard/useDashboardAnalytics";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import PageHeader from "../components/ui/PageHeader";
import CurrentProjectCard from "../components/projects/CurrentProjectCard";
import ProjectCard from "../components/projects/ProjectCard";
import NewProjectDialog from "../components/projects/NewProjectDialog";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/ToastProvider";
import EditProjectDialog from "../components/ui/EditProjectDialog";

export default function Dashboard({ onOpenStory }: { onOpenStory?: () => void }) {
  const { projects, currentProject, setCurrentProject, createProject, user, deleteProject, updateProjectDetails } = useApp();
  const { success, error: showError } = useToast();
  const { projects: analyticsProjects, loading, error, refetch } = useDashboardAnalytics(user?.id);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [newOpen, setNewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editTargetProjectId, setEditTargetProjectId] = useState<string | null>(null)

  useEffect(() => {
    if (!currentProject && projects.length > 0) {
      setCurrentProject(projects[0]);
    }
  }, [currentProject, projects, setCurrentProject]);

  const handleNewProject = useCallback(async (values: {
    title: string,
    description?: string,
    synopsis?: string,
    genre?: string,
    target_words?: number,
  }) => {
    try {
      const story = await createProject(values)
      setCurrentProject(story)
      success('Project created')
      refetch()
    } catch (e) {
      showError('Failed to create project')
    }
  }, [createProject, setCurrentProject, success, showError, refetch])

  const startEdit = useCallback((id: string, currentTitle: string) => {
    setEditTargetProjectId(id)
    setTempTitle(currentTitle)
    setEditOpen(true)
  }, [])

  const cancelEdit = useCallback(() => {
    setTempTitle("");
    setEditOpen(false)
    setEditTargetProjectId(null)
  }, [])

  const analyticsById = useMemo(() => {
    const map: Record<string, typeof analyticsProjects[number]> = {}
    analyticsProjects.forEach(p => { map[p.id] = p })
    return map
  }, [analyticsProjects])

  const projectsById = useMemo(() => {
    const map: Record<string, typeof projects[number]> = {}
    projects.forEach(p => { map[p.id] = p })
    return map
  }, [projects])

  const currentMetrics = currentProject ? analyticsById[currentProject.id] : undefined

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your writing projects"
        actions={
          <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setNewOpen(true)} disabled={newOpen}>
            {newOpen ? "Creating..." : "New Project"}
          </Button>
        }
      />
      <div className="p-8">
        <ErrorAlert message={error ?? ''} />
        {currentProject && (() => {
          const m = currentMetrics
          const words = m?.totalWords || 0
          return (
            <CurrentProjectCard
              project={currentProject}
              metrics={{
                totalWords: words,
                chaptersCount: m?.chaptersCount || 0,
                progressPercentage: m?.progressPercentage || 0,
                lastActivity: m?.lastActivity || undefined,
              }}
            />
          )
        })()}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsProjects.map(project => {
              const m = analyticsById[project.id]
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  metrics={{
                    totalWords: m?.totalWords || 0,
                    chaptersCount: m?.chaptersCount || 0,
                    progressPercentage: m?.progressPercentage || 0,
                    lastActivity: m?.lastActivity || undefined,
                  }}
                  isCurrent={currentProject?.id === project.id}
                  onStartEdit={startEdit}
                  onSelected={() => setCurrentProject(project)}
                  onOpen={() => { setCurrentProject(project); onOpenStory && onOpenStory(); }}
                  onDelete={() => {
                    setPendingDeleteId(project.id)
                    setConfirmOpen(true)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
      <EditProjectDialog
        open={editOpen}
        initialTitle={(editTargetProjectId ? projectsById[editTargetProjectId]?.title : '') || tempTitle || ''}
        initialTarget={(editTargetProjectId ? projectsById[editTargetProjectId]?.target_words : 0) || 0}
        initialDescription={(editTargetProjectId ? projectsById[editTargetProjectId]?.description : '') || ''}
        initialSynopsis={(editTargetProjectId ? projectsById[editTargetProjectId]?.synopsis : '') || ''}
        initialGenre={(editTargetProjectId ? projectsById[editTargetProjectId]?.genre : '') || ''}
        onClose={cancelEdit}
        onSubmit={async ({ title, target_words, description, synopsis, genre }) => {
          try {
            const id = editTargetProjectId
            if (!id) return
            const original = projectsById[id]
            if (!original) return
            await updateProjectDetails(id, {
              title: title.trim() && title.trim() !== original.title ? title.trim() : undefined,
              target_words: (original.target_words || 0) !== target_words ? target_words : undefined,
              description,
              synopsis,
              genre,
            })
            success('Project updated')
            refetch()
          } catch (e) {
            showError('Failed to update project')
          } finally {
            cancelEdit()
          }
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null) }}
        onConfirm={async () => {
          if (!pendingDeleteId) return
          try {
            await deleteProject(pendingDeleteId)
            success('Project deleted')
          } catch (e) {
            showError('Failed to delete project')
          } finally {
            setConfirmOpen(false)
            setPendingDeleteId(null)
            refetch()
          }
        }}
      />
      <NewProjectDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onSubmit={async ({ title, description, synopsis, genre, target_words }) => {
          await handleNewProject({ title: title!, description, synopsis, genre, target_words })
          refetch()
          setNewOpen(false)
        }}
      />
    </div>
  )
}
