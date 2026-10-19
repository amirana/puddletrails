import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Pencil, Reply, Trash2 } from "lucide-react";
import { createDayComment, deleteDayComment, updateDayComment } from "../../services/DayCommentService.js";
import posthog, { isPostHogConfigured } from "../../services/posthog.js";

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
                className="block w-full resize-y rounded-xl border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm text-[#29201D] placeholder:text-[#9A8B80] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15"
            />
            {errors.text && <p className="mt-1 text-xs text-red-600">{errors.text.message}</p>}
            <div className="mt-2 flex justify-end gap-2">
                {onCancel && <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-full px-3.5 py-2 text-xs font-semibold text-[#65554D] transition hover:bg-[#F4EEE7]">Cancel</button>}
                <button type="submit" disabled={busy || isSubmitting} className="rounded-full bg-[#E9573F] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#D94B35] disabled:opacity-50">{isSubmitting ? "Saving…" : submitLabel}</button>
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
                if (isPostHogConfigured) {
                    posthog.capture("day_comment_added", {
                        is_reply: Boolean(parentCommentId),
                    });
                }
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
        <div className="mt-3 border-t border-[#EAE2D9] pt-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#29201D]">
                    <MessageCircle className="h-4 w-4 text-[#E9573F]" />
                    <span>Conversation</span>
                    <span className="rounded-full bg-[#FFF0DF] px-2 py-0.5 text-[11px] font-semibold text-[#9B4A3E]">{comments.length}</span>
                </div>
                {!composer && <button type="button" onClick={() => setComposer({ mode: "new" })} className="text-xs font-bold text-[#C94F46] transition hover:text-[#9B4A3E]">Add comment</button>}
            </div>
            {error && <p role="alert" className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">{error}</p>}
            <ul className="mt-2 divide-y divide-[#EEE7DF]">
                {roots.map((comment) => {
                    const replies = comments.filter((item) => String(item.parentComment) === comment._id);
                    return (
                        <li key={comment._id} className="py-4 first:pt-1 last:pb-0">
                            <CommentBody comment={comment} isAuthor={isAuthor(comment)} canDelete={isAuthor(comment) || role === "owner"} busy={busy} composer={composer} setComposer={setComposer} submit={submit} remove={remove} />
                            {replies.length > 0 && <ul className="ml-3 mt-4 space-y-2 border-l-2 border-[#F4D6C5] pl-3 sm:ml-7">{replies.map((reply) => (
                                <li key={reply._id} className="py-2 first:pt-0 last:pb-0">
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
        <div className="flex items-start gap-3">
            <div aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFE5D9] text-[10px] font-bold uppercase tracking-wide text-[#9B4A3E]">
                {authorName(comment).split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-[#29201D]">{authorName(comment)}</span>
                    <time className="text-[11px] text-[#8C7C72]" dateTime={comment.createdAt} title={exactCommentDate(comment.createdAt)}>{commentDate(comment.createdAt)}</time>
                    {comment.editedAt && <span className="text-[10px] text-[#9A8B80]">(edited)</span>}
                </div>
        {composer?.mode === "edit" && composer.comment._id === comment._id ? (
            <Composer key={comment._id} initialText={comment.text} placeholder="Edit your comment" submitLabel="Save" busy={busy} onCancel={() => setComposer(null)} onSubmit={(text) => submit(text, null, comment._id)} />
        ) : (
            <>
                <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-[#51443D]">{comment.text}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                    {!comment.parentComment && <button type="button" disabled={busy} onClick={() => setComposer({ mode: "reply", comment })} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7C72] transition hover:text-[#9B4A3E] disabled:opacity-50"><Reply className="h-3 w-3" /> Reply</button>}
                    {isAuthor && <button type="button" disabled={busy} onClick={() => setComposer({ mode: "edit", comment })} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7C72] transition hover:text-[#9B4A3E] disabled:opacity-50"><Pencil className="h-3 w-3" /> Edit</button>}
                    {canDelete && <button type="button" disabled={busy} onClick={() => remove(comment)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7C72] transition hover:text-red-700 disabled:opacity-50"><Trash2 className="h-3 w-3" /> Delete</button>}
                </div>
                {composer?.mode === "reply" && composer.comment._id === comment._id && (
                    <Composer key={`reply-${comment._id}`} placeholder={`Reply to ${authorName(comment)}`} submitLabel="Reply" busy={busy} onCancel={() => setComposer(null)} onSubmit={(text) => submit(text, comment._id)} />
                )}
            </>
        )}
            </div>
        </div>
    </div>
);

export default DayComments;
