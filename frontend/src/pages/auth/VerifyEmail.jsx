import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
    const { token } = useParams();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    const verificationAttempted = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (verificationAttempted.current === true) return;

                verificationAttempted.current = true;
                if (!token) {
                    setStatus("error");
                    setMessage("Verification token is missing");
                    return;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`,
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Email verification failed",
                    );
                }

                setStatus("success");
                setMessage(result.message);
            } catch (error) {
                setStatus("error");
                setMessage(error.message);
            }
        };
        verifyEmail();
    }, [token]);

    if (status === "loading") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]"
                    >
                        PuddleTrails
                    </Link>
                    <p className="mt-8 text-base leading-relaxed text-[#6b6375]">
                        Verifying your email...
                    </p>
                </div>
            </main>
        );
    }

    const isVerified = status === "success";

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
                <Link
                    to="/"
                    className="text-xl font-semibold tracking-tight text-[#08060d] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174c36]"
                >
                    PuddleTrails
                </Link>

                {isVerified ? (
                    <>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        Email verified!
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        {message}
                    </p>

                    <Link
                        to="/login"
                        className="mt-8 inline-flex rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Go to login
                    </Link>
                    </>
            ) : (
                    <>
                    <h1 className="mb-0 mt-8 text-3xl font-semibold tracking-tight !text-[#08060d]">
                        Verification failed
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-[#6b6375]">
                        {message}
                    </p>

                    <Link
                        to="/"
                        className="mt-8 inline-flex rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Back to home
                    </Link>
                    </>
            )}
            </div>
        </main>
    );
};

export default VerifyEmail;
