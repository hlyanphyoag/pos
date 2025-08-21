import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const useExcelExport = () => {
  const exportSalesToExcel = useCallback((salesData : any, filename = 'sales-report') => {
    if (!salesData || salesData.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for Excel export
    const excelData : any[] = [];
    
    salesData?.forEach((sale : any) => {
      // Main sale row
      const mainRow = {
        'Sale ID': `#${sale.id.slice(-8)}`,
        'Date & Time': format(new Date(sale.createdAt), 'dd MMM yyyy, h:mma'),
        'Cashier': sale?.cashier?.name,
        'Cashier Email': sale?.cashier?.email,
        'Total Amount': `${sale?.total} MMK`,
        'Payment Method': sale?.paymentType?.type,
        'Status': sale?.paid ? 'Paid' : 'Unpaid',
        'Total Items': sale?.items?.length,
        'Item Details': '',
        'Product Name': '',
        'Quantity': '',
        'Unit Price': '',
        'Subtotal': ''
      };
      
      // If there are items, add the first item details to the main row
      if (sale?.items?.length > 0) {
        const firstItem = sale?.items?.[0];
        mainRow['Product Name'] = firstItem?.product?.name;
        mainRow['Quantity'] = firstItem?.quantity;
        mainRow['Unit Price'] = `${firstItem?.product?.price} MMK`;
        mainRow['Subtotal'] = `${firstItem?.quantity * firstItem?.product?.price} MMK`;
        mainRow['Item Details'] = `1 of ${sale?.items?.length} items`;
      }
      
      excelData.push(mainRow);
      
      // Add remaining items as separate rows (if more than 1 item)
      if (sale?.items?.length > 1) {
        sale?.items?.slice(1).forEach((item : any, index : any) => {
          excelData.push({
            'Sale ID': '', // Empty for sub-rows
            'Date & Time': '',
            'Cashier': '',
            'Cashier Email': '',
            'Total Amount': '',
            'Payment Method': '',
            'Status': '',
            'Total Items': '',
            'Item Details': `${index + 2} of ${sale.items.length} items`,
            'Product Name': item?.product?.name,
            'Quantity': item?.quantity,
            'Unit Price': `${item?.product?.price} MMK`,
            'Subtotal': `${item?.quantity * item?.product?.price} MMK`
          });
        });
      }
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Sale ID
      { wch: 20 }, // Date & Time
      { wch: 15 }, // Cashier
      { wch: 25 }, // Cashier Email
      { wch: 15 }, // Total Amount
      { wch: 12 }, // Payment Method
      { wch: 10 }, // Status
      { wch: 12 }, // Total Items
      { wch: 15 }, // Item Details
      { wch: 25 }, // Product Name
      { wch: 10 }, // Quantity
      { wch: 15 }, // Unit Price
      { wch: 15 }  // Subtotal
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    // Generate filename with current date
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const finalFilename = `${filename}_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, finalFilename);
    
    return true;
  }, []);

  const exportSalesSummaryToExcel = useCallback((salesData : any, dashboardStats : any, filename = 'sales-summary') => {
    if (!salesData || salesData.length === 0) {
      alert('No data to export');
      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      { Metric: "Today's Revenue", Value: `${dashboardStats?.todayRevenue || 0} MMK` },
      { Metric: 'Total Transactions', Value: dashboardStats?.totalTransactions || 0 },
      { Metric: 'Average Order Value', Value: `${dashboardStats?.avgOrderValue || 0} MMK` },
      { Metric: 'Export Date', Value: format(new Date(), 'dd MMM yyyy, h:mma') },
      { Metric: 'Total Records Exported', Value: salesData.length }
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Detailed sales sheet
    const detailedData = salesData.map((sale : any) => ({
      'Sale ID': `#${sale.id.slice(-8)}`,
      'Full Sale ID': sale.id,
      'Date': format(new Date(sale.createdAt), 'dd MMM yyyy'),
      'Time': format(new Date(sale.createdAt), 'h:mma'),
      'Cashier Name': sale?.cashier?.name,
      'Cashier Email': sale?.cashier?.email,
      'Total Amount (MMK)': sale?.total,
      'Payment Method': sale?.paymentType?.type,
      'Payment Status': sale?.paid ? 'Paid' : 'Unpaid',
      'Items Count': sale?.items?.length,
      'Items List': sale?.items?.map((item : any) => 
        `${item?.product?.name} (x${item?.quantity})`
      ).join(', ')
    }));

    const detailedWs = XLSX.utils.json_to_sheet(detailedData);
    detailedWs['!cols'] = [
      { wch: 12 }, { wch: 36 }, { wch: 15 }, { wch: 10 },
      { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 40 }
    ];
    XLSX.utils.book_append_sheet(wb, detailedWs, 'Detailed Sales');

    // Items breakdown sheet
    const itemsData : any[] = [];
    salesData.forEach((sale : any) => {
      sale.items.forEach((item : any) => {
        itemsData.push({
          'Sale ID': `#${sale.id.slice(-8)}`,
          'Sale Date': format(new Date(sale.createdAt), 'dd MMM yyyy, h:mma'),
          'Cashier': sale?.cashier?.name,
          'Product Name': item?.product?.name,
          'Product SKU': item?.product?.sku,
          'Quantity Sold': item?.quantity,
          'Unit Price (MMK)': item?.product?.price,
          'Line Total (MMK)': item?.quantity * item?.product?.price,
          'Payment Method': sale.paymentType.type
        });
      });
    });

    const itemsWs = XLSX.utils.json_to_sheet(itemsData);
    itemsWs['!cols'] = [
      { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 12 }
    ];
    XLSX.utils.book_append_sheet(wb, itemsWs, 'Items Breakdown');

    // Generate filename with current date
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const finalFilename = `${filename}_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, finalFilename);
    
    return true;
  }, []);

  return {
    exportSalesToExcel,
    exportSalesSummaryToExcel
  };
};