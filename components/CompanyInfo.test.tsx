import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CompanyInfo from './CompanyInfo';

describe('CompanyInfo', () => {
  const mockHandleInputChange = jest.fn();
  const mockCompanyData = {
    companyName: '',
    companyAddress: '',
    companyContact: '',
    companyEmail: '',
  };

  it('renders correctly', () => {
    const { getByLabelText } = render(
      <CompanyInfo companyData={mockCompanyData} handleInputChange={mockHandleInputChange} />
    );

    expect(getByLabelText('Company Name')).toBeInTheDocument();
    expect(getByLabelText('Company Address')).toBeInTheDocument();
    expect(getByLabelText('Company Contact')).toBeInTheDocument();
    expect(getByLabelText('Company Email')).toBeInTheDocument();
  });

  it('calls handleInputChange when input changes', () => {
    const { getByLabelText } = render(
      <CompanyInfo companyData={mockCompanyData} handleInputChange={mockHandleInputChange} />
    );

    fireEvent.change(getByLabelText('Company Name'), { target: { value: 'Test Company' } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });
});
