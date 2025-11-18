import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Navigation } from "../components/Navigation";


export const Route = createFileRoute("/pos")({
  component: POSRoute,
});

function POSRoute() {

  return (
    <ProtectedRoute requiredRole="CASHIER">
      <div className="bg-gray-50">
        <Navigation />
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
