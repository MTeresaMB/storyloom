import { useApp } from '../context/AppContext'
import { useAnalytics } from '../hooks/analytics/useAnalytics'
import WritingStats from '../components/analytics/WritingStats'
import ProgressChart from '../components/analytics/ProgressChart'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import PageHeader from '../components/ui/PageHeader'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

export default function AnalyticsView() {
  const { currentProject } = useApp()
  const { analytics, loading, error, refetch } = useAnalytics(currentProject?.id)

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Choose a Project</h2>
          <p className="text-gray-500">Choose a project to see its statistics</p>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Analytics"
        subtitle={`Statistics of ${currentProject.title}`}
        actions={
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
        }
      />

      <ErrorAlert message={error ?? ''} />

      {analytics && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Writing Statistics
            </h3>
            <WritingStats stats={analytics.writingStats} />
          </div>

          <ProgressChart analytics={analytics} />

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Chapters
            </h3>
            <div className="space-y-3">
              {analytics.chapters.slice(0, 5).map((chapter) => (
                <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                    <p className="text-sm text-gray-500">
                      Last modification: {new Date(chapter.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{chapter.wordCount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">words</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}