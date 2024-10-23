import React from 'react';
import { generatePDF } from '@/lib/pdfUtils';
import { formatCurrency } from '@/lib/utils';

interface PayslipPreviewProps {
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
  companyEmail: string; // Add this line
}

const PayslipPreview: React.FC<PayslipPreviewProps> = ({
  companyName,
  companyAddress,
  companyContact,
  employeeName,
  payPeriod,
  payDate,
  bankName,
  accountNo,
  normalHours,
  overtimeHours,
  normalPay,
  overtimePay,
  grossPay,
  uifDeduction,
  payeDeduction,
  totalDeductions,
  netPay,
  loans,
  advances,
  additionalDeduction1,
  additionalDeduction2,
  companyEmail, // Add this line
}) => {
  const handleGeneratePDF = () => {
    generatePDF({
      companyName,
      companyAddress,
      companyContact,
      companyEmail,
      employeeName,
      payPeriod,
      payDate,
      bankName,
      accountNo,
      normalHours,
      overtimeHours,
      normalPay,
      overtimePay,
      grossPay,
      uifDeduction,
      payeDeduction,
      totalDeductions,
      netPay,
      loans,
      advances,
      additionalDeduction1,
      additionalDeduction2,
    }, 'payslip.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="payslip-preview printable bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto" role="region" aria-label="Payslip Preview">
        <header className="payslip-header mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Payslip</h1>
          <hr className="border-t-2 border-blue-200 mb-4" />
          <div className="company-info text-sm text-gray-600">
            <h2 className="font-semibold">{companyName}</h2>
            <p>{companyAddress}</p>
            <p>Contact: {companyContact}</p>
            <p>Email: {companyEmail}</p>
          </div>
        </header>

        <section className="payslip-details mb-6" aria-labelledby="payslip-details-heading">
          <h2 id="payslip-details-heading" className="text-lg font-semibold text-blue-600 mb-2">Payslip Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><span className="font-medium">Employee Name:</span> {employeeName}</p>
            <p><span className="font-medium">Bank Name:</span> {bankName}</p>
            <p><span className="font-medium">Pay Period:</span> {payPeriod}</p>
            <p><span className="font-medium">Account Number:</span> {accountNo}</p>
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
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Normal Pay</td>
                <td className="p-2 text-right">{formatCurrency(normalPay)}</td>
              </tr>
              {overtimePay > 0 && (
                <tr>
                  <td className="p-2">Overtime Pay</td>
                  <td className="p-2 text-right">{formatCurrency(overtimePay)}</td>
                </tr>
              )}
              {advances > 0 && (
                <tr>
                  <td className="p-2">Advances</td>
                  <td className="p-2 text-right">{formatCurrency(advances)}</td>
                </tr>
              )}
              <tr className="font-semibold">
                <td className="p-2">Gross Pay</td>
                <td className="p-2 text-right">{formatCurrency(grossPay + advances)}</td>
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
              {loans > 0 && (
                <tr>
                  <td className="p-2">Loan Repayment</td>
                  <td className="p-2 text-right">{formatCurrency(loans)}</td>
                </tr>
              )}
              {additionalDeduction1 > 0 && (
                <tr>
                  <td className="p-2">Additional Deduction 1</td>
                  <td className="p-2 text-right">{formatCurrency(additionalDeduction1)}</td>
                </tr>
              )}
              {additionalDeduction2 > 0 && (
                <tr>
                  <td className="p-2">Additional Deduction 2</td>
                  <td className="p-2 text-right">{formatCurrency(additionalDeduction2)}</td>
                </tr>
              )}
              <tr className="font-semibold">
                <td className="p-2">Total Deductions</td>
                <td className="p-2 text-right">{formatCurrency(totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="net-pay" aria-labelledby="net-pay-heading">
          <h2 id="net-pay-heading" className="text-xl font-bold text-blue-600 mb-2">Net Pay</h2>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(netPay)}</p>
        </section>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Generate PDF"
        >
          Generate PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Print Payslip"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PayslipPreview; // Ensure this is a default export
