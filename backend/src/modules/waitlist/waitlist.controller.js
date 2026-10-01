import WaitlistEntry from "./waitlist.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import { sendWaitlistConfirmationEmail } from "../../common/config/email.js";

const joinWaitlist = async (req, res) => {
    let isNewSignup = false;
    try {
        await WaitlistEntry.create({ email: req.body.email });
        isNewSignup = true;
    } catch (error) {
        // A duplicate email is already successfully on the list. Returning
        // the same response keeps retries friendly and avoids exposing list data.
        if (error.code !== 11000) throw error;
    }

    let confirmationEmailSent = false;
    if (isNewSignup) {
        // Persist the signup even if SMTP is unavailable; the API should not
        // lose a waitlist entry because a confirmation email could not send.
        try {
            await sendWaitlistConfirmationEmail(req.body.email);
            confirmationEmailSent = true;
        } catch (error) {
            console.error("Failed to send waitlist confirmation email:", error.message);
        }
    }

    ApiResponse.created(res, "You’re on the Traverse beta waitlist.", { confirmationEmailSent });
};

export { joinWaitlist };
