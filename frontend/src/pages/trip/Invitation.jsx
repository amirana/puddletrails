import { useContext, useEffect, useState } from "react";
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
            <p className="text-sm text-slate-500" role="status">
                Loading invitation…
            </p>
        );
    } else if (error && !invitation) {
        statusContent = (
            <p
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
            >
                {error}
            </p>
        );
    } else if (status === "pending") {
        statusContent = (
            <>
                <p className="text-sm leading-6 text-slate-600">
                    You have been invited as a{" "}
                    <strong>{invitation.role}</strong>. Accept to join the trip,
                    or decline the invitation.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={actionLoading}
                        className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
                    >
                        {actionLoading ? "Updating…" : "Accept invitation"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDecline}
                        disabled={actionLoading}
                        className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                    >
                        Decline
                    </button>
                </div>
            </>
        );
    } else if (status === "accepted") {
        statusContent = (
            <>
                <p className="text-sm leading-6 text-slate-600">
                    You have already accepted this invitation. You can open the
                    trip now.
                </p>
                <Link
                    to={`/trips/${invitation.trip}`}
                    className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                    Go to trip
                </Link>
            </>
        );
    } else if (status === "declined") {
        statusContent = (
            <p className="text-sm leading-6 text-slate-600">
                This invitation was declined. Ask the trip owner to send you a
                new invitation if you change your mind.
            </p>
        );
    } else if (status === "expired") {
        statusContent = (
            <p className="text-sm leading-6 text-slate-600">
                This invitation has expired. Ask the trip owner to send a new
                one.
            </p>
        );
    } else if (!error) {
        statusContent = (
            <p className="text-sm leading-6 text-slate-600">
                We couldn’t determine the status of this invitation.
            </p>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6F2] text-[#172033]">
            <AppHeader />
            <main className="flex-1 px-6 py-12 sm:px-10 lg:px-12">
                <section className="mx-auto max-w-xl rounded-[24px] border border-[#E6EEF8] bg-white p-7 shadow-[0_24px_80px_rgba(23,32,51,0.08)] sm:p-10">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
                        TRAVERSE INVITATION
                    </p>
                    <h1 className="mb-3 mt-4 !text-3xl font-semibold tracking-tight text-[#172033] sm:!text-4xl">
                        {status === "accepted"
                            ? "You’re already part of the trip"
                            : status === "declined"
                              ? "Invitation declined"
                              : status === "expired"
                                ? "Invitation expired"
                                : "You’ve been invited to a trip"}
                    </h1>
                    {statusContent}
                    {error && invitation && (
                        <p
                            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Invitation;
