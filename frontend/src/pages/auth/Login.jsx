import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";

const fieldClass = "mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]";
const primaryButton = "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9573F] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#CF4639] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#29201D] disabled:cursor-not-allowed disabled:opacity-60";

const Login = () => {
    const [submitError, setSubmitError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onTouched" });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            await login(data);
            const redirect = searchParams.get("redirect");
            redirect ? navigate(redirect) : navigate("/dashboard");
        } catch (error) {
            setSubmitError(error.message || "Unable to log in.");
        }
    };

    return (
        <main className="min-h-screen bg-[#FFFCF7] px-4 py-5 font-copy text-[#29201D] sm:px-8 sm:py-7">
            <header className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#29201D]/10 bg-white/90 px-4 py-3 shadow-[0_4px_18px_rgba(41,32,29,0.05)] sm:px-6">
                <Link to="/" className="group inline-flex items-center gap-2.5 rounded-sm text-lg font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9573F] sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE4D8] text-[#C94F46] transition-transform duration-200 group-hover:-rotate-12"><Compass className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                    PuddleTrails<span className="text-[#E9573F]">.</span>
                </Link>
                <p className="text-xs text-[#786A62] sm:text-sm">New around here? <Link to="/signup" className="ml-1 font-bold text-[#C94F46] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">Sign up</Link></p>
            </header>

            <section className="mx-auto grid max-w-5xl items-center gap-10 px-2 pb-12 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_0.88fr] lg:gap-16">
                <div className="hidden lg:block">
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#E9D9CA] bg-[#FFF2E8] px-4 py-2 font-label text-xs font-bold uppercase tracking-wider text-[#9B4A3E]"><MapPin className="h-4 w-4" aria-hidden="true" /> Your next trip is still on the map</p>
                    <h1 className="mb-0 mt-6 max-w-lg text-5xl font-black leading-[1.02] tracking-[-0.055em]">Good to have you <span className="text-[#D95140]">back.</span></h1>
                    <p className="mt-5 max-w-md text-base leading-7 text-[#65554D]">Your crew, your plans, and that little place you saved for later are right where you left them.</p>
                    <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#FFF0DF] p-4 text-sm font-semibold text-[#51443E]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD34E] text-[#29201D]"><Compass className="h-5 w-5" aria-hidden="true" /></span>Pick up where the daydream left off.</div>
                </div>

                <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-[#29201D]/10 bg-white p-6 shadow-[0_12px_36px_rgba(60,40,30,0.08)] sm:p-9">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Welcome back, traveler</p>
                        <h2 className="mb-0 mt-3 text-3xl font-black leading-tight tracking-[-0.04em]">Let’s get you back in.</h2>
                        <p className="mt-2 text-sm leading-6 text-[#786A62]">Log in and keep the good plans rolling.</p>
                    </div>

                    <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <label className="block text-sm font-bold text-[#51443E]">Email address
                            <input className={fieldClass} type="email" autoComplete="email" {...register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." } })} />
                            {errors.email && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.email.message}</span>}
                        </label>
                        <label className="block text-sm font-bold text-[#51443E]">Password
                            <input className={fieldClass} type="password" autoComplete="current-password" {...register("password", { required: "Password is required." })} />
                            {errors.password && <span className="mt-1.5 block text-xs font-normal text-[#B42318]">{errors.password.message}</span>}
                        </label>
                        <div className="-mt-2 text-right"><Link to="/forgot-password" className="text-sm font-bold text-[#C94F46] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">Forgot password?</Link></div>
                        {submitError && <p className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]" role="alert">{submitError}</p>}
                        <button className={primaryButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in…" : <>Log in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}</button>
                    </form>
                    <p className="mt-6 text-center text-xs text-[#786A62]">A little planning. A lot more “we’re going.”</p>
                </div>
            </section>
        </main>
    );
};

export default Login;
