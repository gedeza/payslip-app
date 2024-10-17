# Payslip Generator

A simple web application that allows users to generate payslips for employees. The application captures employee details, calculates gross and net pay, and provides options to download or print the payslip.

## Features

- Input employee personal and bank details.
- Calculate normal and overtime pay based on hourly rates and hours worked.
- Option to calculate UIF (Unemployment Insurance Fund) contribution.
- Flexible PAYE (Pay As You Earn) tax calculation.
- Input for additional deductions like loans and advances.
- Real-time payslip preview.
- Downloadable PDF payslip.
- Print payslip functionality.

## Technologies Used

- HTML
- CSS
- JavaScript
- jsPDF (for PDF generation)
- html2canvas (for rendering HTML to canvas)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/payslip-generator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd payslip-generator
   ```
3. Open `index.html` in your web browser.

## Usage

1. Fill in the required fields with employee and company information.
2. Click on the "Generate Payslip" button to create a payslip preview.
3. Use the "Download Payslip" button to save the payslip as a PDF file.
4. Use the "Print Payslip" button to print the payslip directly.

## Validation

- ID number must be exactly 13 digits.
- Bank account number must be between 9 and 12 digits.
- Normal hours, overtime hours, normal rate, and overtime rate must be valid numbers.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for providing libraries like jsPDF and html2canvas that make this project possible.
