import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CircleDollarSign, Pencil, Plus, Trash2, Wallet, X } from "lucide-react";
import ExpenseForm from "./ExpenseForm.jsx";
import {
    createExpense,
    deleteExpense,
    getBudget,
    updateBudget,
    updateExpense,
} from "../../services/BudgetService.js";

const CURRENCIES = [
    ["USD", "US Dollar", 2],
    ["GBP", "British Pound", 2],
    ["EUR", "Euro", 2],
    ["INR", "Indian Rupee", 2],
    ["AED", "UAE Dirham", 2],
    ["CAD", "Canadian Dollar", 2],
    ["AUD", "Australian Dollar", 2],
    ["NZD", "New Zealand Dollar", 2],
    ["SGD", "Singapore Dollar", 2],
    ["JPY", "Japanese Yen", 0],
    ["CHF", "Swiss Franc", 2],
    ["THB", "Thai Baht", 2],
    ["MYR", "Malaysian Ringgit", 2],
    ["HKD", "Hong Kong Dollar", 2],
    ["KRW", "South Korean Won", 0],
];

const currencyScale = (currency) => CURRENCIES.find(([code]) => code === currency)?.[2] ?? 2;

const CATEGORY_LABELS = {
    food: "Food",
    transport: "Transport",
    shopping: "Shopping",
    accommodation: "Accommodation",
    activities: "Activities",
    other: "Other",
};

const formatMoney = (amount, currency) => new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
}).format(amount);

const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
});

const BudgetSettingsForm = ({ budget, onSave, onCancel, error, busy }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            totalBudget: budget?.totalBudget ?? 0,
            currency: budget?.currency || "",
        },
    });
    const selectedCurrency = watch("currency");
    const currencyLocked = Boolean(budget?.currency);
    const scale = currencyScale(currencyLocked ? budget.currency : selectedCurrency);
    const amountStep = scale === 0 ? "1" : "0.01";
    const submitBudget = (values) => onSave({
        ...values,
        currency: currencyLocked ? budget.currency : values.currency,
    });

    return (
        <form onSubmit={handleSubmit(submitBudget)} className="mt-4 max-w-4xl rounded-2xl bg-[#FFF4E3]/65 p-4 sm:p-5" noValidate>
            <div className="mb-4">
                <p className="text-sm font-semibold text-[#29201D]">Set your trip budget</p>
                <p className="mt-1 text-xs text-[#786A62]">Choose a shared spending limit and the currency you’ll track.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <label className="text-sm font-semibold text-[#51443E]">
                    Total budget
                    <input
                        type="number"
                        min="0"
                        step={amountStep}
                        inputMode={scale === 0 ? "numeric" : "decimal"}
                        aria-invalid={Boolean(errors.totalBudget)}
                        {...register("totalBudget", {
                            required: "Enter a budget amount.",
                            valueAsNumber: true,
                            min: { value: 0, message: "Budget cannot be negative." },
                            validate: (value) => {
                                if (!Number.isFinite(value)) return "Enter a valid amount.";
                                return Number.isInteger(value * (10 ** scale)) || `Use no more than ${scale} decimal places.`;
                            },
                        })}
                        className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8]"
                    />
                    {errors.totalBudget && <span className="mt-1 block text-xs font-normal text-red-600">{errors.totalBudget.message}</span>}
                </label>
                <label className="text-sm font-semibold text-[#51443E]">
                    Currency
                    <select
                        disabled={currencyLocked}
                        aria-invalid={Boolean(errors.currency)}
                        {...register("currency", { required: "Choose a currency." })}
                        className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#E9573F] focus:ring-2 focus:ring-[#FFE4D8] disabled:bg-[#F7F0E8] disabled:text-[#786A62]"
                    >
                        <option value="">Choose a currency</option>
                        {CURRENCIES.map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}
                    </select>
                    {errors.currency && <span className="mt-1 block text-xs font-normal text-red-600">{errors.currency.message}</span>}
                </label>
            </div>
            <p className="mt-4 max-w-3xl border-l-2 border-[#FFD34E] pl-3 text-xs leading-5 text-[#78543F]">
                {currencyLocked
                    ? `This trip uses ${budget.currency}. Currency conversion isn’t available yet.`
                    : "Currency can’t be changed after saving. Choose the currency your group will use for trip expenses."}
            </p>
            {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
                {onCancel && <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#65554D] hover:bg-[#F1EAE2] disabled:opacity-50">Cancel</button>}
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-[#E9573F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#CF4639] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : currencyLocked ? "Save budget" : "Save budget & currency"}</button>
            </div>
        </form>
    );
};

const TripBudget = ({ tripId, accessToken, canEdit }) => {
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [formError, setFormError] = useState("");
    const [busy, setBusy] = useState(false);
    const [editingBudget, setEditingBudget] = useState(false);
    const [expenseEditor, setExpenseEditor] = useState(null);
    const [expenseError, setExpenseError] = useState("");
    const [busyExpenseId, setBusyExpenseId] = useState("");
    const [deleteConfirmationId, setDeleteConfirmationId] = useState("");

    const loadBudget = useCallback(async () => {
        setLoadError("");
        try {
            const response = await getBudget(tripId, accessToken);
            setBudget(response.data);
        } catch (error) {
            setLoadError(error.message);
        }
    }, [tripId, accessToken]);

    useEffect(() => {
        let cancelled = false;
        getBudget(tripId, accessToken)
            .then((response) => {
                if (!cancelled) setBudget(response.data);
            })
            .catch((error) => {
                if (!cancelled) setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [tripId, accessToken]);

    const retryLoading = async () => {
        setLoading(true);
        await loadBudget();
        setLoading(false);
    };

    const handleBudgetSave = async (values) => {
        setBusy(true);
        setFormError("");
        try {
            const response = await updateBudget(tripId, {
                totalBudget: values.totalBudget,
                currency: values.currency,
            }, accessToken);
            setBudget(response.data);
            setEditingBudget(false);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setBusy(false);
        }
    };

    const handleExpenseSave = async (values) => {
        setBusyExpenseId(expenseEditor?.expense?._id || "new");
        setExpenseError("");
        try {
            if (expenseEditor?.expense) {
                await updateExpense(tripId, expenseEditor.expense._id, values, accessToken);
            } else {
                await createExpense(tripId, values, accessToken);
            }
            setExpenseEditor(null);
            await loadBudget();
        } catch (error) {
            setExpenseError(error.message);
        } finally {
            setBusyExpenseId("");
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (deleteConfirmationId !== expenseId) {
            setDeleteConfirmationId(expenseId);
            return;
        }
        setBusyExpenseId(expenseId);
        setExpenseError("");
        try {
            await deleteExpense(tripId, expenseId, accessToken);
            setDeleteConfirmationId("");
            await loadBudget();
        } catch (error) {
            setExpenseError(error.message);
        } finally {
            setBusyExpenseId("");
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Trip money</p>
                    <h2 className="mb-0 mt-1 !text-xl font-extrabold text-[#29201D]">Budget</h2>
                    <p className="mt-1 text-xs text-[#786A62]">Keep shared trip costs visible as they add up.</p>
                </div>
                {budget?.currency && canEdit && !editingBudget && (
                    <button type="button" onClick={() => { setFormError(""); setEditingBudget(true); }} className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE2D9] px-3 py-2 text-xs font-semibold text-[#51443E] hover:bg-[#FFFCF7]">
                        <Pencil className="h-3.5 w-3.5" /> Edit budget
                    </button>
                )}
            </div>

            {loading ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Loading trip budget">
                    <div className="h-24 animate-pulse rounded-2xl bg-[#F7F0E8]" />
                    <div className="h-24 animate-pulse rounded-2xl bg-[#F7F0E8]" />
                    <div className="h-24 animate-pulse rounded-2xl bg-[#F7F0E8]" />
                </div>
            ) : loadError ? (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p>{loadError}</p>
                    <button type="button" onClick={retryLoading} className="mt-2 font-semibold underline">Try again</button>
                </div>
            ) : budget && !budget.currency ? (
                <>
                    <p className="mt-4 text-sm text-[#65554D]">Set the budget amount and choose the currency your group will use for every expense.</p>
                    {canEdit ? (
                        <BudgetSettingsForm budget={budget} onSave={handleBudgetSave} error={formError} busy={busy} />
                    ) : (
                        <p className="mt-4 rounded-xl bg-[#FFFCF7] px-4 py-3 text-sm text-[#65554D]">The trip owner or an editor needs to choose a budget currency before expenses can be added.</p>
                    )}
                </>
            ) : budget && (
                <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <SummaryCard label="Total budget" amount={budget.totalBudget} currency={budget.currency} icon={<Wallet className="h-4 w-4" />} accent="yellow" />
                        <SummaryCard label="Total spent" amount={budget.totalSpent} currency={budget.currency} icon={<CircleDollarSign className="h-4 w-4" />} accent="coral" />
                        <SummaryCard label="Remaining" amount={budget.remaining} currency={budget.currency} icon={<CircleDollarSign className="h-4 w-4" />} accent="green" negative={budget.remaining < 0} />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#786A62]">Currency is locked to {budget.currency} for this trip. Conversion isn’t available yet.</p>

                    {editingBudget && (
                        <BudgetSettingsForm
                            budget={budget}
                            onSave={handleBudgetSave}
                            onCancel={() => { setEditingBudget(false); setFormError(""); }}
                            error={formError}
                            busy={busy}
                        />
                    )}

                    <div className="mt-5 border-t border-[#F1EAE2] pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-semibold text-[#29201D]">Expenses</h3>
                                <p className="mt-1 text-xs text-[#786A62]">Every expense is recorded in {budget.currency}.</p>
                            </div>
                            {canEdit && !expenseEditor && (
                                <button type="button" onClick={() => { setExpenseError(""); setDeleteConfirmationId(""); setExpenseEditor({ mode: "create" }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E9573F] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#CF4639]">
                                    <Plus className="h-4 w-4" /> Add expense
                                </button>
                            )}
                        </div>

                        {expenseError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{expenseError}</p>}
                        {budget.expenses.length === 0 ? (
                            <div className="mt-4 rounded-2xl bg-[#FFF8F0] px-4 py-6 text-center">
                                <p className="text-sm font-medium text-[#51443E]">No expenses yet</p>
                                <p className="mt-1 text-xs text-[#786A62]">Add the first shared cost to start tracking your trip spend.</p>
                            </div>
                        ) : (
                            <ul className="mt-4 divide-y divide-[#F1EAE2]">
                                {budget.expenses.map((expense) => (
                                        <li key={expense._id} className="py-3 first:pt-1 last:pb-0">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[#29201D]">{expense.description}</p>
                                                    <p className="mt-1 text-xs text-[#786A62]">
                                                        {CATEGORY_LABELS[expense.category]}{expense.transportType ? ` · ${expense.transportType[0].toUpperCase()}${expense.transportType.slice(1)}` : ""} · {formatDate(expense.date)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold tabular-nums text-[#29201D]">{formatMoney(expense.amount, budget.currency)}</span>
                                                    {canEdit && (
                                                        <>
                                                            <button type="button" onClick={() => { setExpenseError(""); setDeleteConfirmationId(""); setExpenseEditor({ mode: "edit", expense }); }} disabled={Boolean(busyExpenseId)} className="rounded-md p-1.5 text-[#786A62] hover:bg-[#F7F0E8] hover:text-[#C94F3D] disabled:opacity-50" aria-label={`Edit ${expense.description}`}><Pencil className="h-3.5 w-3.5" /></button>
                                                            {deleteConfirmationId === expense._id ? (
                                                                <>
                                                                    <button type="button" onClick={() => handleDeleteExpense(expense._id)} disabled={Boolean(busyExpenseId)} className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Confirm</button>
                                                                    <button type="button" onClick={() => setDeleteConfirmationId("")} className="rounded-md px-2 py-1 text-xs text-[#786A62] hover:bg-[#F7F0E8]">Cancel</button>
                                                                </>
                                                            ) : (
                                                                <button type="button" onClick={() => handleDeleteExpense(expense._id)} disabled={Boolean(busyExpenseId)} className="rounded-md p-1.5 text-[#786A62] hover:bg-red-50 hover:text-red-700 disabled:opacity-50" aria-label={`Delete ${expense.description}`}><Trash2 className="h-3.5 w-3.5" /></button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
            {expenseEditor && budget?.currency && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#29201D]/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !busyExpenseId) setExpenseEditor(null); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="expense-dialog-title" className="my-auto w-full max-w-xl rounded-3xl bg-[#FFFCF7] p-5 shadow-[0_24px_80px_rgba(41,32,29,0.24)] sm:p-6">
                        <div className="mb-4 flex items-start justify-between gap-4"><div><p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Trip money</p><h2 id="expense-dialog-title" className="mb-0 mt-1 text-xl font-extrabold text-[#29201D]">{expenseEditor.expense ? "Edit expense" : "Add an expense"}</h2><p className="mt-1 text-xs text-[#786A62]">Recorded in {budget.currency}.</p></div><button type="button" onClick={() => setExpenseEditor(null)} disabled={Boolean(busyExpenseId)} aria-label="Close expense form" className="rounded-full p-2 text-[#786A62] hover:bg-[#F5EFE8] disabled:opacity-50"><X className="h-5 w-5" /></button></div>
                        <ExpenseForm expense={expenseEditor.expense} currency={budget.currency} onSave={handleExpenseSave} onCancel={() => setExpenseEditor(null)} busy={Boolean(busyExpenseId)} />
                    </section>
                </div>
            )}
        </section>
    );
};

const SummaryCard = ({ label, amount, currency, icon, accent = "coral", negative = false }) => (
    <div className={`rounded-2xl px-4 py-3 ${accent === "yellow" ? "bg-[#FFF4D0]" : accent === "green" ? "bg-[#EDF3E8]" : "bg-[#FFF0E8]"}`}>
        <div className="flex items-center gap-2 text-xs font-medium text-[#786A62]"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${accent === "yellow" ? "bg-[#FFD34E] text-[#51443E]" : accent === "green" ? "bg-[#7D9869] text-white" : "bg-[#FFE4D8] text-[#C94F46]"}`}>{icon}</span>{label}</div>
        <p className={`mt-2 text-xl font-extrabold tabular-nums ${negative ? "text-red-700" : "text-[#29201D]"}`}>
            {formatMoney(amount, currency)}
        </p>
    </div>
);

export default TripBudget;
