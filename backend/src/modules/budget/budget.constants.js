const CURRENCIES = [
    "USD", "GBP", "EUR", "INR", "AED", "CAD", "AUD", "NZD",
    "SGD", "JPY", "CHF", "THB", "MYR", "HKD", "KRW",
];

// JPY and KRW are zero-decimal currencies; the other supported currencies use two decimals.
const CURRENCY_MINOR_UNIT_SCALE = Object.freeze({
    USD: 2, GBP: 2, EUR: 2, INR: 2, AED: 2, CAD: 2, AUD: 2, NZD: 2,
    SGD: 2, JPY: 0, CHF: 2, THB: 2, MYR: 2, HKD: 2, KRW: 0,
});

const EXPENSE_CATEGORIES = [
    "food", "transport", "shopping", "accommodation", "activities", "other",
];

const TRANSPORT_TYPES = ["bus", "train", "cab", "cruise", "flight", "other"];

export { CURRENCIES, CURRENCY_MINOR_UNIT_SCALE, EXPENSE_CATEGORIES, TRANSPORT_TYPES };
