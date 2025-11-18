import { createFileRoute } from '@tanstack/react-router'
import TransactionRecordForm from '../components/pos/Transcation'

export const Route = createFileRoute('/pos/transctions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TransactionRecordForm />
}
