import { useReactToPrint } from "react-to-print";

export const useHandlePrint = (cardRef: any, documentTitle: string) => {
  return useReactToPrint({
    contentRef: cardRef,
    documentTitle,
    bodyClass: "print-body",
    pageStyle: `
      @page {
        size: 100mm 80mm;
        margin: 0;
        marks: none;
      }
      @media print {
        @page {
          size: 110mm 110mm;
          margin: 0;
          marks: none; 
        }
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-card {
          width: 60mm;
          height: 110mm;
          padding: 4mm;
          box-sizing: border-box;
          font-size: 5pt;
          display: flex;
          flex-direction: column;
        }
        .print-card .header {
          font-size: 6pt;
          margin-bottom: 1mm;
        }
        .print-card .avatar {
          width: 20mm;
          height: 20mm;
        }
        .print-card .content {
          display: flex;
          flex-direction: row;
        }
        .print-card .info {
          margin-left: 2mm;
        }
        .print-card p {
          margin: 0.5mm 0;
        }
      }
    `,
    onPrintError: (error) => console.log(error),
  });
};
