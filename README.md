# Payslip Generator

A web application for generating employee payslips, built with modern web technologies.

## Features

- Multi-step form for easy data entry
- Input company, employee, and payroll information
- Calculate normal and overtime pay
- UIF (Unemployment Insurance Fund) contribution calculation
- PAYE (Pay As You Earn) tax calculation
- Additional deductions (loans, advances, and two customizable deductions)
- Real-time payslip preview
- Downloadable PDF payslip
- Print payslip functionality
- Authentication page for sign-in and sign-up (simulated)

## Technologies Used

- TypeScript
- React
- Next.js (Pages Router)
- Shadcn UI
- Radix UI
- Tailwind CSS
- jsPDF for PDF generation

## Project Structure

- `pages/index.tsx`: Main payslip generator with multi-step form
- `pages/auth.tsx`: Authentication page for sign-in and sign-up
- `components/CompanyInfo.tsx`: Company information form step
- `components/EmployeeInfo.tsx`: Employee information form step
- `components/PayrollInfo.tsx`: Payroll information form step
- `components/PayslipPreview.tsx`: Payslip preview component
- `lib/utils.ts`: Utility functions for calculations and formatting
- `lib/pdfUtils.ts`: PDF generation functionality

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Navigate to the main page to access the payslip generator form.
2. Fill in the required fields in each step (Company Info, Employee Info, Payroll Info).
3. Click on "Generate Payslip" to see the payslip preview.
4. Use the "Generate PDF" button to download the payslip as a PDF file.
5. Use the "Print" button to print the payslip directly.
6. Access the authentication page by clicking "Sign In / Sign Up" link.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
