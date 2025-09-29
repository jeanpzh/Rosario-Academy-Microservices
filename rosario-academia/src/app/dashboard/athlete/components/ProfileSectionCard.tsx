import { Label } from "@/components/ui/label";
import React from "react";

interface ProfileSectionCardProps {
  icon: React.ElementType;
  label: string;
  value?: string | number;
}

export default function ProfileSectionCard({ icon: Icon, label, value }: ProfileSectionCardProps) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 font-medium">
        <Icon className="size-4" />
        {value}
      </div>
    </div>
  );
}
