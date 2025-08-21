import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  switch (authState.user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin" />;
    case 'CASHIER':
      return <Navigate to="/pos" />;
    case 'CUSTOMER':
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/login" />;
  }
}