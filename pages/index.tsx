// @ts-check
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PayslipPreview from '@/components/PayslipPreview'
import { getAgeFromIDNumber } from '@/lib/utils'
import Link from 'next/link'
import CompanyInfo from '@/components/CompanyInfo'
import EmployeeInfo from '@/components/EmployeeInfo'
import PayrollInfo from '@/components/PayrollInfo'
import { Loader2 } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

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
  normalPay: number;
  overtimePay: number;
  grossPay: number;
  uifDeduction: number;
  payeDeduction: number;
  totalDeductions: number;
  netPay: number;
  additionalDeduction1: number;
  additionalDeduction2: number;
  companyEmail: string;
}

const STORAGE_KEY = 'payslipFormData';

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

const validateInputs = (): string[] => {
  const errors: string[] = [];

  // Add validation logic here
  if (!payslipData.companyName.trim()) errors.push("Company Name is required");
  if (!payslipData.employeeName.trim()) errors.push("Employee Name is required");
  // Add more validation checks as needed

  return errors;
};

export default function PayslipGenerator() {
  const [step, setStep] = useState(1);
  const [payslipData, setPayslipData] = useState<PayslipData>({
    companyName: '', companyAddress: '', companyContact: '',
    employeeName: '', idNumber: '', jobTitle: '', bankName: '', accountNo: '',
    payPeriod: '', payDate: '', normalHours: 0, overtimeHours: 0,
    normalRate: 0, overtimeRate: 0, uifEnabled: false, payeEnabled: false,
    loans: 0, advances: 0,
    additionalDeduction1: 0,
    additionalDeduction2: 0,
    companyEmail: '', // Add this line
  });
  const [payslipContent, setPayslipContent] = useState<PayslipData | null>(null)
  const [showPayslipPreview, setShowPayslipPreview] = useState(false)
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Load data from local storage when component mounts
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setPayslipData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') {
        router.push('/auth')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    const newPayslipData = {
      ...payslipData,
      [id]: type === 'number' ? parseFloat(value) || 0 : value
    };
    setPayslipData(newPayslipData);
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayslipData));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newPayslipData = {
      ...payslipData,
      [id]: checked
    };
    setPayslipData(newPayslipData);
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayslipData));
  };

  const clearForm = () => {
    setPayslipData({
      companyName: '', companyAddress: '', companyContact: '',
      employeeName: '', idNumber: '', jobTitle: '', bankName: '', accountNo: '',
      payPeriod: '', payDate: '', normalHours: 0, overtimeHours: 0,
      normalRate: 0, overtimeRate: 0, uifEnabled: false, payeEnabled: false,
      loans: 0, advances: 0,
      additionalDeduction1: 0,
      additionalDeduction2: 0,
      companyEmail: '',
    });
    localStorage.removeItem(STORAGE_KEY);
    setStep(1);
    setErrors([]);
    setShowPayslipPreview(false);
  };

  const validateStep = (currentStep: number): boolean => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1: // Company Information
        if (!payslipData.companyName.trim()) errors.push("Company Name is required");
        if (!payslipData.companyAddress.trim()) errors.push("Company Address is required");
        if (!payslipData.companyContact.trim()) errors.push("Company Contact is required");
        if (!payslipData.companyEmail.trim()) errors.push("Company Email is required");
        if (payslipData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payslipData.companyEmail)) {
          errors.push("Invalid Company Email format");
        }
        break;
      case 2: // Employee Information
        if (!payslipData.employeeName.trim()) errors.push("Employee Name is required");
        if (!payslipData.idNumber.trim()) errors.push("ID Number is required");
        if (payslipData.idNumber.length !== 13 || isNaN(Number(payslipData.idNumber))) {
          errors.push("ID Number must be exactly 13 digits");
        }
        if (!payslipData.jobTitle.trim()) errors.push("Job Title is required");
        if (!payslipData.bankName.trim()) errors.push("Bank Name is required");
        if (!payslipData.accountNo.trim()) errors.push("Account Number is required");
        if (payslipData.accountNo.length < 9 || payslipData.accountNo.length > 12 || isNaN(Number(payslipData.accountNo))) {
          errors.push("Account Number must be between 9 and 12 digits");
        }
        break;
      case 3: // Payroll Information
        if (!payslipData.payPeriod.trim()) errors.push("Pay Period is required");
        if (!payslipData.payDate) errors.push("Pay Date is required");
        if (isNaN(payslipData.normalHours) || payslipData.normalHours <= 0) {
          errors.push("Normal Hours must be a positive number");
        }
        if (isNaN(payslipData.overtimeHours) || payslipData.overtimeHours < 0) {
          errors.push("Overtime Hours must be a non-negative number");
        }
        if (isNaN(payslipData.normalRate) || payslipData.normalRate <= 0) {
          errors.push("Normal Rate must be a positive number");
        }
        if (isNaN(payslipData.overtimeRate) || payslipData.overtimeRate < 0) {
          errors.push("Overtime Rate must be a non-negative number");
        }
        break;
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const generatePayslip = async () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);

    setIsLoading(true);
    try {
      // Simulate an async operation (e.g., API call or complex calculation)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const {
        companyName,
        companyAddress,
        companyContact,
        employeeName,
        idNumber,
        bankName,  // Add this line
        accountNo, // Add this line
        payPeriod,
        payDate,
        normalHours,
        overtimeHours,
        normalRate,
        overtimeRate,
        uifEnabled,
        payeEnabled,
        loans,
        advances,
        additionalDeduction1,
        additionalDeduction2,
      } = payslipData;

      const normalPay = normalHours * normalRate;
      const overtimePay = overtimeHours * overtimeRate;
      const grossPay = normalPay + overtimePay + advances; // Include advances in gross pay

      const age = getAgeFromIDNumber(idNumber);

      const uifDeduction = uifEnabled ? Math.min(grossPay * 0.01, 177.12) : 0;
      const payeDeduction = payeEnabled ? calculatePAYE(grossPay * 12, age) / 12 : 0;
      const totalDeductions = uifDeduction + payeDeduction + loans + additionalDeduction1 + additionalDeduction2; // Include loans and additional deductions in deductions
      const netPay = grossPay - totalDeductions;

      setPayslipContent({
        companyName,
        companyAddress,
        companyContact,
        employeeName,
        bankName,  // Add this line
        accountNo, // Add this line
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
        loans,
        advances,
        additionalDeduction1,
        additionalDeduction2,
        companyEmail: payslipData.companyEmail, // Add this line
      });

      setShowPayslipPreview(true);
    } catch (error) {
      console.error('Error generating payslip:', error);
      setErrors(['An error occurred while generating the payslip. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <CompanyInfo companyData={payslipData} handleInputChange={handleInputChange} />;
      case 2:
        return <EmployeeInfo employeeData={payslipData} handleInputChange={handleInputChange} />;
      case 3:
        return <PayrollInfo payrollData={payslipData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-right">
          <Button onClick={handleSignOut} className="text-white hover:text-indigo-200 transition-colors">
            Sign Out
          </Button>
        </div>
        <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 p-8">
            <CardTitle className="text-4xl font-extrabold text-center text-white">Payslip Generator</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <nav aria-label="Form Steps" className="mb-8">
              <ol className="flex justify-between">
                {[1, 2, 3].map((s) => (
                  <li key={s} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        s <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                      aria-current={s === step ? 'step' : undefined}
                    >
                      {s}
                    </div>
                    <span className={`mt-2 ${s <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {s === 1 ? 'Company Info' : s === 2 ? 'Employee Info' : 'Payroll Info'}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
            
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button onClick={prevStep} aria-label="Previous Step">
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={nextStep} aria-label="Next Step">
                  Next
                </Button>
              ) : (
                <Button onClick={generatePayslip} disabled={isLoading} aria-label="Generate Payslip">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    'Generate Payslip'
                  )}
                </Button>
              )}
            </div>
            <div className="mt-4">
              <Button onClick={clearForm} variant="outline" aria-label="Clear Form">
                Clear Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {showPayslipPreview && payslipContent && (
          <div className="mt-8">
            <PayslipPreview {...payslipContent} />
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert" aria-live="assertive">
            <strong className="font-bold">Please correct the following errors:</strong>
            <ul className="mt-2 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
