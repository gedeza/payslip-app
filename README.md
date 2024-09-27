# Employee Payroll System

## Overview

This Employee Payroll System is a web-based application that allows users to input employee information and payroll details, calculate salaries, and generate printable payslips. It's designed to be user-friendly and responsive, working well on both desktop and mobile devices.

## Features

- Input employee personal and bank details
- Calculate normal and overtime pay based on hourly rates and hours worked
- Option to calculate UIF (Unemployment Insurance Fund) contribution
- Flexible PAYE (Pay As You Earn) tax calculation
- Input for additional deductions like loans and advances
- Real-time payslip preview
- Printable A4 size payslip

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Setup

1. Clone this repository or download the HTML file.
2. Open the HTML file in a modern web browser.

No additional setup or installation is required as this is a client-side application.

## How to Use

1. Fill out the "Employee Information" form with the employee's personal details.
2. Complete the "Payroll Information" form:
   - Enter normal and overtime hourly rates
   - Input normal and overtime hours worked
   - Choose whether to calculate UIF
   - Select if the employee is taxable and enter the PAYE percentage if applicable
   - Enter any loan or advance deductions
3. Click the "Generate Payslip" button to create a payslip preview.
4. Review the payslip in the "Payslip Preview" section.
5. Click the "Print Payslip" button to print the payslip on A4 size paper.

## Customization

You can easily customize the appearance of the application by modifying the CSS variables in the `<style>` section of the HTML file:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    --text-color: #ecf0f1;
}