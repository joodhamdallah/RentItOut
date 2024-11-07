const ReturningItemsModel = require('../../models/ReturningItems');
const sendEmail = require('../../utils/sendEmail');

class EvaluationService {
    static async sendEvaluationEmail(rental_item_id) {
        // Retrieve the returning item details for the evaluation email
        const evaluationData = await ReturningItemsModel.getEvaluationData(rental_item_id);
        if (!evaluationData) {
            throw new Error('Returning item not found');
        }

        const { user_email, user_name, item_name, status_for_item, returned_amount } = evaluationData;

        // Prepare the email content
        const emailOptions = {
            email: user_email,
            subject: 'Rental Item Evaluation and Returned Amount',
            message: `Dear ${user_name},\n\nAfter evaluation by our insurance team, your rental item "${item_name}" has been marked as "${status_for_item}". Based on the evaluation, the amount returned to you is $${returned_amount}.\n\nThank you for using our service!`,
            html: `<p>Dear ${user_name},</p>
                   <p>After evaluation by our insurance team, your rental item "<strong>${item_name}</strong>" has been marked as "<strong>${status_for_item}</strong>". Based on the evaluation, the amount returned to you is <strong>$${returned_amount}</strong>.</p>
                   <p>Thank you for using our service!</p>`
        };

        // Send the email
        await sendEmail(emailOptions);
        return { success: true, message: 'Evaluation email sent successfully' };
    }
}

module.exports = EvaluationService;
