import { signOutAction } from "@/app/(auth-pages)/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="sm" variant={"default"}>
        <Link
          href={
            profile?.role === "admin"
              ? "/dashboard/admin"
              : profile?.role === "deportista"
                ? "/loading-data"
                : profile?.role === "auxiliar_administrativo"
                  ? "/dashboard/auxiliar"
                  : "/sign-in"
          }
        >
          Dashboard
        </Link>
      </Button>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Iniciar Sesión</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Registrar</Link>
      </Button>
    </div>
  );
}
