import { Plus, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';

export default function ObjectsView() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Objects" 
        subtitle="Manage important story objects" 
        actions={<Button variant="primary" iconLeft={<Plus className="h-4 w-4" />}>New Object</Button>} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Object Management</h3>
        <p className="text-gray-500">Manage important story objects</p>
      </div>
    </div>
  );
}