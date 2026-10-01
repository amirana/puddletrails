import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { joinWaitlist } from "../../services/WaitlistService.js";

const WaitlistForm = ({ buttonLabel = "Join waitlist" }) => {
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
            <div className="text-sm font-medium text-[#172033]" role="status">
                <p>{serverMessage}</p>
                <p className="mt-1 text-xs font-normal leading-5 text-[#6C6878]">
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 sm:flex-row sm:items-start" noValidate>
            <div className="flex-1">
                <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full rounded-full border px-4 py-2.5 text-sm text-[#172033] outline-none transition-colors focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                        errors.email ? "border-red-400" : "border-black/10"
                    }`}
                    {...register("email", {
                        required: "Email is required.",
                        maxLength: { value: 322, message: "Email must be 322 characters or fewer." },
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." },
                    })}
                    aria-invalid={Boolean(errors.email || serverMessage)}
                />
                {errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>}
                {serverMessage && <p className="mt-1 text-xs text-red-600" role="alert">{serverMessage}</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#3B82F6] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Joining…" : buttonLabel}
            </button>
        </form>
    );
};

export default WaitlistForm;
