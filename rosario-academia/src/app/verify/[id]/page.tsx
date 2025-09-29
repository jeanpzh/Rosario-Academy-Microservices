import { notFound } from "next/navigation";
import { verifyAthlete } from "@/app/verify/[id]/actions";
import AthleteCard from "@/app/verify/[id]/components/athlete-card";

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const verifiedAthlete = await verifyAthlete(id);

  if ("error" in verifiedAthlete) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <AthleteCard athlete={verifiedAthlete} />
    </div>
  );
}
