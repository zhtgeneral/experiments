import { cn } from "@/app/lib/classNameUtils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-skeleton-light", className)}
      {...props}
    />
  )
}

export { Skeleton }
