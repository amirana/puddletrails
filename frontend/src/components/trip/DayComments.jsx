import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Pencil, Reply, Trash2 } from "lucide-react";
import { createDayComment, deleteDayComment, updateDayComment } from "../../services/DayCommentService.js";

const authorName = (comment) =>
    [comment.createdBy?.firstName, comment.createdBy?.lastName].filter(Boolean).join(" ") || "Trip member";

const commentDate = (value) => {
    const date = new Date(value);
    const elapsedSeconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
    if (elapsedSeconds < 60) return "just now";
    if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    if (elapsedSeconds < 86_400) return `${Math.floor(elapsedSeconds / 3600)}h ago`;
    if (elapsedSeconds < 604_800) return `${Math.floor(elapsedSeconds / 86_400)}d ago`;

    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const exactCommentDate = (date) => new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
});

const Composer = ({ initialText = "", placeholder, submitLabel, busy, onCancel, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { text: initialText },
    });
    const submit = async ({ text }) => {
        const saved = await onSubmit(text.trim());
        if (saved !== false) reset({ text: "" });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="mt-2">
            <textarea
                rows={2}
                maxLength={1000}
                placeholder={placeholder}
                aria-label={placeholder}
                aria-invalid={Boolean(errors.text)}
                {...register("text", {
                    required: "Write a comment first.",
                    maxLength: { value: 1000, message: "Use 1,000 characters or fewer." },
                    validate: (value) => value.trim().length > 0 || "Write a comment first.",
                })}
                className="block w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
            {errors.text && <p className="mt-1 text-xs text-red-600">{errors.text.message}</p>}
            <div className="mt-2 flex justify-end gap-2">
                {onCancel && <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>}
                <button type="submit" disabled={busy || isSubmitting} className="rounded-md bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-800 disabled:opacity-50">{isSubmitting ? "Saving…" : submitLabel}</button>
            </div>
        </form>
    );
};

const DayComments = ({ tripId, day, accessToken, user, role, setDays }) => {
    const [composer, setComposer] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const comments = day.comments || [];
    const roots = comments.filter((comment) => !comment.parentComment);
    const isAuthor = (comment) => String(comment.createdBy?._id) === String(user?._id);
    const editLocal = (comment) => setDays((current) => current.map((item) => item._id === day._id
        ? { ...item, comments: (item.comments || []).map((existing) => existing._id === comment._id ? comment : existing) }
        : item));

    const submit = async (text, parentCommentId = null, editingId = null) => {
        setBusy(true);
        setError("");
        try {
            if (editingId) {
                const response = await updateDayComment(tripId, editingId, text, accessToken);
                editLocal(response.data);
            } else {
                const response = await createDayComment(tripId, day._id, {
                    text,
                    ...(parentCommentId ? { parentCommentId } : {}),
                }, accessToken);
                setDays((current) => current.map((item) => item._id === day._id
                    ? { ...item, comments: [...(item.comments || []), response.data] }
                    : item));
            }
            setComposer(null);
            return true;
        } catch (requestError) {
            setError(requestError.message);
            return false;
        } finally {
            setBusy(false);
        }
    };

    const remove = async (comment) => {
        const hasReplies = !comment.parentComment && comments.some((item) => String(item.parentComment) === comment._id);
        if (!window.confirm(hasReplies ? "Delete this comment and its replies?" : "Delete this comment?")) return;
        setBusy(true);
        setError("");
        try {
            await deleteDayComment(tripId, comment._id, accessToken);
            setDays((current) => current.map((item) => item._id === day._id
                ? { ...item, comments: (item.comments || []).filter((existing) => existing._id !== comment._id && String(existing.parentComment) !== comment._id) }
                : item));
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MessageCircle className="h-4 w-4 text-violet-700" /> Comments <span className="text-xs font-normal text-slate-500">{comments.length}</span>
                </div>
                {!composer && <button type="button" onClick={() => setComposer({ mode: "new" })} className="text-xs font-semibold text-violet-700 hover:text-violet-900">Add comment</button>}
            </div>
            {error && <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            {!roots.length && !composer && <p className="mt-2 text-xs text-slate-500">No comments yet. Start the conversation for this day.</p>}
            <ul className="mt-3 space-y-3">
                {roots.map((comment) => {
                    const replies = comments.filter((item) => String(item.parentComment) === comment._id);
                    return (
                        <li key={comment._id} className="rounded-xl bg-slate-50 p-3">
                            <CommentBody comment={comment} isAuthor={isAuthor(comment)} canDelete={isAuthor(comment) || role === "owner"} busy={busy} composer={composer} setComposer={setComposer} submit={submit} remove={remove} />
                            {replies.length > 0 && <ul className="ml-4 mt-3 space-y-2 border-l-2 border-violet-100 pl-3 sm:ml-7">{replies.map((reply) => (
                                <li key={reply._id} className="rounded-lg bg-white p-3">
                                    <CommentBody comment={reply} isAuthor={isAuthor(reply)} canDelete={isAuthor(reply) || role === "owner"} busy={busy} composer={composer} setComposer={setComposer} submit={submit} remove={remove} />
                                </li>
                            ))}</ul>}
                        </li>
                    );
                })}
            </ul>
            {composer?.mode === "new" && <Composer key="new-comment" placeholder="Add a comment for this day…" submitLabel="Comment" busy={busy} onCancel={() => setComposer(null)} onSubmit={(text) => submit(text)} />}
        </div>
    );
};

const CommentBody = ({ comment, isAuthor, canDelete, busy, composer, setComposer, submit, remove }) => (
    <div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xs font-semibold text-slate-800">{authorName(comment)}</span>
            <time className="text-[10px] text-slate-500" dateTime={comment.createdAt} title={exactCommentDate(comment.createdAt)}>{commentDate(comment.createdAt)}</time>
            {comment.editedAt && <span className="text-[10px] text-slate-400">(edited)</span>}
        </div>
        {composer?.mode === "edit" && composer.comment._id === comment._id ? (
            <Composer key={comment._id} initialText={comment.text} placeholder="Edit your comment" submitLabel="Save" busy={busy} onCancel={() => setComposer(null)} onSubmit={(text) => submit(text, null, comment._id)} />
        ) : (
            <>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700">{comment.text}</p>
                <div className="mt-1 flex gap-3">
                    {!comment.parentComment && <button type="button" disabled={busy} onClick={() => setComposer({ mode: "reply", comment })} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-violet-700"><Reply className="h-3 w-3" /> Reply</button>}
                    {isAuthor && <button type="button" disabled={busy} onClick={() => setComposer({ mode: "edit", comment })} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-violet-700"><Pencil className="h-3 w-3" /> Edit</button>}
                    {canDelete && <button type="button" disabled={busy} onClick={() => remove(comment)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-700"><Trash2 className="h-3 w-3" /> Delete</button>}
                </div>
                {composer?.mode === "reply" && composer.comment._id === comment._id && (
                    <Composer key={`reply-${comment._id}`} placeholder={`Reply to ${authorName(comment)}`} submitLabel="Reply" busy={busy} onCancel={() => setComposer(null)} onSubmit={(text) => submit(text, comment._id)} />
                )}
            </>
        )}
    </div>
);

export default DayComments;
