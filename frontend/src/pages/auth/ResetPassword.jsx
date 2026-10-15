import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../services/authService.js";
import { Link, useParams } from "react-router-dom";
import { buttonStyles } from "../../components/ui/buttonStyles.js";

const ResetPassword = () => {
    const [submitError, setSubmitError] = useState("");
    const [passwordReset, setPasswordReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                        PuddleTrails
                    </Link>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        Password updated
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        Your password has been reset. You can now log in.
                    </p>
                    <Link to="/login" className={buttonStyles({ className: "mt-8" })}>
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
                        PuddleTrails
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
                        <span className="relative mt-2 block">
                            <input
                                className="block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 pr-12 text-base text-[#08060d] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: { value: 8, message: "Password must be at least 8 characters." },
                                    pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Include an uppercase letter and a number." },
                                })}
                            />
                            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 text-[#786A62] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                {showPassword ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        </span>
                        {errors.password && <span className="mt-1.5 block text-xs font-normal text-red-600">{errors.password.message}</span>}
                    </label>

                    <label className="block text-sm font-medium text-[#08060d]">
                        Confirm new password
                        <span className="relative mt-2 block">
                            <input
                                className="block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 pr-12 text-base text-[#08060d] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password.",
                                    validate: (value) => value === getValues("password") || "Passwords do not match.",
                                })}
                            />
                            <button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 text-[#786A62] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                {showConfirmPassword ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        </span>
                        {errors.confirmPassword && <span className="mt-1.5 block text-xs font-normal text-red-600">{errors.confirmPassword.message}</span>}
                    </label>

                    {submitError && <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">{submitError}</p>}

                    <button className={buttonStyles({ size: "form", className: "w-full" })} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating password..." : "Update password"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;
