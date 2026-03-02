package com.medBlink.medBlinkAPI.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.medBlink.medBlinkAPI.entities.BatchEntity;
import com.medBlink.medBlinkAPI.entities.OrderEntity;
import com.medBlink.medBlinkAPI.entities.ProductEntity;
import com.medBlink.medBlinkAPI.entities.UserEntity;
import com.medBlink.medBlinkAPI.repositories.BatchRepository;
import com.medBlink.medBlinkAPI.repositories.OrderRepository;
import com.medBlink.medBlinkAPI.repositories.ProductRepository;
import com.medBlink.medBlinkAPI.repositories.UserRepository;
import com.medBlink.medBlinkAPI.utils.NumberToWordsConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.util.stream.Stream;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BatchRepository batchRepository;

    public byte[] generateInvoice(String orderID) {
        OrderEntity order = orderRepository.findById(orderID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        UserEntity existingUser = userRepository.findById(order.getUserID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to Update Profile☹️, User not exists!"));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            Paragraph title = new Paragraph("TAX INVOICE", new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("MedBlink Pvt. Ltd.", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
            document.add(new Paragraph("Address: SBK Luxus, Vidya Nagar 1st lane, Guntur, Andhra Pradesh, India (522007)"));
            document.add(new Paragraph("Email: medblink.official@gmail.com"));
            document.add(new Paragraph("Ph.No: +91 9246744448"));
            document.add(new Paragraph("GSTIN: 27ABCDE1234F1Z5"));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Customer Details:", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
            document.add(new Paragraph("Name: " + existingUser.getName()));
            document.add(new Paragraph("Address: " + order.getUserAddress()));
            document.add(new Paragraph("Email: " + order.getEmail()));
            document.add(new Paragraph("Phone: +91 " + order.getPhoneNumber()));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(10);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{14, 10, 6, 8, 10, 8, 6, 10, 6, 10});

            Stream.of("Manufacturer", "HSN", "Pack", "Batch", "Expiry", "MRP", "Qty", "Sell Price", "GST %", "Amount")
                    .forEach(col -> {
                        PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD)));
                        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        table.addCell(cell);
                    });

            for (var item : order.getOrderedItems()) {
                ProductEntity product = productRepository.findById(item.getProductID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product Not Found"));
                BatchEntity batch = batchRepository.findById(item.getBatchID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch Not Found"));
                table.addCell(product.getProductManufacturer());
                table.addCell(batch.getHsnCode());
                table.addCell(batch.getPack());
                table.addCell(batch.getBatchNumber());
                table.addCell(batch.getExpiryDate());
                table.addCell(String.valueOf(batch.getMarketPrice()));
                table.addCell(String.valueOf(item.getProductQuantity()));
                table.addCell(String.valueOf(batch.getSellingPrice()));
                table.addCell(String.valueOf(batch.getGst()));
                table.addCell(String.valueOf(batch.getSellingPrice()));
            }
            document.add(table);
            document.add(new Paragraph(" "));

            Paragraph subtotal = new Paragraph("Subtotal: ₹ " + String.format("%.2f", order.getSubTotalAmount()));
            subtotal.setAlignment(Element.ALIGN_RIGHT);
            document.add(subtotal);

            Paragraph tax = new Paragraph("Tax Amount: ₹ " + String.format("%.2f", order.getTaxAmount()));
            tax.setAlignment(Element.ALIGN_RIGHT);
            document.add(tax);

            Paragraph shipping = new Paragraph("Shipping: ₹ " + String.format("%.2f", order.getShippingPrice()));
            shipping.setAlignment(Element.ALIGN_RIGHT);
            document.add(shipping);

            Paragraph roundOff = new Paragraph("Round Off: ₹ " + String.format("%.2f", order.getRoundOffAmount()));
            roundOff.setAlignment(Element.ALIGN_RIGHT);
            document.add(roundOff);

            Paragraph total = new Paragraph("Total: ₹ " + String.format("%.2f", order.getGrandTotalAmount()),
                    new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD));
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            Paragraph inWords = new Paragraph("( " + convertNumberToWords(order.getGrandTotalAmount()) + " only )");
            inWords.setAlignment(Element.ALIGN_RIGHT);
            document.add(inWords);

            document.add(new Paragraph(" "));

            Paragraph thankYou = new Paragraph("Thank you for Ordering on MedBlink️",
                    new Font(Font.FontFamily.HELVETICA, 12, Font.ITALIC));
            thankYou.setAlignment(Element.ALIGN_CENTER);
            document.add(thankYou);

            document.close();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error generating invoice: " + e.getMessage());
        }
        return baos.toByteArray();
    }

    private String convertNumberToWords(double amount) {
        long rupees = (long) amount;
        return NumberToWordsConverter.convert(rupees);
    }
}
