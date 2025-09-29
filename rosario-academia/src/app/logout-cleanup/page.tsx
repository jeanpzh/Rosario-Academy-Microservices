"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import { useAthleteStore } from "@/lib/stores/useUserStore";

export default function LogoutCleanup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { clearAthleteData } = useAthleteStore();

  useEffect(() => {
    setLoading(false);
    clearAthleteData();
    router.push("/sign-in");
    setLoading(true);
  }, [router, clearAthleteData]);
  if (loading) return <LoadingPage />;

  return null;
}
