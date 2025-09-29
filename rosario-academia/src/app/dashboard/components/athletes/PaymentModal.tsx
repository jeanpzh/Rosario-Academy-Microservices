"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, X, ArrowRight } from "lucide-react";

import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useAthleteModalStore } from "@/lib/stores/useAthleteStore";
// Helper function to generate random colors for confetti
function getRandomColor() {
  const colors = [
    "#34D399", // green
    "#60A5FA", // blue
    "#F472B6", // pink
    "#FBBF24", // yellow
    "#A78BFA", // purple
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function PaymentModal() {
  const { isOpen, modalType, closeModal } = useModalStore();
  const { currentItem } = useAthleteModalStore();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti animation when dialog opens
  useEffect(() => {
    if (isOpen && modalType === "CREATE_PAYMENT") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, modalType]);

  const handleNavigateToPayments = () => {
    if (currentItem) {
      const currentPath = window.location.pathname;
      const isAdmin = currentPath.includes("/admin/");

      // Construct the path based on whether we're in admin or auxiliar section
      const basePath = isAdmin ? "/dashboard/admin" : "/dashboard/auxiliar";
      router.push(`${basePath}/athlete-control/payments/${currentItem.id}`);
    }
    closeModal();
  };

  return (
    <>
      <DialogHeader>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check className="size-6 text-green-600" />
          </motion.div>
        </div>

        <DialogTitle className="mt-4 text-center text-xl">¡Registro exitoso!</DialogTitle>

        <DialogDescription className="text-center">
          {currentItem.first_name} ha sido registrado correctamente en el sistema.
        </DialogDescription>
      </DialogHeader>

      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute size-2 rounded-full"
                initial={{
                  top: "50%",
                  left: "50%",
                  backgroundColor: getRandomColor(),
                }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: [1, 0.8, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="mt-2 rounded-lg border bg-muted/50 p-4">
        <h4 className="mb-2 flex items-center font-medium">
          <CreditCard className="mr-2 size-4" />
          Gestión de pagos
        </h4>
        <p className="text-sm text-muted-foreground">
          ¿Desea registrar un pago para este deportista ahora?
        </p>
      </div>

      <DialogFooter className="mt-4 flex gap-2 sm:justify-between">
        <Button variant="outline" onClick={() => closeModal()} className="flex-1 sm:flex-none">
          <X className="mr-2 size-4" />
          No, más tarde
        </Button>

        <Button onClick={handleNavigateToPayments} className="group flex-1 sm:flex-none">
          Ir a pagos
          <motion.div
            className="ml-2 inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowRight className="size-4" />
          </motion.div>
        </Button>
      </DialogFooter>
    </>
  );
}
