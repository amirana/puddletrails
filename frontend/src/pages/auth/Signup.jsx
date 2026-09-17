// pages/auth/Signup.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { register as registerUser } from "../../services/AuthService.js";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const [submitError, setSubmitError] = useState("");

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            await registerUser(data);
        } catch (error) {
            setSubmitError(error.message || "Registration failed.");
            throw error; // keeps isSubmitSuccessful accurate on failure
        }
    };

    if (isSubmitSuccessful) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-6 py-10">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.1)] sm:p-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight text-slate-950"
                    >
                        Traverse
                    </Link>
                    <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
                        Check your email
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-slate-500">
                        We&rsquo;ve sent a verification link to your inbox.
                        Verify your email before logging in.
                    </p>
                    <Link
                        to="/login"
                        className="mt-8 inline-flex rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                        Back to log in
                    </Link>
                </div>
            </div>
        );
    }

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
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
                    >
                        Log in
                    </Link>
                </p>
            </header>
            <div className="mx-auto mt-16 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:mt-20 sm:p-9">
                <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
                        START PLANNING
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.035em] text-slate-950">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Bring your travel group and every trip detail together.
                    </p>
                </div>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            First name
                            <input
                                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                                type="text"
                                autoComplete="given-name"
                                {...register("firstName", {
                                    required: "First name is required.",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "First name must be at least 2 characters.",
                                    },
                                    maxLength: 80,
                                })}
                            />
                            {errors.firstName && (
                                <span className="mt-1.5 block text-xs font-normal text-red-600">
                                    {errors.firstName.message}
                                </span>
                            )}
                        </label>
                        <label className="block text-sm font-semibold text-slate-800">
                            Last name
                            <input
                                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                                type="text"
                                autoComplete="family-name"
                                {...register("lastName", {
                                    required: "Last name is required.",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "Last name must be at least 2 characters.",
                                    },
                                    maxLength: 80,
                                })}
                            />
                            {errors.lastName && (
                                <span className="mt-1.5 block text-xs font-normal text-red-600">
                                    {errors.lastName.message}
                                </span>
                            )}
                        </label>
                    </div>
                    <label className="block text-sm font-semibold text-slate-800">
                        Email address
                        <input
                            className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
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
                            className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                            type="password"
                            autoComplete="new-password"
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters.",
                                },
                                pattern: {
                                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                    message:
                                        "Include an uppercase letter, lowercase letter, and a number.",
                                },
                            })}
                        />
                        {errors.password && (
                            <span className="mt-1.5 block text-xs font-normal text-red-600">
                                {errors.password.message}
                            </span>
                        )}
                    </label>

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
                        {isSubmitting
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Signup;
