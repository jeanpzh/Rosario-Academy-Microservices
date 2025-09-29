"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAthleteDistribution } from "@/hooks/use-fetch-athlete-distribution";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export function AthleteDistribution() {
  const { data: distributionData, isLoading, error } = useFetchAthleteDistribution();

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos</div>;

  const data = distributionData
    ? [
        { name: "Principiante", value: distributionData.beginner },
        { name: "Intermedio", value: distributionData.intermediate },
        { name: "Avanzado", value: distributionData.advanced },
      ]
    : [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="stroke-background stroke-2"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
