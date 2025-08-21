import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import AdminApp from '../AdminApp';

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminApp />
    </ProtectedRoute>
  );
}