import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PayrollInfoProps {
  payrollData: {
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
    additionalDeduction1: number;
    additionalDeduction2: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (id: string, checked: boolean) => void;
}

const PayrollInfo: React.FC<PayrollInfoProps> = ({ payrollData, handleInputChange, handleCheckboxChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">Payroll Information</h2>
      <div>
        <Label htmlFor="payPeriod">Pay Period</Label>
        <Input id="payPeriod" value={payrollData.payPeriod} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="payDate">Pay Date</Label>
        <Input id="payDate" type="date" value={payrollData.payDate} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="normalHours">Normal Hours</Label>
        <Input id="normalHours" type="number" value={payrollData.normalHours} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="overtimeHours">Overtime Hours</Label>
        <Input id="overtimeHours" type="number" value={payrollData.overtimeHours} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="normalRate">Normal Rate</Label>
        <Input id="normalRate" type="number" value={payrollData.normalRate} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="overtimeRate">Overtime Rate</Label>
        <Input id="overtimeRate" type="number" value={payrollData.overtimeRate} onChange={handleInputChange} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="uifEnabled" 
          checked={payrollData.uifEnabled} 
          onCheckedChange={(checked) => handleCheckboxChange('uifEnabled', checked as boolean)} 
        />
        <Label htmlFor="uifEnabled">UIF Enabled</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="payeEnabled" 
          checked={payrollData.payeEnabled} 
          onCheckedChange={(checked) => handleCheckboxChange('payeEnabled', checked as boolean)} 
        />
        <Label htmlFor="payeEnabled">PAYE Enabled</Label>
      </div>
      <div>
        <Label htmlFor="loans">Loans</Label>
        <Input id="loans" type="number" value={payrollData.loans} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="advances">Advances</Label>
        <Input id="advances" type="number" value={payrollData.advances} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="additionalDeduction1">Additional Deduction 1</Label>
        <Input id="additionalDeduction1" type="number" value={payrollData.additionalDeduction1} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="additionalDeduction2">Additional Deduction 2</Label>
        <Input id="additionalDeduction2" type="number" value={payrollData.additionalDeduction2} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default PayrollInfo;
