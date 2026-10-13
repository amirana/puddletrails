import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Country, City, State } from "country-state-city";

let allCities = null;
const getAllCities = () => {
    if (!allCities) allCities = City.getAllCities();
    return allCities;
};
const allCountries = Country.getAllCountries();

const DestinationCombobox = ({ value, onChange, error }) => {
    const [query, setQuery] = useState(value || "");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const listboxId = useId();

    const suggestions = useMemo(() => {
        if (query.trim().length < 2) return [];
        const q = query.trim().toLowerCase();

        const countryMatches = allCountries
            .filter((c) => c.name.toLowerCase().startsWith(q))
            .slice(0, 4)
            .map((c) => ({ label: c.name, type: "country" }));

        const cityMatches = getAllCities()
            .filter((c) => c.name.toLowerCase().startsWith(q))
            .slice(0, 6)
            .map((c) => {
                const country = allCountries.find(
                    (co) => co.isoCode === c.countryCode,
                );

                const state = State.getStateByCodeAndCountry(
                    c.stateCode,
                    c.countryCode,
                );

                return {
                    label: `${c.name}, ${state?.name ?? c.stateCode}, ${country?.name ?? c.countryCode}`,
                    type: "city",
                    city: c.name,
                    state: state?.name,
                    stateCode: c.stateCode,
                    country: country?.name,
                    countryCode: c.countryCode,
                };
            });

        return [...cityMatches, ...countryMatches];
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            )
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectOption = (option) => {
        setQuery(option.label);
        onChange(option.label);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(
                (prev) => (prev - 1 + suggestions.length) % suggestions.length,
            );
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            selectOption(suggestions[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                role="combobox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                    activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
                }
                aria-invalid={Boolean(error)}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(e.target.value);
                    setIsOpen(true);
                    setActiveIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="e.g. Goa, India"
                className={`w-full rounded-xl border px-3.5 py-3 text-sm font-normal text-[#29201D] outline-none transition-colors placeholder:text-[#A99A90] focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15 ${
                    error ? "border-red-400" : "border-[#EAE2D9]"
                }`}
            />
            {isOpen && suggestions.length > 0 && (
                <ul
                    id={listboxId}
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#EAE2D9] bg-white py-1 text-sm shadow-[0_12px_32px_rgba(60,40,30,0.14)]"
                >
                    {suggestions.map((option, index) => (
                        <li
                            key={`${option.type}-${option.label}`}
                            id={`${listboxId}-${index}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            onMouseDown={() => selectOption(option)}
                            className={`cursor-pointer px-4 py-2 ${
                                index === activeIndex
                                    ? "bg-[#FFF0C4]"
                                    : "hover:bg-[#FFF8F0]"
                            }`}
                        >
                            {option.label}
                            <span className="ml-1.5 text-xs text-[#9B4A3E]">
                                {option.type === "city" ? "City" : "Country"}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DestinationCombobox;
