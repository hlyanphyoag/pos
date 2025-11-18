import { createFileRoute } from '@tanstack/react-router'
import Transaction from '../components/admin/Transaction'

export const Route = createFileRoute('/admin/transaction')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Transaction />
}
