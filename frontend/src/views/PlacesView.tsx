import { MapPin, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

export default function PlacesView() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Places" 
        subtitle="Manage your story locations" 
        actions={<Button variant="primary" iconLeft={<Plus className="h-4 w-4" />}>New Place</Button>} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Location Management</h3>
        <p className="text-gray-500">Create and manage your story locations</p>
      </div>
    </div>
  )
}