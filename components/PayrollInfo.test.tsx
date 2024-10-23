import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PayrollInfo from './PayrollInfo';

describe('PayrollInfo', () => {
  const mockHandleInputChange = jest.fn();
  const mockHandleCheckboxChange = jest.fn();
  const mockPayrollData = {
    payPeriod: '',
    payDate: '',
    normalHours: 0,
    overtimeHours: 0,
    normalRate: 0,
    overtimeRate: 0,
    uifEnabled: false,
    payeEnabled: false,
    loans: 0,
    advances: 0,
    additionalDeduction1: 0,
    additionalDeduction2: 0,
  };

  it('renders correctly', () => {
    const { getByLabelText } = render(
      <PayrollInfo 
        payrollData={mockPayrollData} 
        handleInputChange={mockHandleInputChange}
        handleCheckboxChange={mockHandleCheckboxChange}
      />
    );

    expect(getByLabelText('Pay Period')).toBeInTheDocument();
    expect(getByLabelText('Pay Date')).toBeInTheDocument();
    expect(getByLabelText('Normal Hours')).toBeInTheDocument();
    expect(getByLabelText('Overtime Hours')).toBeInTheDocument();
    expect(getByLabelText('Normal Rate')).toBeInTheDocument();
    expect(getByLabelText('Overtime Rate')).toBeInTheDocument();
    expect(getByLabelText('UIF Enabled')).toBeInTheDocument();
    expect(getByLabelText('PAYE Enabled')).toBeInTheDocument();
    expect(getByLabelText('Loans')).toBeInTheDocument();
    expect(getByLabelText('Advances')).toBeInTheDocument();
    expect(getByLabelText('Additional Deduction 1')).toBeInTheDocument();
    expect(getByLabelText('Additional Deduction 2')).toBeInTheDocument();
  });

  it('calls handleInputChange when input changes', () => {
    const { getByLabelText } = render(
      <PayrollInfo 
        payrollData={mockPayrollData} 
        handleInputChange={mockHandleInputChange}
        handleCheckboxChange={mockHandleCheckboxChange}
      />
    );

    fireEvent.change(getByLabelText('Normal Hours'), { target: { value: '40' } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('calls handleCheckboxChange when checkbox changes', () => {
    const { getByLabelText } = render(
      <PayrollInfo 
        payrollData={mockPayrollData} 
        handleInputChange={mockHandleInputChange}
        handleCheckboxChange={mockHandleCheckboxChange}
      />
    );

    fireEvent.click(getByLabelText('UIF Enabled'));
    expect(mockHandleCheckboxChange).toHaveBeenCalled();
  });
});
