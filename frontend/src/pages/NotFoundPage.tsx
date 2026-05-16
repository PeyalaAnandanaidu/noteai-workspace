import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Page not found
        </h2>
        <p className="text-slate-500 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild className="bg-violet-600 hover:bg-violet-700">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}