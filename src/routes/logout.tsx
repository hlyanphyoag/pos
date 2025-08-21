import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export const Route = createFileRoute('/logout')({
  component: Logout,
});

function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" />;
}