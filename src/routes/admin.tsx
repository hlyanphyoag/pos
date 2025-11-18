import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Sidebar } from '../components/admin/Sidebar';

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
        <div className='grid grid-cols-[90px_1fr] xl:grid-cols-[256px_1fr] h-screen'>
          <div className='fixed top-0 left-0 h-screen z-50'>
            <Sidebar />
          </div>
          <div></div> {/* Spacer for fixed sidebar */}
          <main className='overflow-auto'>
            <div className='p-8 dark:bg-gray-900 min-h-full'>
              <Outlet />
            </div>
          </main>
        </div>
    </ProtectedRoute>
  );
}
