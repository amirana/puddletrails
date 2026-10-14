import { useContext, useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";
import {
    acceptInvitation as acceptInvitationService,
    declineInvitation as declineInvitationService,
    getInvitation as getInvitationService,
} from "../../services/TripService.js";

const Invitation = () => {
    const { token } = useParams();
    const { authLoading, accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!accessToken) {
            const redirect = encodeURIComponent(`/invitations/${token}`);
            navigate(`/login?redirect=${redirect}`, { replace: true });
            return;
        }

        let cancelled = false;

        const loadInvitation = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await getInvitationService(token, accessToken);
                if (!cancelled) setInvitation(result.data);
            } catch (loadError) {
                if (!cancelled) setError(loadError.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadInvitation();

        return () => {
            cancelled = true;
        };
    }, [authLoading, accessToken, token, navigate]);

    const handleAccept = async () => {
        setActionLoading(true);
        setError("");

        try {
            const result = await acceptInvitationService(token, accessToken);
            navigate(`/trips/${result.data.member.trip}`);
        } catch (actionError) {
            setError(actionError.message);
            setActionLoading(false);
        }
    };

    const handleDecline = async () => {
        setActionLoading(true);
        setError("");

        try {
            await declineInvitationService(token, accessToken);
            setInvitation((current) => ({ ...current, status: "declined" }));
        } catch (actionError) {
            setError(actionError.message);
        } finally {
            setActionLoading(false);
        }
    };

    const hasExpired =
        invitation?.status === "pending" &&
        invitation.expiresAt &&
        new Date(invitation.expiresAt) <= new Date();
    const status = hasExpired ? "expired" : invitation?.status;

    let statusContent;
    if (loading || authLoading) {
        statusContent = (
            <p className="text-sm text-[#786A62]" role="status">
                Loading invitation…
            </p>
        );
    } else if (error && !invitation) {
        statusContent = (
            <p
                className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]"
                role="alert"
            >
                {error}
            </p>
        );
    } else if (status === "pending") {
        statusContent = (
            <>
                <p className="text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                    You have been invited as a{" "}
                    <strong>{invitation.role}</strong>. Accept to join the trip,
                    or decline the invitation.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={actionLoading}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#E9573F] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#CF4937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] disabled:cursor-wait disabled:opacity-60"
                    >
                        {actionLoading ? "Updating…" : "Accept invitation"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDecline}
                        disabled={actionLoading}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#E9D9CA] bg-white px-6 py-3 text-sm font-bold text-[#65554D] transition hover:bg-[#FFF6EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F] disabled:cursor-wait disabled:opacity-60"
                    >
                        Decline
                    </button>
                </div>
            </>
        );
    } else if (status === "accepted") {
        statusContent = (
            <>
                <p className="text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                    You have already accepted this invitation. You can open the
                    trip now.
                </p>
                <Link
                    to={`/trips/${invitation.trip}`}
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#E9573F] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#CF4937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D]"
                >
                    Go to trip
                </Link>
            </>
        );
    } else if (status === "declined") {
        statusContent = (
            <p className="text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                This invitation was declined. Ask the trip owner to send you a
                new invitation if you change your mind.
            </p>
        );
    } else if (status === "expired") {
        statusContent = (
            <p className="text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                This invitation has expired. Ask the trip owner to send a new
                one.
            </p>
        );
    } else if (!error) {
        statusContent = (
            <p className="text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                We couldn’t determine the status of this invitation.
            </p>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] font-copy text-[#29201D]">
            <AppHeader />
            <main className="flex flex-1 items-center px-4 py-8 sm:px-8 sm:py-12">
                <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-[#E9D9CA] bg-white shadow-[0_20px_60px_rgba(41,32,29,0.08)]">
                    <div className="bg-[#FFF2E0] px-6 py-7 sm:px-10 sm:py-9">
                        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD34E] text-[#29201D]">
                            <Plane className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">
                            PuddleTrails invitation
                        </p>
                        <h1 className="mb-0 mt-3 !text-3xl font-black leading-tight tracking-tight text-[#29201D] sm:!text-4xl">
                            {status === "accepted"
                                ? "You’re already part of the trip"
                                : status === "declined"
                                  ? "Invitation declined"
                                  : status === "expired"
                                    ? "Invitation expired"
                                    : "You’ve been invited to a trip"}
                        </h1>
                    </div>
                    <div className="px-6 py-6 sm:px-10 sm:py-8">
                        {statusContent}
                        {error && invitation && (
                            <p
                                className="mt-4 rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A33128]"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Invitation;
