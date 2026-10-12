import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { register as registerUser } from "../../services/AuthService.js";

const fieldClass = "mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]";
const primaryButton = "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9573F] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#CF4639] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#29201D] disabled:cursor-not-allowed disabled:opacity-60";

const Signup = () => {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm({ mode: "onTouched" });
    const [submitError, setSubmitError] = useState("");

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            await registerUser(data);
        } catch (error) {
            setSubmitError(error.message || "Registration failed.");
            throw error;
        }
    };

    return (
        <main className="min-h-screen bg-[#FFFCF7] px-4 py-5 font-copy text-[#29201D] sm:px-8 sm:py-7">
            <header className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#29201D]/10 bg-white/90 px-4 py-3 shadow-[0_4px_18px_rgba(41,32,29,0.05)] sm:px-6">
                <Link to="/" className="group inline-flex items-center gap-2.5 rounded-sm text-lg font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9573F] sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE4D8] text-[#C94F46] transition-transform duration-200 group-hover:-rotate-12"><Compass className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                    PuddleTrails<span className="text-[#E9573F]">.</span>
                </Link>
                <p className="text-xs text-[#786A62] sm:text-sm">Already have an account? <Link to="/login" className="ml-1 font-bold text-[#C94F46] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">Log in</Link></p>
            </header>

            <section className="mx-auto w-full max-w-xl px-2 pb-12 pt-8 sm:px-6 sm:pt-12">
                <div className="mx-auto w-full rounded-[1.5rem] border border-[#29201D]/10 bg-white p-5 shadow-[0_12px_36px_rgba(60,40,30,0.08)] sm:p-8">
                    {isSubmitSuccessful ? (
                        <div className="py-5 text-center sm:py-8">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE4D8] text-[#C94F46]"><MapPin className="h-6 w-6" aria-hidden="true" /></span>
                            <p className="mt-5 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">One quick pit stop</p>
                            <h1 className="mb-0 mt-3 text-3xl font-black tracking-[-0.04em]">Check your inbox!</h1>
                            <p className="mt-3 text-sm leading-6 text-[#786A62]">We sent you a verification link. Tap it to finish signing up and get your trip on the map.</p>
                            <Link to="/login" className={`${primaryButton} mt-7`}>Back to log in <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                        </div>
                    ) : (
                        <>
                            <div>
                                <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Come on in</p>
                                <h2 className="mb-0 mt-3 text-3xl font-black leading-tight tracking-[-0.04em]">Your next trip starts here.</h2>
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
                                    <input className={fieldClass} type="password" autoComplete="new-password" {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Password must be at least 8 characters." }, pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, message: "Include an uppercase letter, lowercase letter, and a number." } })} />
                                    {errors.password && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.password.message}</span>}
                                    <span className="mt-1.5 block text-xs font-normal text-[#786A62]">At least 8 characters, with a number and mixed case.</span>
                                </label>
                                {submitError && <p className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]" role="alert">{submitError}</p>}
                                <button className={primaryButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Making your account…" : <>Create my account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}</button>
                            </form>
                            <p className="mt-5 text-center text-xs text-[#786A62]">No trip spreadsheet required. Promise.</p>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Signup;
