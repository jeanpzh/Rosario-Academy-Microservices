"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  pending?: boolean;
};

export function SubmitButton({ children, pendingText, pending, ...props }: Props) {
  return (
    <Button type="submit" variant={"default"} aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
