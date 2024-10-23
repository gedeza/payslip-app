import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './utils';

interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyContact: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  bankName: string;
  accountNo: string;
  normalHours: number;
  overtimeHours: number;
  normalPay: number;
  overtimePay: number;
  grossPay: number;
  uifDeduction: number;
  payeDeduction: number;
  totalDeductions: number;
  netPay: number;
  loans: number;
  advances: number;
  additionalDeduction1: number;
  additionalDeduction2: number;
  companyEmail: string;
}

interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: (string | number)[][];
}

interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: AutoTableOptions) => void;
  lastAutoTable: {
    finalY: number;
  };
}

export const generatePDF = (data: PayslipData, filename: string): void => {
  try {
    const doc = new jsPDF() as JsPDFWithAutoTable;

    // Add company details
    doc.setFontSize(20);
    doc.text(data.companyName, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(data.companyAddress, 105, 22, { align: 'center' });
    doc.text(`Contact: ${data.companyContact}`, 105, 27, { align: 'center' });
    doc.text(`Email: ${data.companyEmail}`, 105, 32, { align: 'center' });

    // Add payslip title
    doc.setFontSize(16);
    doc.text('PAYSLIP', 105, 40, { align: 'center' });

    // Add employee details
    doc.setFontSize(10);
    doc.text(`Employee: ${data.employeeName}`, 20, 50);
    doc.text(`Pay Period: ${data.payPeriod}`, 20, 55);
    doc.text(`Pay Date: ${data.payDate}`, 20, 60);
    doc.text(`Bank Name: ${data.bankName}`, 120, 50);
    doc.text(`Account Number: ${data.accountNo}`, 120, 55);

    // Add earnings table
    doc.autoTable({
      startY: 70,
      head: [['Earnings', 'Hours', 'Rate', 'Amount']],
      body: [
        ['Normal Pay', data.normalHours, formatCurrency(data.normalPay / data.normalHours), formatCurrency(data.normalPay)],
        ['Overtime Pay', data.overtimeHours, formatCurrency(data.overtimePay / data.overtimeHours), formatCurrency(data.overtimePay)],
        ['Advances', '', '', formatCurrency(data.advances)],
        ['Gross Pay', '', '', formatCurrency(data.grossPay)],
      ],
    });

    // Add deductions table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Deductions', 'Amount']],
      body: [
        ['UIF', formatCurrency(data.uifDeduction)],
        ['PAYE', formatCurrency(data.payeDeduction)],
        ['Loans', formatCurrency(data.loans)],
        ...(data.additionalDeduction1 > 0 ? [['Additional Deduction 1', formatCurrency(data.additionalDeduction1)]] : []),
        ...(data.additionalDeduction2 > 0 ? [['Additional Deduction 2', formatCurrency(data.additionalDeduction2)]] : []),
        ['Total Deductions', formatCurrency(data.totalDeductions)],
      ],
    });

    // Add net pay
    doc.setFontSize(12);
    doc.text(`Net Pay: ${formatCurrency(data.netPay)}`, 20, doc.lastAutoTable.finalY + 20);

    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again.');
  }
};
