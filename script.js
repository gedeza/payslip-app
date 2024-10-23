// @ts-check
import jsPDF from 'jspdf';

document.addEventListener('DOMContentLoaded', () => {
    const generatePayslipButton = document.getElementById('generate-payslip');
    if (generatePayslipButton) {
        generatePayslipButton.addEventListener('click', generatePayslip);
    }

    function generatePayslip() {
        console.log("Generate Payslip button clicked"); // Debugging line

        // Get input values
        const companyName = getInputValue('company-name');
        const companyAddress = getInputValue('company-address');
        const companyContact = getInputValue('company-contact');
        const employeeName = getInputValue('employee-name');
        const idNumber = getInputValue('id-number');
        const jobTitle = getInputValue('job-title');
        const bankName = getInputValue('bank-name');
        const accountNo = getInputValue('account-no');
        const payPeriod = getInputValue('pay-period');
        const payDate = getInputValue('pay-date');
        const normalHours = getFloatValue('normal-hours');
        const overtimeHours = getFloatValue('overtime-hours');
        const normalRate = getFloatValue('normal-rate');
        const overtimeRate = getFloatValue('overtime-rate');
        const uifEnabled = getCheckboxValue('uif-enabled');
        const payeEnabled = getCheckboxValue('paye-enabled');
        const loans = getFloatValue('loans') || 0;
        const advances = getFloatValue('advances') || 0;

        // Validation checks
        if (!validateInputs(idNumber, accountNo, normalHours, overtimeHours, normalRate, overtimeRate)) {
            return; // Stop execution if validation fails
        }

        // Calculate gross pay
        const normalPay = normalHours * normalRate; // Precise calculation
        const overtimePay = overtimeHours * overtimeRate; // Precise calculation
        const grossPay = normalPay + overtimePay; // Precise calculation

        // Calculate deductions
        const uifDeduction = uifEnabled ? grossPay * 0.01 : 0; // Precise calculation
        const payeDeduction = payeEnabled ? calculatePAYE(grossPay) : 0; // Precise calculation
        const totalDeductions = uifDeduction + payeDeduction + loans + advances; // Precise calculation

        // Calculate net pay
        const netPay = grossPay - totalDeductions; // Precise calculation

        // Generate payslip HTML
        const payslipHTML = `
            <h1 style="text-align: center; color: blue; text-transform: uppercase;">PAYSLIP</h1>
            <p>${companyName}</p>
            <p>Address: ${companyAddress}</p>
            <p>Contact: ${companyContact}</p>
            <hr>
            <h2 style="text-align: left;">Employee Information</h2>
            <p style="text-indent: 20px;">Employee Name: ${employeeName}</p>
            <p style="text-indent: 20px;">Employee ID: ${idNumber}</p>
            <p style="text-indent: 20px;">Job Title: ${jobTitle}</p>
            <p style="text-indent: 20px;">Bank Name: ${bankName}</p>
            <p style="text-indent: 20px;">Account No: ${accountNo}</p>
            <hr>
            <h2 style="text-align: left;">Payslip Details</h2>
            <p style="text-indent: 20px;">Pay Period: ${payPeriod}</p>
            <p style="text-indent: 20px;">Pay Date: ${payDate}</p>
            <p style="text-indent: 20px;">Normal Hours: ${normalHours} @ R ${formatCurrency(normalRate)}</p>
            <p style="text-indent: 20px;">Overtime: ${overtimeHours} @ R ${formatCurrency(overtimeRate)}</p>
            <p style="text-align: left;"><strong>Gross Pay: R ${formatCurrency(grossPay)}</strong></p>
            <h3>Deductions:</h3>
            <p style="text-indent: 20px;">UIF Deduction: R ${formatCurrency(uifDeduction)}</p>
            <p style="text-indent: 20px;">PAYE Deduction: R ${formatCurrency(payeDeduction)}</p>
            <h3 style="color: blue; text-indent: 20px;">Net Pay: R ${formatCurrency(netPay)}</h3>
            <button id="download-payslip" style="margin-top: 20px;">Download Payslip</button>
            <button id="print-payslip" style="margin-top: 20px;">Print Payslip</button>
        `;

        // Update payslip preview
        document.getElementById('payslip-content').innerHTML = payslipHTML;

        // Add event listeners for the new buttons
        document.getElementById('download-payslip').addEventListener('click', function() {
            const pdf = new jsPDF();
            pdf.html(document.getElementById('payslip-content'), {
                callback: function (doc) {
                    doc.save('payslip.pdf'); // Prompt user to save the PDF
                },
                x: 10,
                y: 10
            });
        });

        document.getElementById('print-payslip').addEventListener('click', function() {
            const printContent = document.getElementById('payslip-content').innerHTML;
            const newWindow = window.open('', '', 'width=600,height=400');
            newWindow.document.write(`
                <html>
                <head>
                    <title>Print Payslip</title>
                </head>
                <body>
                    ${printContent}
                </body>
                </html>
            `);
            newWindow.document.close();
            newWindow.print();
        });
    }

    function validateInputs(idNumber, accountNo, normalHours, overtimeHours, normalRate, overtimeRate) {
        // Validate ID number (must be 13 digits)
        if (idNumber.length !== 13 || isNaN(idNumber)) {
            alert("ID number must be exactly 13 digits.");
            return false;
        }

        // Validate Bank Account number (must be between 9 and 12 digits)
        if (accountNo.length < 9 || accountNo.length > 12 || isNaN(accountNo)) {
            alert("Bank Account number must be between 9 and 12 digits.");
            return false;
        }

        // Validate Normal Hours, Overtime Hours, Normal Rate, and Overtime Rate (must be numbers)
        if (isNaN(normalHours) || isNaN(overtimeHours) || isNaN(normalRate) || isNaN(overtimeRate)) {
            alert("Normal hours, Overtime hours, Normal rate, and Overtime rate must be valid numbers.");
            return false;
        }

        return true; // All validations passed
    }

    function formatCurrency(amount) {
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function calculatePAYE(annualIncome) {
        // Implement PAYE calculation based on tax brackets
        if (annualIncome <= 95750) {
            return 0;
        } else if (annualIncome <= 365000) {
            return (annualIncome - 95750) * 0.18;
        } else if (annualIncome <= 550000) {
            return 48465 + (annualIncome - 365000) * 0.26;
        } else if (annualIncome <= 750000) {
            return 96564 + (annualIncome - 550000) * 0.31;
        } else if (annualIncome <= 1000000) {
            return 158564 + (annualIncome - 750000) * 0.36;
        } else {
            return 248564 + (annualIncome - 1000000) * 0.39;
        }
    }

    // Helper functions
    function getInputValue(id) {
        const element = document.getElementById(id);
        return element instanceof HTMLInputElement ? element.value : '';
    }

    function getFloatValue(id) {
        return parseFloat(getInputValue(id));
    }

    function getCheckboxValue(id) {
        const element = document.getElementById(id);
        return element instanceof HTMLInputElement ? element.checked : false;
    }
});
