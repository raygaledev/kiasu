import { Container, Skeleton } from "@/components/ui";

export default function StudyListLoading() {
  return (
    <Container as="section" className="py-8">
      <Skeleton className="h-5 w-28" />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="mt-8 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </Container>
  );
}
