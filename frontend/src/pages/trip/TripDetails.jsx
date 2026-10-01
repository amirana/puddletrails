import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, UserRound, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";
import EditTripForm from "./EditTripForm.jsx";
import {
    getTrip as getTripService,
    leaveTrip as leaveTripService,
    removeTripMember as removeTripMemberService,
    sendInvitation as sendInvitationService,
    updateTripMember as updateTripMemberService,
} from "../../services/TripService.js";

const TripDetails = () => {
    const { tripId } = useParams();
    const { accessToken, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onTouched", defaultValues: { role: "viewer" } });

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [inviteState, setInviteState] = useState({ busy: false, message: "", error: "" });
    const [memberBusyId, setMemberBusyId] = useState("");
    const [memberError, setMemberError] = useState("");

    useEffect(() => {
        let cancelled = false;
        const fetchTrip = async () => {
            setLoading(true);
            setPageError("");
            try {
                const response = await getTripService(tripId, accessToken);
                if (!cancelled) setTrip(response.data);
            } catch (error) {
                if (!cancelled) setPageError(error.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        if (accessToken) fetchTrip();
        return () => {
            cancelled = true;
        };
    }, [tripId, accessToken]);

    const handleSendInvitation = async (data) => {
        setInviteState({ busy: true, message: "", error: "" });
        try {
            await sendInvitationService(tripId, data.email, data.role, accessToken);
            setInviteState({ busy: false, message: `Invitation sent to ${data.email}.`, error: "" });
            reset({ email: "", role: "viewer" });
        } catch (error) {
            setInviteState({ busy: false, message: "", error: error.message });
        }
    };

    const handleRoleChange = async (memberId, role) => {
        setMemberBusyId(memberId);
        setMemberError("");
        try {
            const response = await updateTripMemberService(tripId, memberId, role, accessToken);
            setTrip((current) => ({
                ...current,
                members: current.members.map((member) =>
                    member._id === memberId ? response.data : member,
                ),
            }));
        } catch (error) {
            setMemberError(error.message);
        } finally {
            setMemberBusyId("");
        }
    };

    const handleRemoveMember = async (member) => {
        const name = [member.user?.firstName, member.user?.lastName].filter(Boolean).join(" ") || member.user?.email || "this member";
        if (!window.confirm(`Remove ${name} from this trip?`)) return;
        setMemberBusyId(member._id);
        setMemberError("");
        try {
            await removeTripMemberService(tripId, member._id, accessToken);
            setTrip((current) => ({
                ...current,
                members: current.members.filter((item) => item._id !== member._id),
            }));
        } catch (error) {
            setMemberError(error.message);
        } finally {
            setMemberBusyId("");
        }
    };

    const handleLeaveTrip = async () => {
        if (!window.confirm("Leave this trip? You will lose access to its plans.")) return;
        setMemberBusyId("me");
        setMemberError("");
        try {
            await leaveTripService(tripId, accessToken);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setMemberError(error.message);
            setMemberBusyId("");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6F2] text-[#172033]">
            <AppHeader />
            <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
                        <ArrowLeft className="h-4 w-4" /> All trips
                    </Link>
                    {trip && trip.role !== "owner" && (
                        <button type="button" onClick={handleLeaveTrip} disabled={memberBusyId === "me"} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
                            {memberBusyId === "me" ? "Leaving…" : "Leave trip"}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />
                ) : pageError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">{pageError}</div>
                ) : trip ? (
                    <>
                        <EditTripForm trip={trip} setTrip={setTrip} />

                        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Trip group</p>
                                    <h2 className="mb-0 mt-2 !text-2xl font-semibold text-slate-900">Members</h2>
                                    <p className="mt-1 text-sm text-slate-500">People who can access this trip and their roles.</p>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    <Users className="h-4 w-4" /> {trip.members?.length || 0}
                                </span>
                            </div>

                            {memberError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{memberError}</p>}

                            <div className="mt-5 divide-y divide-slate-100">
                                {(trip.members || []).map((member) => {
                                    const memberUser = member.user || {};
                                    const isCurrentUser = memberUser._id === user?._id;
                                    const displayName = [memberUser.firstName, memberUser.lastName].filter(Boolean).join(" ") || memberUser.email || "Trip member";
                                    return (
                                        <div key={member._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 items-center gap-3">
                                                {memberUser.avatar ? (
                                                    <img src={memberUser.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                                                ) : (
                                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800"><UserRound className="h-5 w-5" /></span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{displayName}{isCurrentUser ? <span className="ml-2 font-normal text-slate-500">(you)</span> : null}</p>
                                                    {memberUser.email && <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500"><Mail className="h-3.5 w-3.5" />{memberUser.email}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:justify-end">
                                                {trip.role === "owner" && member.role !== "owner" ? (
                                                    <>
                                                        <label className="sr-only" htmlFor={`role-${member._id}`}>Role for {displayName}</label>
                                                        <select id={`role-${member._id}`} value={member.role} disabled={memberBusyId === member._id} onChange={(event) => handleRoleChange(member._id, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-60">
                                                            <option value="editor">Editor</option>
                                                            <option value="viewer">Viewer</option>
                                                        </select>
                                                        <button type="button" onClick={() => handleRemoveMember(member)} disabled={memberBusyId === member._id} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Remove</button>
                                                    </>
                                                ) : (
                                                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${member.role === "owner" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{member.role}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {trip.role === "owner" && (
                            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Grow the group</p>
                                <h2 className="mb-0 mt-2 !text-2xl font-semibold text-slate-900">Invite someone</h2>
                                <p className="mt-1 text-sm text-slate-500">They’ll receive an email invitation to join this trip.</p>
                                {inviteState.message && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{inviteState.message}</p>}
                                {inviteState.error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{inviteState.error}</p>}
                                <form className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end" onSubmit={handleSubmit(handleSendInvitation)}>
                                    <label className="block text-sm font-medium text-slate-700">Email address
                                        <input type="email" placeholder="name@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                                        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
                                    </label>
                                    <label className="block text-sm font-medium text-slate-700">Role
                                        <select {...register("role", { required: "Role is required" })} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                                            <option value="viewer">Viewer</option><option value="editor">Editor</option>
                                        </select>
                                    </label>
                                    <button type="submit" disabled={inviteState.busy} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">{inviteState.busy ? "Sending…" : "Send invite"}</button>
                                </form>
                            </section>
                        )}
                    </>
                ) : null}
            </main>
            <Footer />
        </div>
    );
};

export default TripDetails;
