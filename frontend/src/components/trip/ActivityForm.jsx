import { useForm } from "react-hook-form";

const ActivityForm = ({ activity, onSave, onCancel, busy }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: activity?.title || "",
            startTime: activity?.startTime || "",
            endTime: activity?.endTime || "",
            location: activity?.location || "",
            description: activity?.description || "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSave)} className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2" noValidate>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">
                Activity name
                <input
                    autoFocus
                    maxLength={120}
                    placeholder="e.g. Walk around the old town"
                    aria-invalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Give this activity a name.",
                        maxLength: { value: 120, message: "Use 120 characters or fewer." },
                    })}
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
                {errors.title && <span className="mt-1 block text-xs font-normal text-red-600">{errors.title.message}</span>}
            </label>
            <label className="text-xs font-semibold text-slate-700">
                Start time
                <input type="time" {...register("startTime")} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
            </label>
            <label className="text-xs font-semibold text-slate-700">
                End time
                <input type="time" {...register("endTime")} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
            </label>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">
                Place <span className="font-normal text-slate-400">(optional)</span>
                <input maxLength={160} placeholder="Address or place name" {...register("location")} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
            </label>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">
                Notes <span className="font-normal text-slate-400">(optional)</span>
                <textarea maxLength={1000} rows={2} placeholder="Anything the group should know?" {...register("description")} className="mt-1.5 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : activity ? "Save changes" : "Add activity"}</button>
            </div>
        </form>
    );
};

export default ActivityForm;
