/**
 * Formats a raw number into a readable Vietnamese price string.
 * Example: 1200000 -> 1.200.000
 */
export const formatPriceInput = (value) => {
  if (!value && value !== 0) return '';
  
  // Convert to string and remove non-digits
  const stringValue = value.toString().replace(/\D/g, '');
  
  // Remove leading zeros
  const numericValue = stringValue.replace(/^0+/, '');
  
  if (!numericValue) return '0';
  
  // Format with dots every 3 digits
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parses a formatted price string back into a raw number.
 * Example: 1.200.000 -> 1200000
 */
export const parsePriceInput = (formattedValue) => {
  if (!formattedValue) return 0;
  const rawValue = formattedValue.toString().replace(/\./g, '');
  return Number(rawValue) || 0;
};

/**
 * Standard display format for currency
 */
export const displayVNPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price).replace('₫', '₫');
};
