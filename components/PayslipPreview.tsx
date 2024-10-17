import React, { useRef } from 'react';
import { generatePDF } from '@/lib/pdfUtils';
import { formatCurrency } from '@/lib/utils';

interface PayslipPreviewProps {
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
  idNumber: string;
  jobTitle: string;
  bankName: string;
  accountNo: string;
}

const PayslipPreview: React.FC<PayslipPreviewProps> = ({
  companyName,
  companyAddress,
  companyContact,
  employeeName,
  payPeriod,
  payDate,
  normalHours,
  overtimeHours,
  normalPay,
  overtimePay,
  grossPay,
  uifDeduction,
  payeDeduction,
  totalDeductions,
  netPay,
  idNumber,
  jobTitle,
  bankName,
  accountNo,
}) => {
  const payslipRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = () => {
    generatePDF({
      companyName,
      companyAddress,
      companyContact,
      employeeName,
      payPeriod,
      payDate,
      normalHours,
      overtimeHours,
      normalPay,
      overtimePay,
      grossPay,
      uifDeduction,
      payeDeduction,
      totalDeductions,
      netPay,
      idNumber,
      jobTitle,
      bankName,
      accountNo
    }, 'payslip.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div ref={payslipRef} className="payslip-preview printable bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <header className="payslip-header mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Payslip</h1>
          <hr className="border-t-2 border-blue-200 mb-4" />
          <div className="company-info text-sm text-gray-600">
            <h2 className="font-semibold">{companyName}</h2>
            <p>{companyAddress}</p>
            <p>Contact: {companyContact}</p>
          </div>
        </header>

        <section className="payslip-details mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Payslip Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Employee Name:</span> {employeeName}</p>
            <p><span className="font-medium">Pay Period:</span> {payPeriod}</p>
            <p><span className="font-medium">Pay Date:</span> {payDate}</p>
          </div>
        </section>

        <section className="hours-worked mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Hours Worked</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Normal Hours:</span> {normalHours}</p>
            <p><span className="font-medium">Overtime Hours:</span> {overtimeHours}</p>
          </div>
        </section>

        <section className="earnings mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Earnings</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Hours</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Normal Pay</td>
                <td className="p-2 text-right">{formatCurrency(normalPay / normalHours)}</td>
                <td className="p-2 text-right">{normalHours}</td>
                <td className="p-2 text-right">{formatCurrency(normalPay)}</td>
              </tr>
              {overtimeHours > 0 && (
                <tr>
                  <td className="p-2">Overtime Pay</td>
                  <td className="p-2 text-right">{formatCurrency(overtimePay / overtimeHours)}</td>
                  <td className="p-2 text-right">{overtimeHours}</td>
                  <td className="p-2 text-right">{formatCurrency(overtimePay)}</td>
                </tr>
              )}
              <tr className="font-semibold">
                <td className="p-2">Gross Pay</td>
                <td colSpan={3} className="p-2 text-right">{formatCurrency(grossPay)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="deductions mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Deductions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">UIF Deduction</td>
                <td className="p-2 text-right">{formatCurrency(uifDeduction)}</td>
              </tr>
              <tr>
                <td className="p-2">PAYE</td>
                <td className="p-2 text-right">{formatCurrency(payeDeduction)}</td>
              </tr>
              <tr className="font-semibold">
                <td className="p-2">Total Deductions</td>
                <td className="p-2 text-right">{formatCurrency(totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="net-pay">
          <h2 className="text-xl font-bold text-blue-600 mb-2">Net Pay</h2>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(netPay)}</p>
        </section>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PayslipPreview;
