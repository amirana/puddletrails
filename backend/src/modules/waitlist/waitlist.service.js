import Waitlist from "./waitlist.model.js";
import { sendWaitlistConfirmationEmail } from "../../common/config/email.js";

const join = async ({ email, source }) => {
    let entry;
    try {
        entry = await Waitlist.create({ email, source });
    } catch (error) {
        // The unique index handles simultaneous submissions safely.
        if (error.code === 11000) return { alreadyJoined: true, confirmationEmailSent: false };
        throw error;
    }

    let confirmationEmailSent = false;
    try {
        await sendWaitlistConfirmationEmail(entry.email);
        confirmationEmailSent = true;
    } catch (error) {
        console.error("Failed to send waitlist confirmation email:", error.message);
    }

    return { alreadyJoined: false, confirmationEmailSent };
};

export { join };
