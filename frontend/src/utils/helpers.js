/**
 * Format currency values
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

/**
 * Format date values
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate line amounts
 */
export const calculateLineAmounts = (quantity, price, taxRate) => {
  const qty = parseFloat(quantity) || 0;
  const prc = parseFloat(price) || 0;
  const tax = parseFloat(taxRate) || 0;

  const exclAmount = qty * prc;
  const taxAmount = exclAmount * (tax / 100);
  const inclAmount = exclAmount + taxAmount;

  return {
    exclAmount: parseFloat(exclAmount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    inclAmount: parseFloat(inclAmount.toFixed(2)),
  };
};

/**
 * Calculate order totals
 */
export const calculateOrderTotals = (lines) => {
  return lines.reduce(
    (acc, line) => {
      acc.excl += line.exclAmount || 0;
      acc.tax += line.taxAmount || 0;
      acc.incl += line.inclAmount || 0;
      return acc;
    },
    { excl: 0, tax: 0, incl: 0 }
  );
};

/**
 * Validate order data
 */
export const validateOrder = (order) => {
  const errors = [];

  if (!order.clientId) {
    errors.push('Please select a customer');
  }

  if (!order.invoiceNo) {
    errors.push('Please enter an invoice number');
  }

  if (!order.lines || order.lines.length === 0) {
    errors.push('Please add at least one line item');
  }

  if (order.lines && order.lines.length > 0) {
    const hasInvalidLine = order.lines.some(line => !line.itemId);
    if (hasInvalidLine) {
      errors.push('All line items must have a product selected');
    }
  }

  return errors;
};
