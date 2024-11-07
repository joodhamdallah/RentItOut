const RentalDetailsModel = require('../../models/Rentaldetails');
const sendEmail = require('../../utils/sendEmail');
const moment = require('moment');

class ReminderService {
    static async sendReturnReminderEmails() {
        try {
            // Get rentals where return date is exactly one day from now
            const targetDate = moment().add(1, 'days').format('YYYY-MM-DD');
            const rentals = await RentalDetailsModel.getRentalsDueOn(targetDate);

            // Group rentals by user email
            const userRentals = rentals.reduce((acc, rental) => {
                const userKey = rental.user_email; // Group by user email
                if (!acc[userKey]) {
                    acc[userKey] = {
                        user_name: rental.user_name,
                        items: [],
                        email: rental.user_email,
                    };
                }
                acc[userKey].items.push({
                    item_name: rental.item_name,
                    price_per_day: rental.price_per_day,
                });
                return acc;
            }, {});

            // Send a single email per user with all items due tomorrow
            for (const userEmail in userRentals) {
                const { user_name, items } = userRentals[userEmail];

                // Prepare the list of items in the email message
                const itemList = items.map(item => `- ${item.item_name} ($${item.price_per_day} per day)`).join('\n');
                const itemListHtml = items.map(item => `<li><strong>${item.item_name} ($${item.price_per_day} per day)</strong></li>`).join('');

                // Prepare email options
                const emailOptions = {
                    email: userEmail,
                    subject: 'Reminder: Upcoming Rental Returns',
                    message: `Dear ${user_name},\n\nThis is a reminder that you have the following rental items due for return tomorrow, on ${targetDate}:\n\n${itemList}\n\nPlease ensure timely return to avoid any late fees.\n\nNote: Each day you're late, an overtime charge equal to each item's daily rental price will be applied.\n\nThank you!`,
                    html: `<p>Dear ${user_name},</p>
                           <p>This is a reminder that you have the following rental items due for return tomorrow, on <strong>${targetDate}</strong>:</p>
                           <ul>${itemListHtml}</ul>
                           <p>Please ensure timely return to avoid any late fees.</p>
                           <p><strong>Note:</strong> Each day you're late, an overtime charge equal to each item's daily rental price will be applied.</p>
                           <p>Thank you!</p>`
                };

                // Send the email
                await sendEmail(emailOptions);

                console.log(`Reminder email sent to ${userEmail} for items due on ${targetDate}`);
            }
        } catch (error) {
            console.error('Failed to send reminder emails:', error);
        }
    }
}

module.exports = ReminderService;
