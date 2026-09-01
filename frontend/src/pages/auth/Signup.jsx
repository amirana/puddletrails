import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                "http://localhost:4000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            console.log("Registration successful:", result);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    if (isSubmitSuccessful) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight text-[#08060d]"
                    >
                        Traverse
                    </Link>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        You’re all set.
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        Your account has been created successfully.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-7 text-left shadow-sm sm:p-10">
                <div className="flex items-center justify-between">
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
                        Log in
                    </Link>
                </div>

                <div className="mt-10">
                    <p className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                        START PLANNING
                    </p>
                    <h1 className="mb-0 mt-3 text-3xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-4xl">
                        Create your account
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b6375]">
                        Bring your travel group and every trip detail together.
                    </p>
                </div>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-[#08060d]">
                            First name
                            <input
                                className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
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
                        <label className="block text-sm font-medium text-[#08060d]">
                            Last name
                            <input
                                className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-base text-[#08060d] outline-none transition focus:border-[#4d8063] focus:ring-2 focus:ring-[#b8dfc7]"
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
                    <button
                        className="w-full rounded-full bg-[#b8dfc7] px-5 py-3.5 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36] disabled:cursor-not-allowed disabled:opacity-60"
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
