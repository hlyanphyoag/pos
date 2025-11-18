import { createFileRoute } from '@tanstack/react-router'
import { Inventory } from '../components/admin/Inventory'

export const Route = createFileRoute('/admin/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Inventory />
}
