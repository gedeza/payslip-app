import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAgeFromIDNumber(idNumber: string): number {
  if (idNumber.length !== 13 || isNaN(Number(idNumber))) {
    throw new Error("Invalid ID number");
  }

  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(idNumber.substring(0, 2));
  const fullBirthYear = birthYear + (birthYear < 22 ? 2000 : 1900);
  
  return currentYear - fullBirthYear;
}

export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const wholeNumber = Math.floor(absAmount);
  const decimal = Math.round((absAmount - wholeNumber) * 100);
  
  const formattedWhole = wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedDecimal = decimal.toString().padStart(2, '0');
  
  const result = `R ${formattedWhole},${formattedDecimal}`;
  return amount < 0 ? `-${result}` : result;
}
