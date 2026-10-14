import { useMemo, useState } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();

const ExplorePlacesMap = ({ destination, enabled = true }) => {
    const area = destination?.trim();
    const defaultQuery = area ? `attractions in ${area}` : "popular attractions";
    const [searchText, setSearchText] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState(null);
    const [searchError, setSearchError] = useState("");
    const query = submittedQuery ?? defaultQuery;
    const searchUrl = useMemo(() => {
        const params = new URLSearchParams({ api: "1", query });
        return `https://www.google.com/maps/search/?${params.toString()}`;
    }, [query]);
    const embedUrl = useMemo(() => {
        if (!apiKey) return "";
        const params = new URLSearchParams({ key: apiKey, q: query, zoom: "12" });
        return `https://www.google.com/maps/embed/v1/search?${params.toString()}`;
    }, [query]);
    const [failedUrl, setFailedUrl] = useState("");
    const mapError = failedUrl === embedUrl;

    const handleSearch = (event) => {
        event.preventDefault();
        const nextQuery = searchText.trim();
        if (!nextQuery || !/[\p{L}\p{N}]/u.test(nextQuery) || nextQuery.length > 500) {
            setSearchError("Enter a place or area to search (up to 500 characters).");
            return;
        }
        setSearchError("");
        setSubmittedQuery(nextQuery);
    };

    return (
        <section aria-labelledby="explore-places-title" className="mt-6 border-y border-[#EEE7DF] py-5 sm:py-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0DF] text-[#C94F46]">
                        <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 id="explore-places-title" className="mb-0 text-lg font-extrabold text-[#29201D]">Explore places</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-5 text-[#786A62]">
                            Browse places on the map, then add your pick to an itinerary activity.
                        </p>
                    </div>
                </div>
                <a href={searchUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#9B4A3E] transition hover:bg-[#FFF2E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                    Open Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
            </div>

            <form
                className="mb-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={handleSearch}
            >
                <label className="sr-only" htmlFor="explore-places-search">Search places or an area</label>
                <input
                    id="explore-places-search"
                    type="search"
                    value={searchText}
                    onChange={(event) => {
                        setSearchText(event.target.value);
                        if (searchError) setSearchError("");
                    }}
                    aria-invalid={Boolean(searchError)}
                    aria-describedby={searchError ? "explore-places-search-error" : undefined}
                    placeholder="Try cafés in Paris or restaurants in London"
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#E9D9CA] bg-white px-4 text-sm text-[#29201D] placeholder:text-[#9A8C83] focus:border-[#C94F46] focus:outline-none focus:ring-2 focus:ring-[#C94F46]/15"
                />
                <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E9573F] px-5 text-sm font-bold text-white transition hover:bg-[#CF4937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                    <Search className="h-4 w-4" aria-hidden="true" /> Search map
                </button>
            </form>
            {searchError && <p id="explore-places-search-error" className="-mt-2 mb-4 text-sm font-medium text-[#B23D32]" role="alert">{searchError}</p>}

            {!apiKey ? (
                <div className="flex min-h-28 flex-col items-start justify-center gap-2 rounded-2xl bg-[#FFF8EF] px-5 py-4 text-sm text-[#65554D]">
                    <p className="font-semibold text-[#51443E]">The map isn’t configured yet.</p>
                    <p>Add <code className="rounded bg-white px-1.5 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to the frontend environment and rebuild to show the embedded map.</p>
                    <a href={searchUrl} target="_blank" rel="noreferrer" className="font-bold text-[#C94F46] underline-offset-4 hover:underline">Explore this area in Google Maps</a>
                </div>
            ) : mapError ? (
                <div className="flex min-h-28 flex-col items-start justify-center gap-2 rounded-2xl bg-[#FFF8EF] px-5 py-4 text-sm text-[#65554D]" role="status">
                    <p className="font-semibold text-[#51443E]">The embedded map couldn’t be displayed.</p>
                    <a href={searchUrl} target="_blank" rel="noreferrer" className="font-bold text-[#C94F46] underline-offset-4 hover:underline">Continue in Google Maps</a>
                </div>
            ) : enabled ? (
                <>
                    <iframe
                        title={`Explore places: ${query}`}
                        src={embedUrl}
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        onError={() => setFailedUrl(embedUrl)}
                        className="block h-[340px] w-full rounded-2xl border border-[#E9D9CA] bg-[#F5EFE8] sm:h-[420px]"
                    />
                    <p className="mt-2 text-xs text-[#8C7D74]">Map not showing? <a href={searchUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#9B4A3E] underline-offset-4 hover:underline">Open the search in Google Maps</a>.</p>
                </>
            ) : (
                <div aria-hidden="true" className="h-[340px] w-full rounded-2xl bg-[#F5EFE8] sm:h-[420px]" />
            )}
        </section>
    );
};

export default ExplorePlacesMap;
