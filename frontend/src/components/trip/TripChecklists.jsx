import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import {
    createChecklist,
    createChecklistItem,
    deleteChecklist,
    deleteChecklistItem,
    getChecklists,
    updateChecklist,
    updateChecklistItem,
} from "../../services/ChecklistService.js";

const TYPES = [
    { value: "packing", label: "Packing" },
    { value: "to-do", label: "To-do" },
    { value: "custom", label: "Custom" },
];

const ChecklistForm = ({ checklist, busy, onCancel, onSave }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { title: checklist?.title || "", type: checklist?.type || "packing" },
    });
    return (
        <form onSubmit={handleSubmit(onSave)} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="text-xs font-semibold text-slate-700">Type
                <select {...register("type", { required: "Choose a checklist type." })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal">
                    {TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">Checklist name
                <input autoFocus maxLength={80} placeholder="e.g. Beach day essentials" aria-invalid={Boolean(errors.title)} {...register("title", { required: "Enter a checklist name.", maxLength: { value: 80, message: "Use 80 characters or fewer." } })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                {errors.title && <span className="mt-1 block font-normal text-red-600">{errors.title.message}</span>}
            </label>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving…" : checklist ? "Save name" : "Create checklist"}</button>
            </div>
        </form>
    );
};

const ItemForm = ({ item, busy, onCancel, onSave }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { text: item?.text || "" } });
    return (
        <form onSubmit={handleSubmit(onSave)} className="flex flex-1 items-start gap-2">
            <label className="sr-only">{item ? "Edit item" : "New item"}</label>
            <div className="flex-1">
                <input autoFocus maxLength={200} placeholder="Add an item…" aria-label={item ? "Edit checklist item" : "New checklist item"} aria-invalid={Boolean(errors.text)} {...register("text", { required: "Enter an item.", maxLength: { value: 200, message: "Use 200 characters or fewer." } })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                {errors.text && <span className="text-xs font-normal text-red-600">{errors.text.message}</span>}
            </div>
            {item && <button type="button" onClick={onCancel} className="rounded-md px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>}
            <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving…" : item ? "Save" : "Add"}</button>
        </form>
    );
};

const TripChecklists = ({ tripId, accessToken, role }) => {
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadError, setLoadError] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [busy, setBusy] = useState("");
    const [creating, setCreating] = useState(false);
    const [editingChecklistId, setEditingChecklistId] = useState("");
    const [addingItemId, setAddingItemId] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const canManage = role === "owner" || role === "editor";

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError("");
            setLoadError(false);
            try {
                const response = await getChecklists(tripId, accessToken);
                if (!cancelled) setChecklists(response.data);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError.message);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [tripId, accessToken, reloadCount]);

    const replaceChecklist = (checklist) => setChecklists((current) => current.map((item) => item._id === checklist._id ? checklist : item));
    const run = async (key, action) => {
        setBusy(key);
        setError("");
        try {
            await action();
        } catch (actionError) {
            setError(actionError.message);
            throw actionError;
        } finally {
            setBusy("");
        }
    };

    const handleCreateChecklist = async (values) => {
        try {
            await run("create", async () => {
                const response = await createChecklist(tripId, values, accessToken);
                setChecklists((current) => [...current, response.data]);
                setCreating(false);
            });
        } catch { /* error is shown in the panel */ }
    };

    const handleRenameChecklist = async (checklistId, values) => {
        try {
            await run(checklistId, async () => {
                const response = await updateChecklist(tripId, checklistId, values, accessToken);
                replaceChecklist(response.data);
                setEditingChecklistId("");
            });
        } catch { /* error is shown in the panel */ }
    };

    const handleDeleteChecklist = async (checklist) => {
        if (!window.confirm(`Delete “${checklist.title}” and all its items?`)) return;
        try {
            await run(checklist._id, async () => {
                await deleteChecklist(tripId, checklist._id, accessToken);
                setChecklists((current) => current.filter((item) => item._id !== checklist._id));
            });
        } catch { /* error is shown in the panel */ }
    };

    const handleAddItem = async (checklistId, values) => {
        try {
            await run(checklistId, async () => {
                const response = await createChecklistItem(tripId, checklistId, values.text, accessToken);
                replaceChecklist(response.data);
                setAddingItemId("");
            });
        } catch { /* error is shown in the panel */ }
    };

    const handleUpdateItem = async (checklistId, itemId, updates) => {
        try {
            await run(itemId, async () => {
                const response = await updateChecklistItem(tripId, checklistId, itemId, updates, accessToken);
                replaceChecklist(response.data);
                setEditingItem(null);
            });
        } catch { /* error is shown in the panel */ }
    };

    const handleDeleteItem = async (checklistId, itemId) => {
        try {
            await run(itemId, async () => {
                const response = await deleteChecklistItem(tripId, checklistId, itemId, accessToken);
                replaceChecklist(response.data);
            });
        } catch { /* error is shown in the panel */ }
    };

    return (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Trip essentials</p>
                    <h2 className="mb-0 mt-2 !text-2xl font-semibold text-slate-900">Checklists</h2>
                    <p className="mt-1 text-sm text-slate-500">Keep track of what to bring and what still needs doing.</p>
                </div>
                {canManage && !creating && <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> New checklist</button>}
            </div>

            {error && !loadError && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
            {creating && <div className="mt-5"><ChecklistForm busy={Boolean(busy)} onCancel={() => setCreating(false)} onSave={handleCreateChecklist} /></div>}
            {loading ? (
                <div className="mt-5 space-y-3" aria-label="Loading checklists"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /></div>
            ) : loadError ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                    <p className="text-sm text-red-700">{error || "Checklists could not be loaded."}</p>
                    <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="mt-2 text-sm font-semibold text-red-800 underline">Try again</button>
                </div>
            ) : !checklists.length ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center">
                    <ClipboardList className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-slate-800">No checklists yet</p>
                    <p className="mt-1 text-xs text-slate-500">Create a packing, to-do, or custom list for this trip.</p>
                </div>
            ) : (
                <div className="mt-5 space-y-6">
                    {TYPES.map((type) => {
                        const sectionLists = checklists.filter((checklist) => checklist.type === type.value);
                        if (!sectionLists.length) return null;
                        return <section key={type.value} aria-labelledby={`checklist-type-${type.value}`}>
                            <h3 id={`checklist-type-${type.value}`} className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{type.label}</h3>
                            <div className="space-y-3">
                                {sectionLists.map((checklist) => <article key={checklist._id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                                    {editingChecklistId === checklist._id ? (
                                        <ChecklistForm checklist={checklist} busy={Boolean(busy)} onCancel={() => setEditingChecklistId("")} onSave={(values) => handleRenameChecklist(checklist._id, values)} />
                                    ) : (
                                        <div className="flex items-start justify-between gap-3">
                                            <div><h4 className="text-sm font-semibold text-slate-900">{checklist.title}</h4><p className="mt-1 text-xs text-slate-500">{checklist.items.filter((item) => item.completed).length} of {checklist.items.length} completed</p></div>
                                            {canManage && <div className="flex gap-1">
                                                <button type="button" disabled={Boolean(busy)} onClick={() => setEditingChecklistId(checklist._id)} aria-label={`Rename ${checklist.title}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-violet-700 disabled:opacity-50"><Pencil className="h-4 w-4" /></button>
                                                <button type="button" disabled={Boolean(busy)} onClick={() => handleDeleteChecklist(checklist)} aria-label={`Delete ${checklist.title}`} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                                            </div>}
                                        </div>
                                    )}
                                    {checklist.items.length > 0 ? <ul className="mt-3 divide-y divide-slate-100">{checklist.items.map((item) => <li key={item._id} className="flex items-center gap-2 py-2">
                                        <input type="checkbox" checked={item.completed} disabled={Boolean(busy)} onChange={(event) => handleUpdateItem(checklist._id, item._id, { completed: event.target.checked }).catch(() => {})} aria-label={`${item.completed ? "Mark incomplete" : "Mark complete"}: ${item.text}`} className="h-4 w-4 rounded border-slate-300 accent-violet-700" />
                                        {editingItem?.itemId === item._id ? <ItemForm key={item._id} item={item} busy={Boolean(busy)} onCancel={() => setEditingItem(null)} onSave={(values) => handleUpdateItem(checklist._id, item._id, values)} /> : <span className={`min-w-0 flex-1 break-words text-sm ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.text}</span>}
                                        {canManage && editingItem?.itemId !== item._id && <div className="flex shrink-0 gap-1">
                                            <button type="button" disabled={Boolean(busy)} onClick={() => setEditingItem({ checklistId: checklist._id, itemId: item._id })} aria-label={`Edit ${item.text}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-violet-700 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /></button>
                                            <button type="button" disabled={Boolean(busy)} onClick={() => handleDeleteItem(checklist._id, item._id).catch(() => {})} aria-label={`Delete ${item.text}`} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>
                                        </div>}
                                    </li>)}</ul> : <p className="mt-3 text-xs text-slate-500">No items yet.</p>}
                                    {canManage && (addingItemId === checklist._id ? <div className="mt-2"><ItemForm busy={Boolean(busy)} onCancel={() => setAddingItemId("")} onSave={(values) => handleAddItem(checklist._id, values)} /></div> : <button type="button" disabled={Boolean(busy)} onClick={() => setAddingItemId(checklist._id)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900 disabled:opacity-50"><Plus className="h-3.5 w-3.5" /> Add item</button>)}
                                </article>)}
                            </div>
                        </section>;
                    })}
                </div>
            )}
            {!canManage && !loading && checklists.length > 0 && <p className="mt-4 text-xs text-slate-500">You can mark items complete. Ask an Owner or Editor to change list names or items.</p>}
        </section>
    );
};

export default TripChecklists;
