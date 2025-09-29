"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function TotalItems({
  title,
  fetchCount,
}: {
  title: string;
  fetchCount: () => Promise<number>;
}) {
  const { data: count, isLoading } = useQuery({
    queryKey: ["totalItems", title],
    queryFn: fetchCount,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="text-2xl font-bold">{count}</div>
        )}
      </CardContent>
    </Card>
  );
}
