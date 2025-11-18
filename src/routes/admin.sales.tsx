import { createFileRoute } from '@tanstack/react-router';
import { Sales } from '../components/admin/Sales';

export const Route = createFileRoute('/admin/sales')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Sales salesData={[]} />;
}
