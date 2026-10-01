import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { joinWaitlist } from "../../services/WaitlistService.js";

const WaitlistForm = ({ buttonLabel = "Join the beta waitlist" }) => {
    const inputId = useId();
    const messageId = useId();
    const [submitted, setSubmitted] = useState(false);
    const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched", defaultValues: { email: "" } });

    const onSubmit = async ({ email }) => {
        setServerError("");
        try {
            const result = await joinWaitlist(email.trim());
            setConfirmationEmailSent(Boolean(result.data?.confirmationEmailSent));
            setSubmitted(true);
            reset();
        } catch (submitError) {
            setServerError(submitError.message);
        }
    };

    return (
        <div>
            {submitted ? (
                <div className="flex items-start gap-3 rounded-2xl border border-[#DDD6EF] bg-[#F1EDFA] p-4" role="status">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6757A8]" />
                    <div>
                        <p className="text-sm font-semibold text-[#242238]">You’re on the list.</p>
                        <p className="mt-1 text-xs leading-5 text-[#6C6878]">
                            {confirmationEmailSent
                                ? "A confirmation is on its way. We’ll email you again when beta invites open."
                                : "You’re saved on the list. We’ll email you when beta invites open; if this was your first sign-up, check your spam folder for a confirmation."}
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-[#302D45]">
                        Your email, please
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id={inputId}
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            placeholder="you@example.com"
                            {...register("email", {
                                required: "Enter your email address.",
                                maxLength: { value: 322, message: "Email must be 322 characters or fewer." },
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
                                onChange: () => setServerError(""),
                            })}
                            aria-invalid={Boolean(errors.email || serverError)}
                            aria-describedby={errors.email || serverError ? messageId : undefined}
                            className="min-w-0 flex-1 rounded-xl border border-[#D8D3E0] bg-white px-4 py-3.5 text-base text-[#242238] outline-none transition placeholder:text-[#A19CAA] focus:border-[#6757A8] focus:ring-4 focus:ring-[#6757A8]/10"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C5664B] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#AC543B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5664B] disabled:cursor-wait disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <><LoaderCircle className="h-4 w-4 animate-spin" /> Adding you…</>
                            ) : (
                                <>{buttonLabel}<ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                    {(errors.email?.message || serverError) && <p id={messageId} className="mt-2 text-sm text-red-700" role="alert">{errors.email?.message || serverError}</p>}
                </form>
            )}
        </div>
    );
};

export default WaitlistForm;
