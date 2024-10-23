import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmployeeInfoProps {
  employeeData: {
    employeeName: string;
    idNumber: string;
    jobTitle: string;
    bankName: string;
    accountNo: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employeeData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">Employee Information</h2>
      <div>
        <Label htmlFor="employeeName">Employee Name</Label>
        <Input id="employeeName" value={employeeData.employeeName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="idNumber">ID Number</Label>
        <Input id="idNumber" value={employeeData.idNumber} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input id="jobTitle" value={employeeData.jobTitle} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input id="bankName" value={employeeData.bankName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="accountNo">Account Number</Label>
        <Input id="accountNo" value={employeeData.accountNo} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default EmployeeInfo;
