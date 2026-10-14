import { useForm } from "react-hook-form";

const ActivityForm = ({ activity, onSave, onCancel, busy }) => {
    const {
        register,
        handleSubmit,
        getValues,
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
        <form onSubmit={handleSubmit(onSave)} className="grid gap-x-3 gap-y-3 sm:grid-cols-2" noValidate>
            <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">
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
                    className="mt-1.5 block h-10 w-full rounded-xl border border-[#E9D9CA] bg-white px-3 text-sm font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                />
                {errors.title && <span className="mt-1 block text-xs font-normal text-red-600">{errors.title.message}</span>}
            </label>
            <label className="text-xs font-semibold text-[#51443E]">
                Start time <span className="text-[#E9573F]" aria-hidden="true">*</span>
                <input type="time" required aria-invalid={Boolean(errors.startTime)} {...register("startTime", { required: "Choose a start time." })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E9D9CA] bg-white px-3 text-sm font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
                {errors.startTime && <span className="mt-1 block text-xs font-normal text-red-600">{errors.startTime.message}</span>}
            </label>
            <label className="text-xs font-semibold text-[#51443E]">
                End time <span className="text-[#E9573F]" aria-hidden="true">*</span>
                <input type="time" required aria-invalid={Boolean(errors.endTime)} {...register("endTime", { required: "Choose an end time.", validate: (value) => !getValues("startTime") || value > getValues("startTime") || "End time must be later than start time." })} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E9D9CA] bg-white px-3 text-sm font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
                {errors.endTime && <span className="mt-1 block text-xs font-normal text-red-600">{errors.endTime.message}</span>}
            </label>
            <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">
                Place <span className="font-normal text-[#8C7D74]">(optional)</span>
                <input maxLength={160} placeholder="Address or place name" {...register("location")} className="mt-1.5 block h-10 w-full rounded-xl border border-[#E9D9CA] bg-white px-3 text-sm font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
            </label>
            <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">
                Notes <span className="font-normal text-[#8C7D74]">(optional)</span>
                <textarea maxLength={1000} rows={2} placeholder="Anything the group should know?" {...register("description")} className="mt-1.5 block w-full resize-y rounded-xl border border-[#E9D9CA] bg-white px-3 py-2.5 text-sm font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
            </label>
            <div className="flex flex-row-reverse items-center gap-2 pt-1 sm:col-span-2">
                <button type="submit" disabled={busy || isSubmitting} className="min-h-10 rounded-full bg-[#E9573F] px-4 py-2 text-sm font-bold text-white shadow-[0_3px_0_#C94F46] transition hover:-translate-y-0.5 hover:bg-[#CF4937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : activity ? "Save activity" : "Add activity"}</button>
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="min-h-10 rounded-full px-4 py-2 text-sm font-semibold text-[#65554D] transition hover:bg-[#F5EBDD] disabled:opacity-50">Cancel</button>
            </div>
        </form>
    );
};

export default ActivityForm;
