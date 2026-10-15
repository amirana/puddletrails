import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import { buttonStyles } from "../../components/ui/buttonStyles.js";
import { resendVerificationEmail } from "../../services/authService.js";

const fieldClass = "auth-input [color-scheme:light] mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]";
const primaryButton = buttonStyles({ size: "form", className: "w-full" });

const Login = () => {
    const [submitError, setSubmitError] = useState("");
    const [resendStatus, setResendStatus] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({ mode: "onTouched" });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const onSubmit = async (data) => {
        setSubmitError("");
        setResendStatus("");
        try {
            await login(data);
            const redirect = searchParams.get("redirect");
            redirect ? navigate(redirect) : navigate("/dashboard");
        } catch (error) {
            setSubmitError(error.message || "Unable to log in.");
        }
    };

    const handleResend = async () => {
        const email = getValues("email");
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
        <main className="flex min-h-screen min-h-[100svh] items-start justify-center overflow-y-auto bg-[#FFF6EB]/80 px-4 py-5 font-copy text-[#29201D] backdrop-blur-sm sm:items-center sm:px-6 sm:py-8">
                <section role="dialog" aria-modal="true" aria-labelledby="login-title" className="relative mx-auto my-auto w-full max-w-md rounded-[1.5rem] border border-[#E9D9CA] bg-[#FFFCF7] p-6 shadow-[0_24px_80px_rgba(41,32,29,0.18)] sm:p-9">
                    <Link to="/" aria-label="Close and return home" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#786A62] transition hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]"><X className="h-5 w-5" aria-hidden="true" /></Link>
                    <div>
                        <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Back to the getaway</p>
                        <h1 id="login-title" className="mb-0 mt-3 text-3xl font-black leading-tight sm:text-4xl">Your trip is waiting.</h1>
                        <p className="mt-2 text-sm leading-6 text-[#786A62]">Log in to see what your crew has planned.</p>
                    </div>

                    <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <label className="block text-sm font-bold text-[#51443E]">Email address
                            <input className={fieldClass} type="email" autoComplete="email" {...register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." } })} />
                            {errors.email && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.email.message}</span>}
                        </label>
                        <label className="block text-sm font-bold text-[#51443E]">Password
                            <span className="relative mt-2 block">
                                <input className={`${fieldClass} mt-0 pr-12`} type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password", { required: "Password is required." })} />
                                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 text-[#786A62] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                    {showPassword ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
                                </button>
                            </span>
                            {errors.password && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.password.message}</span>}
                        </label>
                        <div className="-mt-2 text-right"><Link to="/forgot-password" className="text-sm font-bold text-[#C94F46] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">Forgot password?</Link></div>
                        {submitError && <p className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]" role="alert">{submitError}</p>}
                        {submitError.toLowerCase().includes("verify your email") && <div className="-mt-3"><button type="button" onClick={handleResend} disabled={isResending} className="text-sm font-bold text-[#C94F46] underline-offset-4 hover:underline disabled:opacity-60">{isResending ? "Sending…" : "Resend verification email"}</button>{resendStatus && <p className="mt-2 text-xs text-[#786A62]" role="status">{resendStatus}</p>}</div>}
                        <button className={primaryButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in…" : <>Log in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}</button>
                    </form>
                    <p className="mt-6 text-center text-xs text-[#786A62]">New to PuddleTrails? <Link to="/signup" className="font-bold text-[#C94F46] underline-offset-4 hover:underline">Sign up</Link></p>
                </section>
        </main>
    );
};

export default Login;
