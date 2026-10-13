import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, CircleAlert, LoaderCircle, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { buttonStyles } from "../../components/ui/buttonStyles.js";

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (verificationAttempted.current) return;
            verificationAttempted.current = true;

            if (!token) {
                setStatus("error");
                setMessage("This verification link is missing its token.");
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`,
                );
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Email verification failed.");
                }

                setStatus("success");
                setMessage(result.message || "Your email address is verified.");
            } catch (error) {
                setStatus("error");
                setMessage(error.message || "We couldn't verify your email.");
            }
        };

        verifyEmail();
    }, [token]);

    const isVerified = status === "success";
    const isLoading = status === "loading";

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F3EAE0] px-4 py-8 font-copy text-[#29201D] sm:px-6">
            <section
                role="status"
                aria-live="polite"
                aria-labelledby="verification-title"
                className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-[#E9D9CA] bg-[#FFFCF7] shadow-[0_24px_80px_rgba(41,32,29,0.16)]"
            >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FFD34E]" />
                <Link
                    to="/"
                    aria-label="Return to PuddleTrails home"
                    className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full text-[#786A62] transition hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F] sm:right-6 sm:top-6"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </Link>

                <div className="px-6 pb-8 pt-10 text-center sm:px-12 sm:pb-11 sm:pt-12">
                    <Link to="/" aria-label="PuddleTrails home" className="inline-flex">
                        <img src={logo} alt="PuddleTrails" className="h-12 w-auto object-contain mix-blend-multiply" />
                    </Link>

                    <div className={`mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-[1.35rem] ${isVerified ? "bg-[#E7EFD9] text-[#5F7F59]" : isLoading ? "bg-[#FFF0C4] text-[#9B4A3E]" : "bg-[#FFE4D8] text-[#C94F46]"}`}>
                        {isVerified ? (
                            <BadgeCheck className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                        ) : isLoading ? (
                            <LoaderCircle className="h-8 w-8 animate-spin" strokeWidth={1.8} aria-hidden="true" />
                        ) : (
                            <CircleAlert className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                        )}
                    </div>

                    <p className="mt-6 font-label text-[11px] font-bold uppercase tracking-[0.14em] text-[#9B4A3E]">
                        {isVerified ? "All set for the getaway" : isLoading ? "One quick pit stop" : "Let’s get you back on track"}
                    </p>
                    <h1 id="verification-title" className="mb-0 mt-2 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
                        {isVerified ? "You’re verified!" : isLoading ? "Checking your email…" : "This link needs a refresh."}
                    </h1>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#786A62]">
                        {isVerified
                            ? "Your email is confirmed. Your crew and your next trip are just a login away."
                            : isLoading
                              ? "We’re confirming your email address now. This should only take a moment."
                              : message || "This verification link may have expired or already been used. Sign in to request a fresh one."}
                    </p>

                    {isVerified ? (
                        <>
                            <Link to="/login" className={buttonStyles({ size: "form", className: "mt-7 w-full" })}>
                                Log in to PuddleTrails <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                            <p className="mt-5 text-xs text-[#786A62]">
                                Ready when you are. <Link to="/" className="font-bold text-[#C94F46] underline-offset-4 hover:underline">Back to home</Link>
                            </p>
                        </>
                    ) : !isLoading ? (
                        <div className="mt-7 flex flex-col gap-3">
                            <Link to="/login" className={buttonStyles({ size: "form", className: "w-full" })}>
                                Go to log in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                            <p className="text-xs leading-5 text-[#786A62]">
                                You can request a fresh verification link from the login page.
                            </p>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
};

export default VerifyEmail;
