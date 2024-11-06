const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../utils/sendEmail');

async function generateInvoicePDF(user, rentalId, logistic_type, bill, cartItems, discountDetails, payment_method) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Logo setup
    const logoPath = path.resolve(__dirname, '../images/logo.png');
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    // Rental details
    const rentalDetails = cartItems.map((item, index) => `
        <tr>
            <td>${item.item_id}</td>
            <td>${item.item_name}</td>
            <td>$${item.price_per_day}</td>
            <td>$${item.deposit}</td>
            <td>${item.quantity}</td>
            <td>${item.rental_date}</td>
            <td>${item.return_date}</td>
            <td>$${item.subtotal}</td>
        </tr>
    `).join('');

    // Discount info
    const discountInfo = discountDetails
        ? `<p><strong>Discount Applied:</strong> ${discountDetails.discount_percentage}% (${discountDetails.discount_name})</p>`
        : `<p>Discount Applied: None</p>`;

    // HTML content with `payment_method`
    const htmlContent = `
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd;">
                <div style="text-align: center;">
                    <img src="${logoDataUri}" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
                </div>
                <h2 style="text-align: center; color: #4CAF50;">Thank you for your rental with RentItOut for Quick Rentals!</h2>
                <p>Dear ${user.first_name},</p>
                <p>Thank you for completing your rental order with us. Below are the details of your rental:</p>

                <h3>Rental Information</h3>
                <p><strong>Rental ID:</strong> ${rentalId}</p>
                <p><strong>Logistic Type:</strong> ${logistic_type}</p>
                <p><strong>Payment Method:</strong> ${payment_method}</p>
                
                <h3>Items</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px;">Item ID</th>
                            <th style="padding: 8px;">Name</th>
                            <th style="padding: 8px;">Price/Day</th>
                            <th style="padding: 8px;">Deposit</th>
                            <th style="padding: 8px;">Quantity</th>
                            <th style="padding: 8px;">Rental Date</th>
                            <th style="padding: 8px;">Return Date</th>
                            <th style="padding: 8px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rentalDetails}
                    </tbody>
                </table>

                <h3>Billing Information</h3>
                <p><strong>Price Before Discount:</strong> $${bill.price_before_discount}</p>
                ${discountInfo}
                <p><strong>Price After Discount:</strong> $${bill.price_after_discount}</p>
                <p><strong>Shipping Cost:</strong> $${bill.shipping_cost}</p>
                <p><strong>Total Price to Pay:</strong> $${bill.total_price_to_pay}</p>
                <p><strong>Bill Date:</strong> ${bill.bill_date}</p>

                <p style="text-align: center;">We hope you enjoy your rental experience!</p>
                <p style="text-align: center; color: #4CAF50;"><strong>RentItOut for Quick Rentals</strong></p>
            </div>
        </body>
        </html>
    `;

    await page.setContent(htmlContent);

    // Generate PDF as a buffer
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdfBuffer;
}

async function sendInvoiceEmail(user, rentalId, logistic_type, bill, cartItems, discountDetails, payment_method) {
    const pdfBuffer = await generateInvoicePDF(user, rentalId, logistic_type, bill, cartItems, discountDetails, payment_method);

    const emailOptions = {
        email: user.email,
        subject: `Rental Confirmation - Rental ID ${rentalId}`,
        message: `Please find your invoice attached for Rental ID ${rentalId}.`,
        attachments: [
            {
                filename: `invoice-${rentalId}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    // Send the email with the invoice PDF attachment
    await sendEmail(emailOptions);
    console.log(`Invoice sent to ${user.email}`);
}

module.exports = sendInvoiceEmail;
