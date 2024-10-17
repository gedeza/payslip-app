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
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
