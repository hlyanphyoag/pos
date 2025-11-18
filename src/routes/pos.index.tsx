import { createFileRoute } from '@tanstack/react-router'
import ProductPage from '../components/pos/ProductPage'

export const Route = createFileRoute('/pos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductPage />
}
