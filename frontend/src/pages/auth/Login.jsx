import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";

const Login = () => {
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

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
        <main className="min-h-screen bg-[#f6f8f7] px-6 py-8 sm:py-10">
            <header className="mx-auto flex max-w-6xl items-center justify-between">
                <Link
                    to="/"
                    className="text-xl font-bold tracking-[-0.05em] text-slate-950"
                >
                    Traverse
                </Link>
                <p className="text-sm text-slate-500">
                    New here?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
                    >
                        Sign up
                    </Link>
                </p>
            </header>
            <div className="mx-auto mt-20 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:mt-24 sm:p-9">
                <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
                        WELCOME BACK
                    </p>
                    <h1 className="mb-0 mt-3 !text-2xl font-semibold leading-tight tracking-[-0.035em] !text-slate-950">
                        Continue planning together.
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Log in to pick up where your travel plans left off.
                    </p>
                </div>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <label className="block text-sm font-semibold text-slate-800">
                        Email address
                        <input
                            className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                            type="email"
                            autoComplete="email"
                            {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email.",
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="mt-1.5 block text-xs font-normal text-red-600">
                                {errors.email.message}
                            </span>
                        )}
                    </label>

                    <label className="block text-sm font-semibold text-slate-800">
                        Password
                        <input
                            className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                            type="password"
                            autoComplete="current-password"
                            {...register("password", {
                                required: "Password is required.",
                            })}
                        />
                        {errors.password && (
                            <span className="mt-1.5 block text-xs font-normal text-red-600">
                                {errors.password.message}
                            </span>
                        )}
                    </label>

                    <div className="-mt-2 text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {submitError && (
                        <p
                            className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700"
                            role="alert"
                        >
                            {submitError}
                        </p>
                    )}

                    <button
                        className="w-full rounded-lg bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;
