import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  async function redirectToDashboard() {
    "use server";
    redirect("/loading-data");
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />
          Iniciaste Sesión como <span className="font-semibold">{user.email}</span>
        </div>
      </div>
      <form action={redirectToDashboard}>
        <Button variant={"outline"}>Ir a portal de usuario</Button>
      </form>
    </div>
  );
}
