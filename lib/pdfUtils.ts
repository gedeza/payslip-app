import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyContact: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  normalHours: number;
  overtimeHours: number;
  normalPay: number;
  overtimePay: number;
  grossPay: number;
  uifDeduction: number;
  payeDeduction: number;
  totalDeductions: number;
  netPay: number;
}

export const generatePDF = (data: PayslipData, fileName: string) => {
  const pdf = new jsPDF();

  // Set font
  pdf.setFont("helvetica");

  // Add company details
  pdf.setFontSize(18);
  pdf.text("Payslip", 105, 15, { align: "center" });
  pdf.setFontSize(12);
  pdf.text(data.companyName, 20, 30);
  pdf.text(data.companyAddress, 20, 37);
  pdf.text(`Contact: ${data.companyContact}`, 20, 44);

  // Add employee details
  pdf.setFontSize(14);
  pdf.text("Employee Details", 20, 60);
  pdf.setFontSize(10);
  pdf.text(`Name: ${data.employeeName}`, 20, 70);
  pdf.text(`Pay Period: ${data.payPeriod}`, 20, 77);
  pdf.text(`Pay Date: ${data.payDate}`, 20, 84);

  // Add earnings table
  pdf.setFontSize(14);
  pdf.text("Earnings", 20, 100);
  pdf.setFontSize(10);
  const earningsBody = [
    ["Description", "Hours", "Rate", "Amount"],
    ["Normal Pay", data.normalHours.toString(), (data.normalPay / data.normalHours).toFixed(2), data.normalPay.toFixed(2)],
    ["Overtime Pay", data.overtimeHours.toString(), (data.overtimePay / data.overtimeHours).toFixed(2), data.overtimePay.toFixed(2)],
    ["Gross Pay", "", "", data.grossPay.toFixed(2)]
  ];
  (pdf as any).autoTable({
    startY: 105,
    head: [earningsBody[0]],
    body: earningsBody.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100] }
  } as UserOptions);

  // Add deductions table
  pdf.setFontSize(14);
  pdf.text("Deductions", 20, pdf.lastAutoTable.finalY + 20);
  pdf.setFontSize(10);
  const deductionsBody = [
    ["Description", "Amount"],
    ["UIF Deduction", data.uifDeduction.toFixed(2)],
    ["PAYE", data.payeDeduction.toFixed(2)],
    ["Total Deductions", data.totalDeductions.toFixed(2)]
  ];
  (pdf as any).autoTable({
    startY: (pdf as any).lastAutoTable.finalY + 25,
    head: [deductionsBody[0]],
    body: deductionsBody.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100] }
  } as UserOptions);

  // Add net pay
  pdf.setFontSize(14);
  pdf.text("Net Pay", 20, pdf.lastAutoTable.finalY + 20);
  pdf.setFontSize(16);
  pdf.text(`R ${data.netPay.toFixed(2)}`, 20, pdf.lastAutoTable.finalY + 30);

  // Save the PDF
  pdf.save(fileName);
};
