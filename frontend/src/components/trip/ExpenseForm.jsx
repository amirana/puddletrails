import { useForm, useWatch } from "react-hook-form";

const CATEGORIES = [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
    { value: "shopping", label: "Shopping" },
    { value: "accommodation", label: "Accommodation" },
    { value: "activities", label: "Activities" },
    { value: "other", label: "Other" },
];

const TRANSPORT_TYPES = [
    { value: "bus", label: "Bus" },
    { value: "train", label: "Train" },
    { value: "cruise", label: "Cruise" },
    { value: "flight", label: "Flight" },
];

const currencyScale = (currency) => ["JPY", "KRW"].includes(currency) ? 0 : 2;

const today = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
};

const ExpenseForm = ({ expense, onSave, onCancel, busy, currency }) => {
    const minDate = today();
    const originalDate = expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : "";
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            amount: expense?.amount ?? "",
            description: expense?.description || "",
            category: expense?.category || "food",
            transportType: expense?.transportType || "",
            date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : today(),
        },
    });
    const category = useWatch({ control, name: "category" });
    const scale = currencyScale(currency);
    const submitExpense = (values) => {
        if (values.category !== "transport") delete values.transportType;
        return onSave(values);
    };

    return (
        <form onSubmit={handleSubmit(submitExpense)} className="grid gap-3 sm:grid-cols-2" noValidate>
            <label className="text-xs font-semibold text-[#51443E]">
                Amount ({currency})
                <input
                    type="number"
                    min="0.01"
                    step={scale === 0 ? "1" : "0.01"}
                    inputMode={scale === 0 ? "numeric" : "decimal"}
                    aria-invalid={Boolean(errors.amount)}
                    {...register("amount", {
                        required: "Enter the expense amount.",
                        valueAsNumber: true,
                        min: { value: 0.01, message: "Amount must be greater than zero." },
                        validate: (value) => {
                            if (!Number.isFinite(value)) return "Enter a valid amount.";
                            return Number.isInteger(value * (10 ** scale)) || `Use no more than ${scale} decimal places.`;
                        },
                    })}
                    className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                />
                {errors.amount && <span className="mt-1 block text-xs font-normal text-red-600">{errors.amount.message}</span>}
            </label>
            <label className="text-xs font-semibold text-[#51443E]">
                Date
                <input type="date" min={minDate} aria-invalid={Boolean(errors.date)} {...register("date", { required: "Choose the expense date.", validate: (value) => value >= minDate || value === originalDate || "Expense date cannot be before today." })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]" />
                {errors.date && <span className="mt-1 block text-xs font-normal text-red-600">{errors.date.message}</span>}
            </label>
            <label className="text-xs font-semibold text-[#51443E]">
                Category
                <select {...register("category", { required: "Choose a category." })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]">
                    {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
            </label>
            {category === "transport" && (
                <label className="text-xs font-semibold text-[#51443E]">
                    Transport type
                    <select aria-invalid={Boolean(errors.transportType)} {...register("transportType", { required: "Choose a transport type." })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]">
                        <option value="">Choose one</option>
                        {TRANSPORT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    {errors.transportType && <span className="mt-1 block text-xs font-normal text-red-600">{errors.transportType.message}</span>}
                </label>
            )}
            <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">
                Description
                <input
                    maxLength={200}
                    placeholder="e.g. Dinner at the harbour"
                    aria-invalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Add a short description.",
                        maxLength: { value: 200, message: "Use 200 characters or fewer." },
                    })}
                    className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                />
                {errors.description && <span className="mt-1 block text-xs font-normal text-red-600">{errors.description.message}</span>}
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#65554D] hover:bg-[#F1EAE2] disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-[#E9573F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#CF4639] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : expense ? "Save expense" : "Add expense"}</button>
            </div>
        </form>
    );
};

export default ExpenseForm;
