import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboard.service';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
    staleTime: 60 * 1000, // Dashboard data is fine to be 1 minute old
  });
}