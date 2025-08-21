import { createFileRoute } from '@tanstack/react-router';
import { CustomerDisplay } from '../components/pos/CustomerDisplay';
import { Navigation } from '../components/Navigation';

export const Route = createFileRoute('/customer')({
  component: CustomerRoute,
});

function CustomerRoute() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <div className="h-[calc(100vh-80px)] p-6">
        <div className="max-w-4xl mx-auto h-full">
          <CustomerDisplay />
        </div>
      </div>
    </div>
  );
}