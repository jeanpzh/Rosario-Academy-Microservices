import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentHistorySkeleton() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <Skeleton className="h-40" />
      <div className="flex items-center justify-between p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Historial de Pagos</h3>
        <div className="flex items-center space-x-2">
          <Switch id="auto-scroll-skeleton" disabled />
          <Label htmlFor="auto-scroll-skeleton">Auto-scroll</Label>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto px-6 pb-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mb-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="size-10 animate-pulse rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
