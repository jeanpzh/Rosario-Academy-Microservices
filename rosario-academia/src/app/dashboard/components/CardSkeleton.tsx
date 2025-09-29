import React from "react";

export default function CardSkeleton() {
  return (
    <div className="animate-pulse rounded border p-4 shadow">
      <div className="mb-2 h-4 w-32 rounded bg-gray-300"></div>
      <div className="mb-4 h-6 w-full rounded bg-gray-300"></div>
      <div className="space-y-2">
        <div className="h-4 rounded bg-gray-300"></div>
        <div className="h-4 rounded bg-gray-300"></div>
        <div className="h-4 w-5/6 rounded bg-gray-300"></div>
      </div>
    </div>
  );
}
