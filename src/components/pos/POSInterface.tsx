import React from 'react';
import { ProtectedRoute } from '../ProtectedRoute';


export const POSInterface: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="CASHIER">
      <POSInterface />
    </ProtectedRoute>
  );
};