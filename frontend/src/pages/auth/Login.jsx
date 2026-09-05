import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

    const onSubmit = async (data) => {
        setSubmitError("");

        try {
            await login(data);
            navigate("/dashboard");
        } catch (error) {
            setSubmitError(error.message || "Unable to log in.");
        }
    };

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
                    <p className="text-right text-sm text-[#6b6375]">
                        New here?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-[#4d8063] transition-colors hover:text-[#174c36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-10">
                    <p className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                        WELCOME BACK
                    </p>
                    <h1 className="mb-0 mt-3 text-3xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-4xl">
                        Continue planning together.
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b6375]">
                        Log in to pick up where your travel plans left off.
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

                    <label className="block text-sm font-medium text-[#08060d]">
                        Password
                        <input
                            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
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
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;
