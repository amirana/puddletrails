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
        <form onSubmit={handleSubmit(onSave)} className="mt-4 grid gap-4 rounded-[1.25rem] border border-[#F0E1D5] bg-[#FFF8EF] p-4 sm:gap-5 sm:p-6 sm:grid-cols-2" noValidate>
            <label className="text-sm font-bold text-[#51443E] sm:col-span-2">
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
                    className="mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]"
                />
                {errors.title && <span className="mt-1 block text-xs font-normal text-red-600">{errors.title.message}</span>}
            </label>
            <label className="text-sm font-bold text-[#51443E]">
                Start time
                <input type="time" {...register("startTime")} className="mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]" />
            </label>
            <label className="text-sm font-bold text-[#51443E]">
                End time
                <input type="time" {...register("endTime")} className="mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]" />
            </label>
            <label className="text-sm font-bold text-[#51443E] sm:col-span-2">
                Place <span className="font-normal text-[#8C7D74]">(optional)</span>
                <input maxLength={160} placeholder="Address or place name" {...register("location")} className="mt-2 block min-h-12 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]" />
            </label>
            <label className="text-sm font-bold text-[#51443E] sm:col-span-2">
                Notes <span className="font-normal text-[#8C7D74]">(optional)</span>
                <textarea maxLength={1000} rows={3} placeholder="Anything the group should know?" {...register("description")} className="mt-2 block w-full resize-y rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-base font-normal text-[#29201D] outline-none transition placeholder:text-[#A5988E] focus:border-[#E9573F] focus:ring-4 focus:ring-[#FFE4D8]" />
            </label>
            <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="min-h-11 rounded-full px-5 py-2 text-sm font-bold text-[#65554D] transition hover:bg-[#F5EBDD] disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="min-h-11 rounded-full bg-[#E9573F] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#CF4937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : activity ? "Save changes" : "Add activity"}</button>
            </div>
        </form>
    );
};

export default ActivityForm;
