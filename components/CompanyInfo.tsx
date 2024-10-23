import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoProps {
  companyData: {
    companyName: string;
    companyAddress: string;
    companyContact: string;
    companyEmail: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">Company Information</h2>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" value={companyData.companyName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="companyAddress">Company Address</Label>
        <Input id="companyAddress" value={companyData.companyAddress} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="companyContact">Company Contact</Label>
        <Input id="companyContact" value={companyData.companyContact} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="companyEmail">Company Email</Label>
        <Input id="companyEmail" type="email" value={companyData.companyEmail} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default CompanyInfo;
