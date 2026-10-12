import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { joinWaitlist } from "../../services/WaitlistService.js";

const WaitlistForm = ({ buttonLabel = "Join waitlist" }) => {
    const emailId = useId();
    const emailErrorId = `${emailId}-error`;
    const [searchParams] = useSearchParams();
    const source = searchParams.get("ref") || "landing_page";
    const [serverMessage, setServerMessage] = useState("");
    const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
    const [alreadyJoined, setAlreadyJoined] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const onSubmit = async (data) => {
        setServerMessage("");
        try {
            const result = await joinWaitlist(data.email.trim(), source);
            setServerMessage(result.message);
            setConfirmationEmailSent(Boolean(result.data?.confirmationEmailSent));
            setAlreadyJoined(Boolean(result.data?.alreadyJoined));
            setSubmitted(true);
        } catch (error) {
            setServerMessage(error.message);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-2xl border border-[#E9D9CA] bg-[#FFF2E8] p-4 text-left text-sm font-bold text-[#29201D]" role="status">
                <p>{serverMessage}</p>
                <p className="mt-1 text-xs leading-5 text-[#65554D]">
                    {confirmationEmailSent
                        ? "A confirmation is on its way. We’ll email you when beta invites open."
                        : alreadyJoined
                            ? "You’re already on the list. We’ll email you when beta invites open."
                            : "Your sign-up is saved, but we couldn’t send the confirmation email just now. We’ll email you when beta invites open."}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-start" noValidate>
            <div className="flex-1">
                <label className="sr-only" htmlFor={emailId}>Email address</label>
                <input
                    id={emailId}
                    type="email"
                    placeholder="you@example.com"
                    className={`min-h-12 w-full rounded-full border bg-white px-5 py-3 text-sm text-[#29201D] outline-none transition placeholder:text-[#94877E] focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/20 ${
                        errors.email ? "border-[#C94F46]" : "border-[#E0D7CD]"
                    }`}
                    {...register("email", {
                        required: "Email is required.",
                        maxLength: { value: 322, message: "Email must be 322 characters or fewer." },
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." },
                    })}
                    aria-invalid={Boolean(errors.email || serverMessage)}
                    aria-describedby={errors.email ? emailErrorId : undefined}
                />
                {errors.email && <span id={emailErrorId} className="mt-1 block text-xs font-semibold text-[#A43D35]">{errors.email.message}</span>}
                {serverMessage && <p className="mt-1 text-xs font-semibold text-[#A43D35]" role="alert">{serverMessage}</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#E9573F] px-6 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#CF4639] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#29201D] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Joining…" : buttonLabel}
            </button>
        </form>
    );
};

export default WaitlistForm;
