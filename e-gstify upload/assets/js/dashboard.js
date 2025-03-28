// Add this script to your dashboard.html page, after including the localstorage-utils.js script

document.addEventListener("DOMContentLoaded", function() {
    // Load sales data from localStorage
    const salesData = getSalesData();
    
    // Update the dashboard metrics
    document.getElementById("total-sales").textContent = formatCurrency(salesData.totalSales);
    document.getElementById("gst-collected").textContent = formatCurrency(salesData.gstCollected);
    document.getElementById("invoice-count").textContent = salesData.invoiceCount.toString();
    
    // Add a table to display recent invoices if there are any
    if (salesData.recentInvoices.length > 0) {
        const recentInvoicesSection = document.getElementById("recent-invoices");
        
        // Create table element
        const table = document.createElement("table");
        table.className = "table table-hover";
        
        // Create table header
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>GST</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement("tbody");
        
        // Add rows for each invoice
        salesData.recentInvoices.forEach(invoice => {
            const row = document.createElement("tr");
            const date = new Date(invoice.date);
            
            row.innerHTML = `
                <td>${invoice.id}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${formatCurrency(invoice.amount)}</td>
                <td>${formatCurrency(invoice.gst)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewInvoiceDetails('${invoice.id}')">
                        <i class="material-symbols-rounded">visibility</i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        recentInvoicesSection.appendChild(table);
    }
});

// Function to view invoice details (modal popup)
function viewInvoiceDetails(invoiceId) {
    const salesData = getSalesData();
    const invoice = salesData.recentInvoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
        alert("Invoice not found!");
        return;
    }
    
    // Create modal content
    let modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Invoice Details: ${invoiceId}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(invoice.amount)}</p>
                <p><strong>GST Amount:</strong> ${formatCurrency(invoice.gst)}</p>
                
                <h6 class="mt-4">Products:</h6>
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>GST Rate</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add products
    invoice.products.forEach(product => {
        modalContent += `
            <tr>
                <td>${product.name}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.quantity}</td>
                <td>${product.gstRate}%</td>
            </tr>
        `;
    });
    
    modalContent += `
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    `;
    
    // Create modal element
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal fade";
    modalDiv.id = "invoiceModal";
    modalDiv.setAttribute("tabindex", "-1");
    modalDiv.setAttribute("aria-labelledby", "invoiceModalLabel");
    modalDiv.setAttribute("aria-hidden", "true");
    
    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog modal-lg";
    modalDialog.innerHTML = modalContent;
    
    modalDiv.appendChild(modalDialog);
    document.body.appendChild(modalDiv);
    
    // Initialize and show modal
    const modal = new bootstrap.Modal(modalDiv);
    modal.show();
    
    // Remove modal from DOM after hiding
    modalDiv.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalDiv);
    });
}