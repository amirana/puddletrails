import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../services/AuthService.js";
import { Link, useParams } from "react-router-dom";

const ResetPassword = () => {
    const [submitError, setSubmitError] = useState("");
    const [passwordReset, setPasswordReset] = useState(false);
    const { token } = useParams();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const onSubmit = async ({ password }) => {
        setSubmitError("");

        try {
            await resetPassword(token, { password });
            setPasswordReset(true);
        } catch (error) {
            setSubmitError(error.message || "Unable to reset your password.");
        }
    };

    if (passwordReset) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
                    <Link to="/" className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]">
                        Traverse
                    </Link>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        Password updated
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        Your password has been reset. You can now log in.
                    </p>
                    <Link to="/login" className="mt-8 inline-flex rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]">
                        Go to login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-7 text-left shadow-sm sm:p-10">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/" className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]">
                        Traverse
                    </Link>
                    <Link to="/login" className="text-sm font-medium text-[#4d8063] transition-colors hover:text-[#174c36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]">
                        Back to login
                    </Link>
                </div>

                <div className="mt-10">
                    <p className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">PASSWORD RESET</p>
                    <h1 className="mb-0 mt-3 text-3xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-4xl">
                        Choose a new password
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b6375]">
                        Use at least 8 characters, including an uppercase letter and a number.
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <label className="block text-sm font-medium text-[#08060d]">
                        New password
                        <input
                            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
                            type="password"
                            autoComplete="new-password"
                            {...register("password", {
                                required: "Password is required.",
                                minLength: { value: 8, message: "Password must be at least 8 characters." },
                                pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Include an uppercase letter and a number." },
                            })}
                        />
                        {errors.password && <span className="mt-1.5 block text-xs font-normal text-red-600">{errors.password.message}</span>}
                    </label>

                    <label className="block text-sm font-medium text-[#08060d]">
                        Confirm new password
                        <input
                            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
                            type="password"
                            autoComplete="new-password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password.",
                                validate: (value) => value === getValues("password") || "Passwords do not match.",
                            })}
                        />
                        {errors.confirmPassword && <span className="mt-1.5 block text-xs font-normal text-red-600">{errors.confirmPassword.message}</span>}
                    </label>

                    {submitError && <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">{submitError}</p>}

                    <button className="w-full rounded-full bg-[#b8dfc7] px-5 py-3.5 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating password..." : "Update password"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;
