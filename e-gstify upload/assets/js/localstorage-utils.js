// localstorage-utils.js
// This file manages saving and retrieving invoice data

/**
 * Save invoice data to localStorage
 * @param {Array} products - Array of product objects
 * @param {Number} totalAmount - Total invoice amount
 */
function saveInvoiceData(products, totalAmount) {
    // Get existing data or initialize if none exists
    let salesData = JSON.parse(localStorage.getItem('egstify_sales_data')) || {
      totalSales: 0,
      gstCollected: 0,
      invoiceCount: 0,
      recentInvoices: []
    };
    
    // Calculate GST for this invoice
    let invoiceGst = 0;
    products.forEach(product => {
      invoiceGst += (product.cgst + product.sgst) * product.quantity;
    });
    
    // Update statistics
    salesData.totalSales += totalAmount;
    salesData.gstCollected += invoiceGst;
    salesData.invoiceCount += 1;
    
    // Add this invoice to recent invoices
    const newInvoice = {
      id: 'INV-' + Date.now(),
      date: new Date().toISOString(),
      amount: totalAmount,
      gst: invoiceGst,
      products: products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        gstRate: p.gstRate
      }))
    };
    
    // Keep only the last 10 invoices
    salesData.recentInvoices.unshift(newInvoice);
    if (salesData.recentInvoices.length > 10) {
      salesData.recentInvoices = salesData.recentInvoices.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('egstify_sales_data', JSON.stringify(salesData));
    
    return newInvoice.id; // Return the generated invoice ID
  }
  
  /**
   * Get all sales data from localStorage
   * @returns {Object} Sales data object
   */
  function getSalesData() {
    return JSON.parse(localStorage.getItem('egstify_sales_data')) || {
      totalSales: 0,
      gstCollected: 0,
      invoiceCount: 0,
      recentInvoices: []
    };
  }
  
  /**
   * Format currency as rupees
   * @param {Number} amount - Amount to format
   * @returns {String} Formatted currency string
   */
  function formatCurrency(amount) {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }