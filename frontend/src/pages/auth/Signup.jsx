import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
    register as registerUser,
    resendVerificationEmail,
} from "../../services/authService.js";
import { buttonStyles } from "../../components/ui/buttonStyles.js";

const fieldClass = "mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]";
const primaryButton = buttonStyles({ size: "form", className: "w-full" });

const Signup = () => {
    const { register, handleSubmit, getValues, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm({ mode: "onTouched" });
    const [submitError, setSubmitError] = useState("");
    const [verificationEmailSent, setVerificationEmailSent] = useState(true);
    const [resendStatus, setResendStatus] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setSubmitError("");
        setResendStatus("");
        try {
            const result = await registerUser(data);
            setVerificationEmailSent(Boolean(result.data?.verificationEmailSent));
        } catch (error) {
            setSubmitError(error.message || "Registration failed.");
            throw error;
        }
    };

    const handleResend = async (email) => {
        if (!email) {
            setResendStatus("Enter your email address above first.");
            return;
        }

        setIsResending(true);
        setResendStatus("");
        try {
            const result = await resendVerificationEmail(email);
            setResendStatus(result.message);
        } catch (error) {
            setResendStatus(error.message || "Unable to send a verification link.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFF6EB]/80 px-4 py-6 font-copy text-[#29201D] backdrop-blur-sm sm:px-6">
                <section role="dialog" aria-modal="true" aria-labelledby="signup-title" className="relative mx-auto my-auto max-h-[calc(100svh-3rem)] w-full max-w-lg overflow-y-auto rounded-[1.5rem] border border-[#29201D]/10 bg-[#FFFCF7] p-5 shadow-[0_24px_80px_rgba(41,32,29,0.24)] sm:p-8">
                    <Link to="/" aria-label="Close and return home" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#786A62] transition hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]"><X className="h-5 w-5" aria-hidden="true" /></Link>
                    {isSubmitSuccessful ? (
                        <div className="py-5 text-center sm:py-8">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE4D8] text-[#C94F46]"><MapPin className="h-6 w-6" aria-hidden="true" /></span>
                            <p className="mt-5 font-label text-xs font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">One quick pit stop</p>
                            <h1 id="signup-title" className="mb-0 mt-3 text-3xl font-black sm:text-4xl">{verificationEmailSent ? "Check your inbox!" : "Account created"}</h1>
                            <p className="mt-3 text-sm leading-6 text-[#786A62]">{verificationEmailSent ? "We sent you a verification link. Tap it to finish signing up and get your trip on the map." : "Your account is ready, but we couldn't send the verification email. Request a fresh link below."}</p>
                            {!verificationEmailSent && <button type="button" onClick={() => handleResend(getValues("email"))} disabled={isResending} className="mt-6 text-sm font-bold text-[#C94F46] underline-offset-4 hover:underline disabled:opacity-60">{isResending ? "Sending…" : "Resend verification email"}</button>}
                            {resendStatus && <p className="mt-3 text-sm text-[#786A62]" role="status">{resendStatus}</p>}
                            <Link to="/login" className={`${primaryButton} mt-7`}>Back to log in <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                        </div>
                    ) : (
                        <>
                            <div>
                                <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Come on in</p>
                                <h1 id="signup-title" className="mb-0 mt-3 text-3xl font-black leading-tight sm:text-4xl">Your next trip starts here.</h1>
                                <p className="mt-2 text-sm leading-6 text-[#786A62]">Make an account, then invite your travel crew.</p>
                            </div>
                            <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block text-sm font-bold text-[#51443E]">First name
                                        <input className={fieldClass} type="text" autoComplete="given-name" {...register("firstName", { required: "First name is required.", minLength: { value: 2, message: "First name must be at least 2 characters." }, maxLength: 80 })} />
                                        {errors.firstName && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.firstName.message}</span>}
                                    </label>
                                    <label className="block text-sm font-bold text-[#51443E]">Last name
                                        <input className={fieldClass} type="text" autoComplete="family-name" {...register("lastName", { required: "Last name is required.", minLength: { value: 2, message: "Last name must be at least 2 characters." }, maxLength: 80 })} />
                                        {errors.lastName && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.lastName.message}</span>}
                                    </label>
                                </div>
                                <label className="block text-sm font-bold text-[#51443E]">Email address
                                    <input className={fieldClass} type="email" autoComplete="email" {...register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." } })} />
                                    {errors.email && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.email.message}</span>}
                                </label>
                                <label className="block text-sm font-bold text-[#51443E]">Password
                                    <span className="relative mt-2 block">
                                        <input className={`${fieldClass} mt-0 pr-12`} type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Password must be at least 8 characters." }, pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, message: "Include an uppercase letter, lowercase letter, and a number." } })} />
                                        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 text-[#786A62] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                            {showPassword ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
                                        </button>
                                    </span>
                                    {errors.password && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.password.message}</span>}
                                    <span className="mt-1.5 block text-xs font-normal text-[#786A62]">At least 8 characters, with a number and mixed case.</span>
                                </label>
                                {submitError && <p className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]" role="alert">{submitError}</p>}
                                {submitError.toLowerCase().includes("email already exists") && <div className="-mt-2"><button type="button" onClick={() => handleResend(getValues("email"))} disabled={isResending} className="text-sm font-bold text-[#C94F46] underline-offset-4 hover:underline disabled:opacity-60">{isResending ? "Sending…" : "Resend verification email"}</button>{resendStatus && <p className="mt-2 text-xs text-[#786A62]" role="status">{resendStatus}</p>}</div>}
                                <button className={primaryButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Making your account…" : <>Create my account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}</button>
                            </form>
                            <p className="mt-5 text-center text-xs text-[#786A62]">No trip spreadsheet required. Promise.</p>
                        </>
                    )}
                </section>
        </main>
    );
};

export default Signup;
