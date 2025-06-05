/**
 * Format blockchain address with ellipsis
 * @param {string} address Full blockchain address
 * @param {number} start Number of characters to show at start
 * @param {number} end Number of characters to show at end
 * @returns {string} Formatted address
 */
export function formatAddress(address, start = 6, end = 4) {
  if (!address) return '';
  
  if (address.length <= start + end) {
    return address;
  }
  
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format currency amount
 * @param {string|number} amount Amount to format
 * @param {number} decimals Number of decimals to show
 * @param {string} symbol Currency symbol
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount, decimals = 2, symbol = '') {
  if (!amount) return `0${symbol ? ' ' + symbol : ''}`;
  
  const parsedAmount = parseFloat(amount);
  
  if (isNaN(parsedAmount)) {
    return `0${symbol ? ' ' + symbol : ''}`;
  }
  
  // Format with locale
  const formatted = parsedAmount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${formatted}${symbol ? ' ' + symbol : ''}`;
}

/**
 * Format percentage
 * @param {string|number} value Value to format as percentage
 * @param {number} decimals Number of decimals to show
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 2) {
  if (!value) return '0%';
  
  const parsedValue = parseFloat(value);
  
  if (isNaN(parsedValue)) {
    return '0%';
  }
  
  return `${parsedValue.toFixed(decimals)}%`;
}

/**
 * Format date from timestamp
 * @param {number} timestamp Unix timestamp
 * @param {boolean} includeTime Whether to include time
 * @returns {string} Formatted date
 */
export function formatDate(timestamp, includeTime = false) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  if (includeTime) {
    return date.toLocaleString();
  }
  
  return date.toLocaleDateString();
}

/**
 * Format time from seconds
 * @param {number} seconds Time in seconds
 * @returns {string} Formatted time (MM:SS)
 */
export function formatTime(seconds) {
  if (!seconds) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
} 