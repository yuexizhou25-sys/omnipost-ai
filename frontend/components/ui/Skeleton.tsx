import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}

export function PreviewSkeleton() {
  return (
    <div className="space-y-4 p-2">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-[420px] w-full rounded-2xl" />
    </div>
  );
}
