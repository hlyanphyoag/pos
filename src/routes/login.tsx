import { createFileRoute, Navigate } from '@tanstack/react-router';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const { authState } = useAuth();

  if (authState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <LoginForm />;
}