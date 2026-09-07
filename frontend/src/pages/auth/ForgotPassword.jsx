import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService.js";

const ForgotPassword = () => {
    const [submitError, setSubmitError] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const onSubmit = async (data) => {
        setSubmitError("");

        try {
            await forgotPassword(data);
            setEmailSent(true);
        } catch (error) {
            console.error("Forgot password error:", error);
            setSubmitError(error.message || "Unable to send the reset email.");
        }
    };

    if (emailSent) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]"
                    >
                        Traverse
                    </Link>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        Check your inbox
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        If an account exists for that email, we’ve sent password
                        reset instructions.
                    </p>
                    <Link
                        to="/login"
                        className="mt-8 inline-flex rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Back to login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-7 text-left shadow-sm sm:p-10">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]"
                    >
                        Traverse
                    </Link>
                    <Link
                        to="/login"
                        className="text-sm font-medium text-[#4d8063] transition-colors hover:text-[#174c36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Back to login
                    </Link>
                </div>

                <div className="mt-10">
                    <p className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                        PASSWORD RESET
                    </p>
                    <h1 className="mb-0 mt-3 text-3xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-4xl">
                        Forgot your password?
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b6375]">
                        Enter your email and we’ll send you a reset link.
                    </p>
                </div>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <label className="block text-sm font-medium text-[#08060d]">
                        Email address
                        <input
                            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
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

                    {submitError && (
                        <p
                            className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700"
                            role="alert"
                        >
                            {submitError}
                        </p>
                    )}

                    <button
                        className="w-full rounded-full bg-[#b8dfc7] px-5 py-3.5 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36] disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Sending reset link..."
                            : "Send reset link"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ForgotPassword;
