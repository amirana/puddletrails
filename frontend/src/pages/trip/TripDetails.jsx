import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ClipboardList, Mail, MapPin, Pencil, Plane, Plus, ReceiptText, UserRound, Users, X } from "lucide-react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";
import EditTripForm from "./EditTripForm.jsx";
import TripItinerary from "../../components/trip/TripItinerary.jsx";
import TripBudget from "../../components/trip/TripBudget.jsx";
import TripChecklists from "../../components/trip/TripChecklists.jsx";
import TripReservations from "../../components/trip/TripReservations.jsx";
import {
    getTrip as getTripService,
    getTripDays as getTripDaysService,
    leaveTrip as leaveTripService,
    removeTripMember as removeTripMemberService,
    sendInvitation as sendInvitationService,
    updateTripMember as updateTripMemberService,
} from "../../services/TripService.js";

const tripTabs = [
    { id: "itinerary", label: "Itinerary", title: "Your trip, day by day", note: "Shape the days around your crew.", icon: CalendarDays },
    { id: "details", label: "Trip details", title: "The trip basics", note: "Keep the destination, dates, and notes up to date.", icon: Pencil },
    { id: "budget", label: "Budget", title: "Keep an eye on the spend", note: "Track the shared costs as you go.", icon: ReceiptText },
    { id: "checklists", label: "Checklists", title: "The little things to remember", note: "Build a list so the important bits make the trip.", icon: ClipboardList },
    { id: "reservations", label: "Bookings", title: "Your reservations", note: "Keep the booking details close at hand.", icon: MapPin },
    { id: "people", label: "People", title: "Your travel crew", note: "Manage who’s coming and what they can do.", icon: Users },
];
const tripTabIconTones = {
    itinerary: "text-[#7D9869]",
    details: "text-[#E9573F]",
    budget: "text-[#D49A27]",
    checklists: "text-[#6F8D62]",
    reservations: "text-[#C94F46]",
    people: "text-[#78966D]",
};

const formatDate = (date) => date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "Date TBD";

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
    const [tripDays, setTripDays] = useState([]);
    const [daysLoading, setDaysLoading] = useState(true);
    const [daysError, setDaysError] = useState("");
    const tripReady = trip?._id === tripId;
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [inviteState, setInviteState] = useState({ busy: false, message: "", error: "" });
    const [memberBusyId, setMemberBusyId] = useState("");
    const [memberError, setMemberError] = useState("");
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("itinerary");

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

    useEffect(() => {
        let cancelled = false;
        const fetchDays = async () => {
            setDaysLoading(true);
            setDaysError("");
            try {
                const response = await getTripDaysService(tripId, accessToken);
                if (!cancelled) setTripDays(response.data);
            } catch (error) {
                if (!cancelled) setDaysError(error.message);
            } finally {
                if (!cancelled) setDaysLoading(false);
            }
        };
        if (accessToken && tripReady) fetchDays();
        return () => {
            cancelled = true;
        };
    }, [tripId, accessToken, tripReady, trip?.startDate, trip?.endDate]);

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
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] text-[#29201D]">
            <AppHeader compact />
            <main className="mx-auto w-full max-w-[1760px] flex-1 px-4 py-4 sm:px-7 sm:py-5">
                {loading ? (
                    <div className="h-[70vh] animate-pulse rounded-3xl border border-[#EAE2D9] bg-white" aria-label="Loading trip" />
                ) : pageError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">{pageError}</div>
                ) : trip ? (
                    <div className="space-y-4">
                        <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
                            <Link to="/dashboard" className="inline-flex min-h-9 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-[#65554D] transition hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All trips
                            </Link>
                            <div className="flex items-center gap-2.5">
                                <div className="flex -space-x-2" aria-label={`${trip.members?.length || 0} trip travelers`}>
                                    {(trip.members || []).slice(0, 4).map((member) => {
                                        const name = [member.user?.firstName, member.user?.lastName].filter(Boolean).join(" ") || member.user?.email || "Traveler";
                                        const initials = name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
                                        return member.user?.avatar
                                            ? <img key={member._id} src={member.user.avatar} alt={name} title={name} className="h-8 w-8 rounded-full border-2 border-[#FFFCF7] object-cover" />
                                            : <span key={member._id} title={name} aria-label={name} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#FFFCF7] bg-[#FFE4D8] text-[10px] font-bold text-[#9B4A3E]">{initials}</span>;
                                    })}
                                </div>
                                {trip.role === "owner" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset({ email: "", role: "viewer" });
                                            setInviteState({ busy: false, message: "", error: "" });
                                            setInviteModalOpen(true);
                                        }}
                                        aria-label="Invite travelers"
                                        title="Invite travelers"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EAE2D9] bg-white text-[#9B4A3E] transition hover:border-[#F1D7C0] hover:bg-[#FFF4E3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]"
                                    >
                                        <Plus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                                <span className="text-sm font-medium text-[#786A62]">{trip.members?.length || 0} {trip.members?.length === 1 ? "traveler" : "travelers"}</span>
                                {trip.role !== "owner" && <button type="button" onClick={handleLeaveTrip} disabled={memberBusyId === "me"} className="rounded-full border border-[#EAE2D9] px-3 py-2 text-xs font-semibold text-[#65554D] transition hover:bg-white disabled:opacity-60">{memberBusyId === "me" ? "Leaving…" : "Leave trip"}</button>}
                            </div>
                        </div>

                        <section className="flex items-center justify-between gap-4 rounded-[28px] bg-[#FFF0DF] px-5 py-5 sm:px-8 sm:py-7" aria-label="Trip overview">
                            <div className="min-w-0">
                                <p className="font-label text-[9px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Your next adventure</p>
                                <h1 className="mb-0 mt-1 truncate text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#29201D] sm:text-3xl">{trip.title || "Your trip"}</h1>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-[#65554D]">
                                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#D65343]" />{trip.destination || "Destination to be decided"}</span>
                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#D65343]" />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                            </div>
                            </div>
                            <span aria-hidden="true" className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFD34E] text-[#29201D] sm:flex"><Plane className="h-5 w-5 -rotate-12" /></span>
                        </section>

                        <div className="min-w-0">
                                <nav role="tablist" aria-label="Trip sections" aria-orientation="horizontal" className="flex gap-1 overflow-x-auto border-b border-[#EAE2D9] px-1">
                                    {tripTabs.map(({ id, label, icon: Icon }) => (
                                        <button key={id} id={`trip-tab-${id}`} type="button" role="tab" aria-selected={activeTab === id} aria-controls={`trip-panel-${id}`} tabIndex={activeTab === id ? 0 : -1} onClick={() => setActiveTab(id)} onKeyDown={(event) => {
                                            if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
                                                event.preventDefault();
                                                const direction = event.key === "ArrowRight" ? 1 : -1;
                                                const currentIndex = tripTabs.findIndex((tab) => tab.id === id);
                                                const next = tripTabs[(currentIndex + direction + tripTabs.length) % tripTabs.length];
                                                setActiveTab(next.id);
                                                document.getElementById(`trip-tab-${next.id}`)?.focus();
                                            }
                                        }} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition ${activeTab === id ? "border-[#E9573F] text-[#9B4A3E]" : "border-transparent text-[#786A62] hover:border-[#F1D7C0] hover:text-[#29201D]"}`}>
                                            <Icon className={`h-4 w-4 ${activeTab === id ? "text-[#E9573F]" : tripTabIconTones[id]}`} aria-hidden="true" /><span>{label}</span>
                                        </button>
                                    ))}
                                </nav>

                            <section className="mt-5 min-w-0 px-1 py-3 sm:px-3 sm:py-5">
                                <div className="min-w-0">
                                    <div id="trip-panel-itinerary" role="tabpanel" aria-labelledby="trip-tab-itinerary" tabIndex={0} hidden={activeTab !== "itinerary"}>
                                        <TripItinerary tripId={tripId} accessToken={accessToken} user={user} role={trip.role} canEdit={trip.role === "owner" || trip.role === "editor"} days={tripDays} setDays={setTripDays} loading={daysLoading} error={daysError} destination={trip.destination} active={activeTab === "itinerary"} />
                                    </div>
                                    <div id="trip-panel-details" role="tabpanel" aria-labelledby="trip-tab-details" tabIndex={0} hidden={activeTab !== "details"}>
                                        <EditTripForm trip={trip} setTrip={setTrip} days={tripDays} />
                                    </div>
                                    <div id="trip-panel-budget" role="tabpanel" aria-labelledby="trip-tab-budget" tabIndex={0} hidden={activeTab !== "budget"}>
                                        <TripBudget tripId={tripId} accessToken={accessToken} canEdit={trip.role === "owner" || trip.role === "editor"} />
                                    </div>
                                    <div id="trip-panel-checklists" role="tabpanel" aria-labelledby="trip-tab-checklists" tabIndex={0} hidden={activeTab !== "checklists"}>
                                        <TripChecklists tripId={tripId} accessToken={accessToken} role={trip.role} />
                                    </div>
                                    <div id="trip-panel-reservations" role="tabpanel" aria-labelledby="trip-tab-reservations" tabIndex={0} hidden={activeTab !== "reservations"}>
                                        <TripReservations tripId={tripId} accessToken={accessToken} role={trip.role} days={tripDays} setDays={setTripDays} />
                                    </div>
                                    <div id="trip-panel-people" role="tabpanel" aria-labelledby="trip-tab-people" tabIndex={0} hidden={activeTab !== "people"}>
                                        <section className="space-y-4">
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div><p className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">Trip group</p><h3 className="mb-0 mt-2 text-2xl font-extrabold text-[#29201D]">Travelers</h3><p className="mt-1 text-sm text-[#786A62]">People who can access this trip and their roles.</p></div>
                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E3] px-3 py-1.5 text-sm font-semibold text-[#51443E]"><Users className="h-4 w-4" /> {trip.members?.length || 0}</span>
                                            </div>
                                            {memberError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{memberError}</p>}
                                            <div className="mt-5 divide-y divide-[#EEE7DF]">
                                                {(trip.members || []).map((member) => {
                                                    const memberUser = member.user || {};
                                                    const isCurrentUser = memberUser._id === user?._id;
                                                    const displayName = [memberUser.firstName, memberUser.lastName].filter(Boolean).join(" ") || memberUser.email || "Trip member";
                                                    return <div key={member._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3">{memberUser.avatar ? <img src={memberUser.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE4D8] text-[#C94F46]"><UserRound className="h-5 w-5" /></span>}<div className="min-w-0"><p className="truncate text-sm font-semibold text-[#29201D]">{displayName}{isCurrentUser ? <span className="ml-2 font-normal text-[#786A62]">(you)</span> : null}</p>{memberUser.email && <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#786A62]"><Mail className="h-3.5 w-3.5" />{memberUser.email}</p>}</div></div><div className="flex items-center gap-2 sm:justify-end">{trip.role === "owner" && member.role !== "owner" ? <><label className="sr-only" htmlFor={`role-${member._id}`}>Role for {displayName}</label><select id={`role-${member._id}`} value={member.role} disabled={memberBusyId === member._id} onChange={(event) => handleRoleChange(member._id, event.target.value)} className="rounded-lg border border-[#EAE2D9] bg-white px-3 py-2 text-sm capitalize text-[#51443E] focus:border-[#E9573F] focus:outline-none focus:ring-2 focus:ring-[#FFE4D8] disabled:opacity-60"><option value="editor">Editor</option><option value="viewer">Viewer</option></select><button type="button" onClick={() => handleRemoveMember(member)} disabled={memberBusyId === member._id} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Remove</button></> : <span className="rounded-full bg-[#FFF4E3] px-3 py-1.5 text-xs font-semibold capitalize text-[#65554D]">{member.role}</span>}</div></div>;
                                                })}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                ) : null}
            </main>
            {inviteModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#29201D]/35 p-4 backdrop-blur-[2px]"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setInviteModalOpen(false);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") setInviteModalOpen(false);
                    }}
                >
                    <section role="dialog" aria-modal="true" aria-labelledby="invite-dialog-title" className="w-full max-w-md rounded-3xl border border-[#EAE2D9] bg-[#FFFCF7] p-6 shadow-[0_24px_80px_rgba(41,32,29,0.2)] sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Bring your crew</p>
                                <h2 id="invite-dialog-title" className="mb-0 mt-2 text-2xl font-extrabold text-[#29201D]">Invite a traveler</h2>
                                <p className="mt-1 text-sm text-[#786A62]">They’ll receive an email invitation to join this trip.</p>
                            </div>
                            <button type="button" onClick={() => setInviteModalOpen(false)} aria-label="Close invite dialog" className="rounded-full p-2 text-[#786A62] transition hover:bg-[#F7F0E8] hover:text-[#29201D]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {inviteState.message && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{inviteState.message}</p>}
                        {inviteState.error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{inviteState.error}</p>}
                        <form className="mt-5 space-y-4" onSubmit={handleSubmit(handleSendInvitation)}>
                            <label className="block text-sm font-semibold text-[#51443E]">Email address
                                <input autoFocus type="email" placeholder="name@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} className="mt-1.5 block w-full rounded-xl border border-[#EAE2D9] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
                                {errors.email && <span className="mt-1 block text-xs font-normal text-red-600">{errors.email.message}</span>}
                            </label>
                            <label className="block text-sm font-semibold text-[#51443E]">Role
                                <select {...register("role", { required: "Role is required" })} className="mt-1.5 block w-full rounded-xl border border-[#EAE2D9] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]">
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                            </label>
                            <div className="flex justify-end gap-2 pt-1">
                                <button type="button" onClick={() => setInviteModalOpen(false)} className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#65554D] transition hover:bg-[#F7F0E8]">Cancel</button>
                                <button type="submit" disabled={inviteState.busy} className="rounded-full bg-[#E9573F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#CF4639] disabled:cursor-wait disabled:opacity-60">{inviteState.busy ? "Sending…" : "Send invite"}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default TripDetails;
