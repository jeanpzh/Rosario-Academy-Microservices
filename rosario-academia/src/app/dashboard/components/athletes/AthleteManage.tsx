"use client";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AthleteManageProps {
  onClick: () => void;
}

export default function AthleteManage({ onClick }: AthleteManageProps) {
  return (
    <Button onClick={onClick} className="flex items-center" variant="ghost">
      <Pencil className="size-4" />
    </Button>
  );
}
