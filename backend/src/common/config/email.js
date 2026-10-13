const sendEmail = async (to, subject, html) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) throw new Error("RESEND_FROM_EMAIL is not configured");

    const fromName = process.env.RESEND_FROM_NAME || "PuddleTrails";
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [to],
            subject,
            html,
        }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        const detail = result.message || result.name || `HTTP ${response.status}`;
        throw new Error(`Resend API rejected the email: ${detail}`);
    }

    return result;
};

const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail(
        email,
        "Verify your email",
        `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
    );
};

const sendResetPasswordEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail(
        email,
        "Reset your password",
        `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    );
};

const sendInvitationEmail = async (email, token, tripTitle, role) => {
    const url = `${process.env.CLIENT_URL}/invitations/${token}`;

    await sendEmail(
        email,
        "You've been invited to join a trip on Traverse",
        `<h2>You're invited!</h2>
        <p>You have been invited to join <strong>${tripTitle}</strong> on Traverse.</p>
        <p>Your role: <strong>${role}</strong></p>
        <p><a href="${url}">Accept Invitation</a></p>
        <p>This invitation expires in 7 days.</p>`,
    );
};

const sendWaitlistConfirmationEmail = async (email) => {
    await sendEmail(
        email,
        "You’re on the Traverse beta waitlist",
        `<h2>You’re on the list!</h2>
        <p>Thanks for joining the Traverse beta waitlist. We’re building a calmer place to plan trips together, and we’ll email you when beta invites are ready.</p>
        <p>This is a waitlist confirmation, not a beta invite. No need to reply.</p>`,
    );
};

const sendOrderConfirmationEmail = async (email, order) => {
    const items = order.items
        .map((i) => `<li>${i.title} x${i.quantity} — ₹${i.price}</li>`)
        .join("");

    await sendEmail(
        email,
        `Order Confirmed — ${order.orderNumber}`,
        `<h2>Order Confirmed!</h2>
    <p>Order: ${order.orderNumber}</p>
    <ul>${items}</ul>
    <p><strong>Total: ₹${order.totalAmount}</strong></p>`,
    );
};

export {
    sendVerificationEmail,
    sendResetPasswordEmail,
    sendInvitationEmail,
    sendWaitlistConfirmationEmail,
    sendOrderConfirmationEmail,
};
