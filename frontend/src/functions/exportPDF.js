import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleExportPDF = (data, title) => {
    const doc = new jsPDF();
    const tableColumn = ["#", "Name", "Symbol", "Price", "24h Change", "Market Cap"];
    const tableRows = [];

    data.forEach((item, index) => {
        const rowData = [
            index + 1,
            item.name,
            item.symbol.toUpperCase(),
            `$${item.current_price?.toLocaleString() || item.price?.toLocaleString()}`,
            `${item.price_change_percentage_24h?.toFixed(2) || "0.00"}%`,
            `$${item.market_cap?.toLocaleString() || "N/A"}`
        ];
        tableRows.push(rowData);
    });

    // Branding
    doc.setFontSize(20);
    doc.setTextColor(58, 128, 233); // Coinpulse Blue
    doc.text("Coinpulse", 14, 15);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`${title} - Generated on ${new Date().toLocaleString()}`, 14, 22);

    // Table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "striped",
        headStyles: { fillColor: [58, 128, 233] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Coinpulse_${title.replace(/\s+/g, "_")}_Report.pdf`);
};
