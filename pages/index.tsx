import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import PayslipPreview from '@/components/PayslipPreview'
import { getAgeFromIDNumber } from '@/lib/utils'

interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyContact: string;
  employeeName: string;
  idNumber: string;
  jobTitle: string;
  bankName: string;
  accountNo: string;
  payPeriod: string;
  payDate: string;
  normalHours: number;
  overtimeHours: number;
  normalRate: number;
  overtimeRate: number;
  uifEnabled: boolean;
  payeEnabled: boolean;
  loans: number;
  advances: number;
}

const calculatePAYE = (annualIncome: number, age: number): number => {
  // Determine tax threshold based on age
  let taxThreshold = 95750; // Default for under 65
  if (age >= 75) {
    taxThreshold = 165689;
  } else if (age >= 65) {
    taxThreshold = 148217;
  }

  // If income is below threshold, no tax is due
  if (annualIncome <= taxThreshold) {
    return 0;
  }

  // Calculate tax based on brackets for 2024/2025
  let tax = 0;
  if (annualIncome <= 237100) {
    tax = (annualIncome - taxThreshold) * 0.18;
  } else if (annualIncome <= 370500) {
    tax = 25326 + (annualIncome - 237100) * 0.26;
  } else if (annualIncome <= 512800) {
    tax = 60030 + (annualIncome - 370500) * 0.31;
  } else if (annualIncome <= 673000) {
    tax = 104070 + (annualIncome - 512800) * 0.36;
  } else if (annualIncome <= 857900) {
    tax = 161902 + (annualIncome - 673000) * 0.39;
  } else if (annualIncome <= 1817000) {
    tax = 234022 + (annualIncome - 857900) * 0.41;
  } else {
    tax = 626954 + (annualIncome - 1817000) * 0.45;
  }

  // Apply rebates
  let rebate = 17235; // Primary rebate
  if (age >= 75) {
    rebate += 9444 + 3145; // Secondary and tertiary rebates
  } else if (age >= 65) {
    rebate += 9444; // Secondary rebate
  }

  return Math.max(0, tax - rebate);
};

const calculateTakeHomePay = (monthlyGrossSalary: number, age: number): number => {
  const annualGrossSalary = monthlyGrossSalary * 12;
  const annualPAYE = calculatePAYE(annualGrossSalary, age);
  const monthlyPAYE = annualPAYE / 12;
  
  // Calculate UIF (1% of gross salary, capped at R177.12 per month)
  const uifDeduction = Math.min(monthlyGrossSalary * 0.01, 177.12);
  
  // Calculate take-home pay
  const takeHomePay = monthlyGrossSalary - monthlyPAYE - uifDeduction;
  
  return takeHomePay;
};

export default function PayslipGenerator() {
  const [payslipData, setPayslipData] = useState<PayslipData>({
    companyName: '', companyAddress: '', companyContact: '',
    employeeName: '', idNumber: '', jobTitle: '', bankName: '', accountNo: '',
    payPeriod: '', payDate: '', normalHours: 0, overtimeHours: 0,
    normalRate: 0, overtimeRate: 0, uifEnabled: false, payeEnabled: false,
    loans: 0, advances: 0
  });
  const [payslipContent, setPayslipContent] = useState<PayslipData | null>(null)
  const [showPayslipPreview, setShowPayslipPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    const { id, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;

    setPayslipData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const validateInputs = () => {
    const { idNumber, accountNo, normalHours, overtimeHours, normalRate, overtimeRate } = payslipData;
    if (idNumber.length !== 13 || isNaN(Number(idNumber))) {
      alert("ID number must be exactly 13 digits.");
      return false;
    }
    if (accountNo.length < 9 || accountNo.length > 12 || isNaN(Number(accountNo))) {
      alert("Bank Account number must be between 9 and 12 digits.");
      return false;
    }
    if (isNaN(normalHours) || isNaN(overtimeHours) || isNaN(normalRate) || isNaN(overtimeRate)) {
      alert("Normal hours, Overtime hours, Normal rate, and Overtime rate must be valid numbers.");
      return false;
    }
    return true;
  };

  const generatePayslip = () => {
    if (!validateInputs()) return;

    const {
      companyName,
      companyAddress,
      companyContact,
      employeeName,
      idNumber,
      payPeriod,
      payDate,
      normalHours,
      overtimeHours,
      normalRate,
      overtimeRate,
      uifEnabled,
      payeEnabled,
      loans,
      advances
    } = payslipData;

    const normalPay = normalHours * normalRate;
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = normalPay + overtimePay;

    const age = getAgeFromIDNumber(idNumber);

    const uifDeduction = uifEnabled ? Math.min(grossPay * 0.01, 177.12) : 0;
    const payeDeduction = payeEnabled ? calculatePAYE(grossPay * 12, age) / 12 : 0;
    const totalDeductions = uifDeduction + payeDeduction + loans + advances;
    const netPay = grossPay - totalDeductions;

    setPayslipContent({
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
      netPay
    });

    setShowPayslipPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 p-8">
            <CardTitle className="text-4xl font-extrabold text-center text-white">Payslip Generator</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-2">Company Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="companyName" className="text-indigo-700">Company Name</Label>
                    <Input type="text" id="companyName" value={payslipData.companyName} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress" className="text-indigo-700">Company Address</Label>
                    <Input type="text" id="companyAddress" value={payslipData.companyAddress} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="companyContact" className="text-indigo-700">Company Contact</Label>
                    <Input type="text" id="companyContact" value={payslipData.companyContact} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-2">Employee Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="employeeName" className="text-indigo-700">Employee Name</Label>
                    <Input type="text" id="employeeName" value={payslipData.employeeName} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="idNumber" className="text-indigo-700">Employee ID</Label>
                    <Input type="text" id="idNumber" value={payslipData.idNumber} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle" className="text-indigo-700">Job Title</Label>
                    <Input type="text" id="jobTitle" value={payslipData.jobTitle} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="bankName" className="text-indigo-700">Bank Name</Label>
                    <Input type="text" id="bankName" value={payslipData.bankName} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="accountNo" className="text-indigo-700">Account No</Label>
                    <Input type="text" id="accountNo" value={payslipData.accountNo} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-2">Pay Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="payPeriod" className="text-indigo-700">Pay Period (mm,yyyy)</Label>
                    <Input type="text" id="payPeriod" value={payslipData.payPeriod} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="payDate" className="text-indigo-700">Pay Date</Label>
                    <Input type="date" id="payDate" value={payslipData.payDate} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="normalHours" className="text-indigo-700">Normal Hours</Label>
                    <Input type="number" id="normalHours" value={payslipData.normalHours} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="overtimeHours" className="text-indigo-700">Overtime Hours</Label>
                    <Input type="number" id="overtimeHours" value={payslipData.overtimeHours} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="normalRate" className="text-indigo-700">Normal Rate</Label>
                    <Input type="number" id="normalRate" value={payslipData.normalRate} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate" className="text-indigo-700">Overtime Rate</Label>
                    <Input type="number" id="overtimeRate" value={payslipData.overtimeRate} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-2">Deductions</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uifEnabled" 
                      checked={payslipData.uifEnabled} 
                      onCheckedChange={(checked) => handleInputChange({ target: { id: 'uifEnabled', type: 'checkbox', checked } } as any)} 
                    />
                    <Label htmlFor="uifEnabled" className="text-indigo-700">UIF Enabled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="payeEnabled" 
                      checked={payslipData.payeEnabled} 
                      onCheckedChange={(checked) => handleInputChange({ target: { id: 'payeEnabled', type: 'checkbox', checked } } as any)} 
                    />
                    <Label htmlFor="payeEnabled" className="text-indigo-700">PAYE Enabled</Label>
                  </div>
                  <div>
                    <Label htmlFor="loans" className="text-indigo-700">Loans</Label>
                    <Input type="number" id="loans" value={payslipData.loans} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="advances" className="text-indigo-700">Advances</Label>
                    <Input type="number" id="advances" value={payslipData.advances} onChange={handleInputChange} className="mt-1 bg-indigo-50 border-indigo-300 focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                </div>
              </div>

              <div>
                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    generatePayslip();
                  }} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Generate Payslip
                </Button>
              </div>
            </form>

            {showPayslipPreview && (
              <div className="mt-8">
                <PayslipPreview {...payslipContent} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
