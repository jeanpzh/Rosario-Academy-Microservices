import { getAthletesWithPayments } from "@/app/dashboard/actions/athleteActions";
import { PaymentsList } from "@/app/dashboard/components/athletes/PaymentList";

export default async function PaymentsPage() {
  const athletes = await getAthletesWithPayments();

  const parseAthletes = (athletesArr: any[]) => {
    const parsedAthletes = athletesArr.map((athlete) => {
      const { athlete_id, profiles, payments = [] } = athlete;

      // Aseguramos que profiles sea un objeto, extrayendo el primer elemento si es un array
      const profile = Array.isArray(profiles) ? profiles[0] : profiles;

      const { first_name, paternal_last_name, maternal_last_name, avatar_url } = profile;

      // Parseo seguro de los pagos
      const safePayments = payments || [];
      const count = safePayments.length;
      const sum_amount = safePayments.reduce(
        (acc: any, curr: any) => acc + (Number(curr.amount) || 0),
        0,
      );

      return {
        id: athlete_id,
        profiles: {
          first_name,
          paternal_last_name,
          maternal_last_name,
          avatar_url,
        },
        payments: [
          {
            count,
            sum_amount,
          },
        ],
      };
    });
    return parsedAthletes;
  };

  const parsedAthletes = athletes ? parseAthletes(athletes) : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Registros de Pagos</h1>
      <PaymentsList athletes={parsedAthletes} />
    </div>
  );
}
