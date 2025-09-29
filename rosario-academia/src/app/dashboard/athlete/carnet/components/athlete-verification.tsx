import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface AthleteVerificationProps {
  verificationUrl: string;
}

const AthleteVerification: React.FC<AthleteVerificationProps> = ({ verificationUrl }) => {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center border-l border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-[#2c2c2c]">
      <div className="mb-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
        Verificación de Matrícula
      </div>
      <QRCodeSVG value={verificationUrl} size={80} />
      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Escanea para verificar la matrícula del alumno en el sistema
      </div>
    </div>
  );
};

export default AthleteVerification;
