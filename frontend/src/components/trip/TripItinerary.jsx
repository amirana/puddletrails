import { useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Clock3,
    GripVertical,
    MapPin,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import ActivityForm from "./ActivityForm.jsx";
import {
    createActivity,
    deleteActivity,
    reorderActivities,
    updateActivity,
} from "../../services/ActivityService.js";

const TripItinerary = ({
    tripId,
    accessToken,
    canEdit,
    days,
    setDays,
    loading,
    error,
}) => {
    const [editor, setEditor] = useState(null);
    const [busy, setBusy] = useState("");
    const [activityError, setActivityError] = useState("");
    const [draggedActivityId, setDraggedActivityId] = useState("");
    const [dragOverDayId, setDragOverDayId] = useState("");

    const memberName = (member) =>
        [member?.firstName, member?.lastName].filter(Boolean).join(" ") || "Unknown member";
    const formatActivityTime = (value) => value
        ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
        : "";

    const updateLocalActivity = (activity) => {
        const dayId = activity.tripDay.toString();
        setDays((current) => current.map((day) => {
            if (day._id !== dayId) return day;
            const activities = (day.activities || []).some((item) => item._id === activity._id)
                ? day.activities.map((item) => item._id === activity._id ? activity : item)
                : [...(day.activities || []), activity];
            return { ...day, activities: activities.sort((a, b) => a.order - b.order) };
        }));
    };

    const handleSaveActivity = async (values) => {
        const editing = editor?.activity;
        const dayId = editor?.dayId;
        if (!dayId) return;
        setBusy(editing?._id || dayId);
        setActivityError("");
        try {
            const response = editing
                ? await updateActivity(tripId, editing._id, values, accessToken)
                : await createActivity(tripId, dayId, values, accessToken);
            updateLocalActivity(response.data);
            setEditor(null);
        } catch (saveError) {
            setActivityError(saveError.message);
        } finally {
            setBusy("");
        }
    };

    const handleDeleteActivity = async (activity) => {
        setBusy(activity._id);
        setActivityError("");
        try {
            await deleteActivity(tripId, activity._id, accessToken);
            setDays((current) => current.map((day) => {
                const activities = (day.activities || [])
                    .filter((item) => item._id !== activity._id)
                    .map((item, order) => ({ ...item, order }));
                return { ...day, activities };
            }));
        } catch (deleteError) {
            setActivityError(deleteError.message);
        } finally {
            setBusy("");
        }
    };

    const moveActivity = async (activityId, destinationDayId, destinationIndex) => {
        if (busy) return;
        const previousDays = days;
        const nextDays = days.map((day) => ({ ...day, activities: [...(day.activities || [])] }));
        let movedActivity;
        let sourceDay;
        let sourceIndex = -1;
        for (const day of nextDays) {
            sourceIndex = day.activities.findIndex((activity) => activity._id === activityId);
            if (sourceIndex !== -1) {
                sourceDay = day;
                [movedActivity] = day.activities.splice(sourceIndex, 1);
                break;
            }
        }
        const targetDay = nextDays.find((day) => day._id === destinationDayId);
        if (!movedActivity || !sourceDay || !targetDay) return;

        let insertionIndex = destinationIndex;
        if (sourceDay._id === targetDay._id && sourceIndex < insertionIndex) insertionIndex -= 1;
        insertionIndex = Math.max(0, Math.min(insertionIndex, targetDay.activities.length));
        targetDay.activities.splice(insertionIndex, 0, { ...movedActivity, tripDay: destinationDayId });
        for (const day of nextDays) {
            day.activities = day.activities.map((activity, order) => ({ ...activity, order }));
        }

        const positions = nextDays.flatMap((day) => day.activities.map((activity, order) => ({
            activityId: activity._id,
            tripDayId: day._id,
            order,
        })));
        setDays(nextDays);
        setBusy("reordering");
        setActivityError("");
        try {
            await reorderActivities(tripId, positions, accessToken);
        } catch (moveError) {
            setDays(previousDays);
            setActivityError(moveError.message);
        } finally {
            setBusy("");
            setDraggedActivityId("");
            setDragOverDayId("");
        }
    };

    return (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">The itinerary</p>
                    <h2 className="mb-0 mt-2 !text-2xl font-semibold text-slate-900">Day by day</h2>
                    <p className="mt-1 text-sm text-slate-500">Add the stops you’re excited about, then shape the days together.</p>
                </div>
                {!loading && !error && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                        <CalendarDays className="h-4 w-4" /> {days.length} {days.length === 1 ? "day" : "days"}
                    </span>
                )}
            </div>

            {(error || activityError) && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error || activityError}</p>}
            {loading ? (
                <div className="mt-5 space-y-3" aria-label="Loading itinerary">
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            ) : !error && (
                <ol className="mt-5 space-y-4">
                    {days.map((day) => {
                        const dayActivities = day.activities || [];
                        const dayDate = new Date(day.date).toLocaleDateString("en-GB", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
                        });
                        return (
                            <li
                                key={day._id}
                                onDragOver={(event) => {
                                    if (!canEdit || !draggedActivityId) return;
                                    event.preventDefault();
                                    setDragOverDayId(day._id);
                                }}
                                onDrop={(event) => {
                                    if (!canEdit) return;
                                    event.preventDefault();
                                    const activityId = event.dataTransfer.getData("text/plain") || draggedActivityId;
                                    if (activityId) moveActivity(activityId, day._id, dayActivities.length);
                                }}
                                className={`rounded-2xl border p-4 transition-colors sm:p-5 ${dragOverDayId === day._id ? "border-violet-400 bg-violet-50/70" : "border-slate-200 bg-white"}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F1EDFA] text-[#6757A8]">
                                        <span className="text-[9px] font-bold uppercase tracking-wide">Day</span>
                                        <span className="text-base font-bold leading-4">{day.dayNumber}</span>
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-slate-900">{dayDate}</h3>
                                        <p className="mt-1 text-xs text-slate-500">{dayActivities.length ? `${dayActivities.length} ${dayActivities.length === 1 ? "activity" : "activities"}` : "The day is open"}</p>
                                    </div>
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => { setActivityError(""); setEditor({ dayId: day._id, activity: null }); }}
                                            disabled={Boolean(busy)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-50 disabled:opacity-50"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add
                                        </button>
                                    )}
                                </div>

                                {dayActivities.length > 0 ? (
                                    <ul className="mt-4 space-y-2.5">
                                        {dayActivities.map((activity, index) => (
                                            <li
                                                key={activity._id}
                                                draggable={canEdit && !busy}
                                                onDragStart={(event) => {
                                                    event.dataTransfer.effectAllowed = "move";
                                                    event.dataTransfer.setData("text/plain", activity._id);
                                                    setDraggedActivityId(activity._id);
                                                }}
                                                onDragEnd={() => { setDraggedActivityId(""); setDragOverDayId(""); }}
                                                onDragOver={(event) => {
                                                    if (!canEdit || !draggedActivityId) return;
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onDrop={(event) => {
                                                    if (!canEdit) return;
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    const activityId = event.dataTransfer.getData("text/plain") || draggedActivityId;
                                                    if (activityId && activityId !== activity._id) moveActivity(activityId, day._id, index);
                                                }}
                                                className={`group rounded-xl border border-slate-100 bg-slate-50/80 p-3 ${draggedActivityId === activity._id ? "opacity-40" : ""}`}
                                            >
                                                {editor?.activity?._id === activity._id ? (
                                                    <ActivityForm
                                                        activity={activity}
                                                        busy={Boolean(busy)}
                                                        onCancel={() => setEditor(null)}
                                                        onSave={handleSaveActivity}
                                                    />
                                                ) : (
                                                    <div className="flex items-start gap-2">
                                                        {canEdit && <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-slate-400 active:cursor-grabbing" aria-label="Drag to reorder" />}
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                                                            {(activity.startTime || activity.endTime) && (
                                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                                                                    <Clock3 className="h-3.5 w-3.5" />
                                                                    {activity.startTime || "Time TBD"}{activity.endTime ? ` – ${activity.endTime}` : ""}
                                                                </p>
                                                            )}
                                                            {activity.location && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600"><MapPin className="h-3.5 w-3.5" />{activity.location}</p>}
                                                            {activity.description && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-600">{activity.description}</p>}
                                                            <p className="mt-2 text-[11px] leading-4 text-slate-500">
                                                                Added by {memberName(activity.createdBy)} · {formatActivityTime(activity.createdAt)}
                                                            </p>
                                                            {activity.editedAt && (
                                                                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                                                                    Edited by {memberName(activity.updatedBy)} · {formatActivityTime(activity.editedAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {canEdit && (
                                                            <div className="flex shrink-0 items-center gap-1">
                                                                <button type="button" onClick={() => moveActivity(activity._id, day._id, index - 1)} disabled={Boolean(busy) || index === 0} className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-30" aria-label={`Move ${activity.title} earlier`} title="Move earlier"><ChevronUp className="h-4 w-4" /></button>
                                                                <button type="button" onClick={() => moveActivity(activity._id, day._id, index + 2)} disabled={Boolean(busy) || index === dayActivities.length - 1} className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-30" aria-label={`Move ${activity.title} later`} title="Move later"><ChevronDown className="h-4 w-4" /></button>
                                                                <select
                                                                    aria-label={`Move ${activity.title} to another day`}
                                                                    value={day._id}
                                                                    disabled={Boolean(busy)}
                                                                    onChange={(event) => moveActivity(activity._id, event.target.value, (days.find((item) => item._id === event.target.value)?.activities || []).length)}
                                                                    className="max-w-24 rounded-md border border-slate-200 bg-white px-1.5 py-1.5 text-[10px] text-slate-600 disabled:opacity-50"
                                                                >
                                                                    {days.map((destination) => <option key={destination._id} value={destination._id}>Day {destination.dayNumber}</option>)}
                                                                </select>
                                                                <button type="button" onClick={() => { setActivityError(""); setEditor({ dayId: day._id, activity }); }} disabled={Boolean(busy)} className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-violet-700 disabled:opacity-50" aria-label={`Edit ${activity.title}`}><Pencil className="h-3.5 w-3.5" /></button>
                                                                <button type="button" onClick={() => handleDeleteActivity(activity)} disabled={Boolean(busy)} className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-red-700 disabled:opacity-50" aria-label={`Delete ${activity.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500">
                                        {canEdit ? "No activities yet. Add a stop, meal, or anything your group wants to do." : "No activities have been planned for this day yet."}
                                    </p>
                                )}

                                {editor?.dayId === day._id && !editor.activity && (
                                    <ActivityForm
                                        busy={Boolean(busy)}
                                        onCancel={() => setEditor(null)}
                                        onSave={handleSaveActivity}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
};

export default TripItinerary;
