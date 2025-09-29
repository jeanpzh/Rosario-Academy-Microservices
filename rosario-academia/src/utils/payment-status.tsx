import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { JSX } from "react";

export interface PaymentStatusConfig {
  icon: JSX.Element;
  message: string;
  colorClasses: string;
}

export function getPaymentStatus(
  isPaid: boolean,
  daysUntilNextPayment: number,
): PaymentStatusConfig {
  if (!isPaid) {
    return {
      icon: <AlertCircle className="size-6" />,
      message: "Tu matrícula está pendiente de pago",
      colorClasses: "text-yellow-600 dark:text-yellow-400",
    };
  }
  // If the payment is overdue by more than 5 days
  if (daysUntilNextPayment <= -5) {
    return {
      icon: <AlertCircle className="size-6" />,
      message:
        "Tu matrícula está vencida, no podrás acceder a las clases. No se pagó en la fecha límite.",
      colorClasses: "text-red-600 dark:text-red-400",
    };
  }
  // If the payment is due in 5 days or less
  if (daysUntilNextPayment <= 30 && daysUntilNextPayment > 15) {
    return {
      icon: <CheckCircle className="size-6" />,
      message: `Tu matrícula está al día, pero tu próximo pago viene en ${daysUntilNextPayment - 15} día${daysUntilNextPayment - 15 === 1 ? "" : "s"}`,
      colorClasses: "text-yellow-600 dark:text-yellow-400",
    };
  }
  // If the payment is due in 15 days or less
  if (daysUntilNextPayment <= 15 && daysUntilNextPayment > -5) {
    return {
      icon: <Clock className="size-6" />,
      message: `Pendiente de pago, vence en ${daysUntilNextPayment + 5} día${daysUntilNextPayment + 5 === 1 ? "" : "s"}`,
      colorClasses: "text-yellow-600 dark:text-yellow-400",
    };
  }
  return {
    icon: <CheckCircle className="size-6" />,
    message: "Tu matrícula está al día",
    colorClasses: "text-green-600 dark:text-green-400",
  };
}
