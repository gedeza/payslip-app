import { formatCurrency, getAgeFromIDNumber, cn } from './utils';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('R 1 000,00');
    expect(formatCurrency(1234.56)).toBe('R 1 234,56');
    expect(formatCurrency(0)).toBe('R 0,00');
    expect(formatCurrency(-1000)).toBe('-R 1 000,00');
    expect(formatCurrency(1000000)).toBe('R 1 000 000,00');
    expect(formatCurrency(0.01)).toBe('R 0,01');
    expect(formatCurrency(999999.99)).toBe('R 999 999,99');
  });
});

describe('getAgeFromIDNumber', () => {
  it('calculates age correctly', () => {
    const currentYear = new Date().getFullYear();
    const mockIDNumber = `${(currentYear - 30).toString().slice(-2)}01015001080`;
    expect(getAgeFromIDNumber(mockIDNumber)).toBe(30);
  });

  it('throws an error for invalid ID number', () => {
    expect(() => getAgeFromIDNumber('123')).toThrow('Invalid ID number');
  });
});

describe('cn', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
  });
});
