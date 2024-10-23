import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EmployeeInfo from './EmployeeInfo';

describe('EmployeeInfo', () => {
  const mockHandleInputChange = jest.fn();
  const mockEmployeeData = {
    employeeName: '',
    idNumber: '',
    jobTitle: '',
    bankName: '',
    accountNo: '',
  };

  it('renders correctly', () => {
    const { getByLabelText } = render(
      <EmployeeInfo employeeData={mockEmployeeData} handleInputChange={mockHandleInputChange} />
    );

    expect(getByLabelText('Employee Name')).toBeInTheDocument();
    expect(getByLabelText('ID Number')).toBeInTheDocument();
    expect(getByLabelText('Job Title')).toBeInTheDocument();
    expect(getByLabelText('Bank Name')).toBeInTheDocument();
    expect(getByLabelText('Account Number')).toBeInTheDocument();
  });

  it('calls handleInputChange when input changes', () => {
    const { getByLabelText } = render(
      <EmployeeInfo employeeData={mockEmployeeData} handleInputChange={mockHandleInputChange} />
    );

    fireEvent.change(getByLabelText('Employee Name'), { target: { value: 'John Doe' } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });
});
