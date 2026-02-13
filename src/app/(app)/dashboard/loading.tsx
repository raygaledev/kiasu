import { Container, Skeleton } from '@/components/ui';

export default function DashboardLoading() {
  return (
    <Container as="section" className="py-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </Container>
  );
}
