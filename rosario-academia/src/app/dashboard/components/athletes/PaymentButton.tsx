"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, CreditCard, X } from "lucide-react";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { AnimatePresence, motion } from "framer-motion";
import { usePaymentCreation } from "@/hooks/use-payment-creation";
import { PaymentForm } from "./PaymentForm";

interface HoverPaymentModalProps {
  athleteId: string;
  onSuccess?: () => void;
  className?: string;
}

type Step = "confirmation" | "payment-form";

export function HoverPaymentModal({ athleteId, onSuccess, className }: HoverPaymentModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState<Step>("confirmation");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { athlete, paymentMethods, isLoading, createPayment, isPending } =
    usePaymentCreation(athleteId);

  // Función para obtener el nombre completo del estudiante
  const getFullName = () => {
    if (!athlete) return "Estudiante";
    const { first_name, paternal_last_name, maternal_last_name } = athlete;
    return `${first_name} ${paternal_last_name} ${maternal_last_name}`;
  };

  // Muestra el modal con un pequeño retraso para evitar activaciones accidentales
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsModalVisible(true);
    }, 200);
  };

  // Evita que el modal se cierre si el usuario se desplaza sobre él
  const handleModalMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsModalVisible(true);
  };

  // Manejo de la sumisión del pago
  const handlePaymentSubmit = async (formData: any) => {
    try {
      await createPayment(formData);

      // Auto-cierre después del mensaje de éxito
      setTimeout(() => {
        setIsModalVisible(false);
        setStep("confirmation");
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  // Reinicia el paso a "confirmation" cuando se cierra el modal
  useEffect(() => {
    if (!isModalVisible) {
      setStep("confirmation");
    }
  }, [isModalVisible]);

  // Limpieza del timeout en desmontaje
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <div onMouseEnter={handleMouseEnter}>
        <HoverBorderGradient className={`flex items-center gap-2 p-4 ${className}`}>
          <CreditCard className="size-4" />
          Añadir Pago
        </HoverBorderGradient>
      </div>

      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleModalMouseEnter}
            className="absolute right-0 top-full z-50 mt-2 w-[400px] rounded-lg border bg-card p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            style={{ transformOrigin: "top right" }}
          >
            <div className="absolute -top-2 right-6 border-x-8 border-b-8 border-x-transparent border-b-card"></div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Cargando información...</p>
              </div>
            ) : (
              <>
                {step === "confirmation" && (
                  <div className="space-y-4">
                    <h3 id="payment-modal-title" className="text-lg font-semibold">
                      Confirmación de pago
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ¿El estudiante <span className="font-bold">{getFullName()}</span> ha realizado
                      el pago?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsModalVisible(false)}
                      >
                        No, finalizar proceso
                      </button>
                      <button
                        className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                        onClick={() => setStep("payment-form")}
                      >
                        Sí, continuar al registro
                      </button>
                    </div>
                  </div>
                )}

                {step === "payment-form" && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 id="payment-modal-title" className="text-xl font-medium">
                        Registro de pago
                      </h3>
                      <button
                        className="rounded p-2 hover:bg-accent"
                        aria-label="Cerrar"
                        onClick={() => setIsModalVisible(false)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <p className="mb-4 text-sm">
                      Ingrese los detalles del pago para{" "}
                      <span className="font-bold">{getFullName()}</span>
                    </p>
                    <PaymentForm
                      paymentMethods={paymentMethods}
                      onSubmit={handlePaymentSubmit}
                      isPending={isPending}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
