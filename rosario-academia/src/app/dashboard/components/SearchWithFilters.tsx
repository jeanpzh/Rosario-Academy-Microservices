"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useDebouncedCallback } from "use-debounce";

interface Filter {
  id: string;
  value: string;
}

export default function SearchWithFilters({ table }: { table: any }) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: any) => {
    setIsLoading(true);
    table.setGlobalFilter(value);
    setIsLoading(false);
  }, 300);

  const debouncedFilterChange = useDebouncedCallback((filters: any) => {
    setIsLoading(true);
    table.setColumnFilters(filters.filter((f: any) => f.value !== ""));
    setIsLoading(false);
  }, 300);

  useEffect(() => {
    debouncedFilterChange(activeFilters);
  }, [activeFilters, debouncedFilterChange]); // Added debouncedFilterChange to dependencies

  const handleFilterChange = (columnId: string, value: boolean) => {
    if (value) {
      setActiveFilters((prev) => [...prev, { id: columnId, value: "" }]);
    } else {
      setActiveFilters((prev) => prev.filter((f) => f.id !== columnId));
    }
  };

  const handleFilterValueChange = (columnId: string, value: string) => {
    setActiveFilters((prev) => prev.map((f) => (f.id === columnId ? { ...f, value } : f)));
  };

  const removeFilter = (columnId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== columnId));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative w-64">
          <Input
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="pr-8"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-gray-400" />
            ) : (
              <Search className="size-4 text-gray-400" />
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filtros</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column: any) => column.getCanFilter())
              .map((column: any) => {
                const isActive = activeFilters.some((f) => f.id === column.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={isActive}
                    onCheckedChange={(value) => handleFilterChange(column.id, value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge key={filter.id} variant="secondary">
            <span className="mr-1 font-semibold">{filter.id}:</span>
            <Input
              className="h-5 w-24 border-none bg-transparent p-0"
              value={filter.value}
              onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 size-5 p-0"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="size-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
