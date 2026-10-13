import { useEffect, useRef } from "react";
import {
    ArrowRight,
    Backpack,
    CalendarDays,
    Compass,
    Map,
    MapPin,
    Plane,
    Sun,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import tripIllustration from "../assets/illustration1.png";
import travelIllustration from "../assets/illustration2.png";
import logo from "../assets/logo.png";
import autumnLeaf from "../assets/autumn-leaf.svg";
import { buttonStyles } from "../components/ui/buttonStyles.js";
import Footer from "../components/layout/Footer.jsx";

const primaryButton = buttonStyles();
const iconTile =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl";
const photoBadge =
    "inline-flex items-center gap-2 rounded-full bg-[#FFD34E] px-3 py-2 text-xs font-bold text-[#29201D] shadow-md";

const LandingPage = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        const page = pageRef.current;
        if (!page) return undefined;

        const sections = page.querySelectorAll("[data-scroll-reveal]");
        page.classList.add("landing-reveal-ready");

        if (!("IntersectionObserver" in window)) {
            sections.forEach((section) => section.classList.add("is-visible"));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={pageRef}
            className="min-h-screen overflow-hidden bg-[#FFFCF7] font-copy text-[#29201D]"
        >
            <header className="px-5 py-2 sm:px-8">
                <nav
                    aria-label="Main navigation"
                    className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4"
                >
                    <Link
                        to="/"
                        aria-label="PuddleTrails home"
                        className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9573F]"
                    >
                        <img
                            src={logo}
                            alt="PuddleTrails"
                            className="h-12 w-auto mix-blend-multiply sm:h-14"
                        />
                    </Link>
                    <div className="flex items-center gap-1 sm:gap-4">
                        <Link
                            to="/login"
                            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#65554D] transition-colors hover:bg-[#FFF2E8] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] sm:inline-flex"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className={buttonStyles({ size: "compact" })}
                        >
                            Sign up{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                <section
                    data-scroll-reveal
                    className="px-5 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-20"
                >
                    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#E9D9CA] bg-[#FFF2E8] px-4 py-2 font-label text-[10px] font-bold uppercase tracking-[0.08em] text-[#9B4A3E] sm:text-xs">
                            <MapPin className="h-4 w-4" aria-hidden="true" />{" "}
                            Your group trip, out of the group chat
                        </p>
                        <h1 className="!mb-0 mt-6 max-w-5xl font-copy !text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:!text-5xl lg:!text-[3.5rem]">
                            Your whole trip,
                            <span className="mt-2 block text-[#D95140]">
                                in one happy place.
                            </span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-6 text-[#65554D] sm:text-base sm:leading-7">
                            Bring your crew, pick your plans, and keep all the
                            little trip details together.
                        </p>
                        <Link
                            to="/signup"
                            className={buttonStyles({
                                size: "inline",
                                className: "mt-6",
                            })}
                        >
                            Start planning{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>

                <section
                    data-scroll-reveal
                    id="trip-board"
                    aria-labelledby="trip-board-title"
                    className="px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14"
                >
                    <div className="mx-auto max-w-[1440px] rounded-[2rem] bg-[#FFF0DF] p-3 sm:p-6 lg:p-8">
                        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-2 sm:px-3">
                            <div>
                                <p className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">
                                    <img
                                        src={autumnLeaf}
                                        alt=""
                                        className="autumn-leaf h-4 w-4 opacity-70"
                                    />{" "}
                                    A sample PuddleTrails trip
                                </p>
                                <h2
                                    id="trip-board-title"
                                    className="mb-0 mt-3 text-2xl font-extrabold leading-tight sm:text-3xl"
                                >
                                    The long weekend, all mapped out.
                                </h2>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#51443E] shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#E9573F]" />{" "}
                                3 pals planning
                            </span>
                        </div>
                        <div className="grid overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(60,40,30,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="relative min-h-[340px] overflow-hidden sm:min-h-[460px]">
                                <img
                                    src={tripIllustration}
                                    alt="Three travel companions planning their route beside a sunny island coast"
                                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#29201D]/75 via-[#29201D]/5 to-[#29201D]/10"
                                    aria-hidden="true"
                                />
                                <div
                                    className={`absolute left-4 top-4 sm:left-6 sm:top-6 ${photoBadge}`}
                                >
                                    <MapPin
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />{" "}
                                    Bali, Indonesia
                                </div>
                                <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-8 sm:left-8">
                                    <p className="inline-flex rounded-full bg-[#C94F46] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                                        Sep 12 — 17{" "}
                                        <span
                                            className="mx-1.5"
                                            aria-hidden="true"
                                        >
                                            ·
                                        </span>{" "}
                                        5 days
                                    </p>
                                    <p className="mt-3 max-w-lg text-3xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                                        Out of office.
                                        <br />
                                        Into the blue.
                                    </p>
                                </div>
                                <div className="absolute bottom-6 right-5 hidden h-14 w-14 rotate-6 items-center justify-center rounded-2xl bg-[#FFD34E] text-[#29201D] shadow-lg sm:flex">
                                    <Plane
                                        className="h-6 w-6 -rotate-12"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                                <div className="flex items-center justify-between border-b border-[#EAE2D9] pb-5">
                                    <div>
                                        <p className="font-label text-[10px] font-bold uppercase tracking-[0.08em] text-[#C94F46]">
                                            Your itinerary
                                        </p>
                                        <p className="mt-1 text-2xl font-extrabold tracking-tight">
                                            A few good days
                                        </p>
                                    </div>
                                    <CalendarDays
                                        className="h-5 w-5 text-[#D95140]"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="relative mt-5 flex-1 space-y-4 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:border-l-2 before:border-dashed before:border-[#E8B899]">
                                    {[
                                        [
                                            "FRI · ARRIVE",
                                            "Land, unpack, exhale",
                                            "Stay near Canggu",
                                        ],
                                        [
                                            "SAT · WANDER",
                                            "Rice fields & tiny cafés",
                                            "Keep the afternoon open",
                                        ],
                                        [
                                            "SUN · SLOW DOWN",
                                            "A beach day with the crew",
                                            "Sunset dinner, 6:30",
                                        ],
                                    ].map(([day, title, note], index) => (
                                        <div
                                            key={day}
                                            className="relative flex gap-4"
                                        >
                                            <span
                                                className={`z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-[3px] border-white ${index === 1 ? "bg-[#F3B94E]" : "bg-[#E9573F]"}`}
                                            />
                                            <div className="min-w-0 flex-1 border-b border-[#EEE7DF] pb-3">
                                                <p className="font-label text-[9px] font-bold tracking-[0.08em] text-[#88766B]">
                                                    {day}
                                                </p>
                                                <p className="mt-1 font-bold">
                                                    {title}
                                                </p>
                                                <p className="mt-1 text-xs text-[#786A62]">
                                                    {note}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#FFF4E3] p-3 sm:p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD34E] text-[#29201D]">
                                            <Users
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold">
                                                The whole crew, in sync
                                            </p>
                                            <p className="text-[10px] text-[#786A62]">
                                                Dates, notes & plans together
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className="flex -space-x-2"
                                        aria-label="Three trip members"
                                    >
                                        <span className="h-7 w-7 rounded-full border-2 border-white bg-[#E9573F]" />
                                        <span className="h-7 w-7 rounded-full border-2 border-white bg-[#FFD34E]" />
                                        <span className="h-7 w-7 rounded-full border-2 border-white bg-[#F1B57D]" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    data-scroll-reveal
                    id="features"
                    className="px-5 py-14 sm:px-8 sm:py-20"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF0DF] px-4 py-2 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">
                                <Compass className="h-4 w-4" /> The trip,
                                together
                            </p>
                            <h2 className="mb-0 mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                                The good bits go better{" "}
                                <span className="text-[#D95140]">
                                    together.
                                </span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#65554D]">
                                Your people, plans, and all the little trip
                                details, together in one place.
                            </p>
                        </div>
                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            <article className="rounded-2xl border border-[#EAE2D9] bg-white p-6 shadow-[0_6px_22px_rgba(60,40,30,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(60,40,30,0.08)] sm:p-8">
                                <span className={`${iconTile} bg-[#FFF0C4]`}>
                                    <Map
                                        className="h-6 w-6 text-[#9C5D18]"
                                        aria-hidden="true"
                                    />
                                </span>
                                <p className="mt-7 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">
                                    01 · Make the plan
                                </p>
                                <h3 className="mb-0 mt-3 text-2xl font-extrabold leading-tight tracking-tight">
                                    Days with room to wander.
                                </h3>
                                <p className="mb-0 mt-3 text-base leading-7 text-[#65554D]">
                                    Add ideas to the itinerary, organize
                                    activities by day, and keep the plan
                                    flexible.
                                </p>
                            </article>
                            <article className="rounded-2xl border border-[#EAE2D9] bg-white p-6 shadow-[0_6px_22px_rgba(60,40,30,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(60,40,30,0.08)] sm:p-8">
                                <span className={`${iconTile} bg-[#FFE4D8]`}>
                                    <Users
                                        className="h-6 w-6 text-[#C94F46]"
                                        aria-hidden="true"
                                    />
                                </span>
                                <p className="mt-7 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">
                                    02 · Bring your people
                                </p>
                                <h3 className="mb-0 mt-3 text-2xl font-extrabold leading-tight tracking-tight">
                                    One crew. One shared plan.
                                </h3>
                                <p className="mb-0 mt-3 text-base leading-7 text-[#65554D]">
                                    Invite everyone and choose roles that help
                                    the whole crew stay in the loop.
                                </p>
                            </article>
                            <article className="rounded-2xl border border-[#EAE2D9] bg-white p-6 shadow-[0_6px_22px_rgba(60,40,30,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(60,40,30,0.08)] sm:p-8">
                                <span className={`${iconTile} bg-[#FFE8D1]`}>
                                    <Backpack
                                        className="h-6 w-6 text-[#C66A2B]"
                                        aria-hidden="true"
                                    />
                                </span>
                                <p className="mt-7 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">
                                    03 · Keep the details
                                </p>
                                <h3 className="mb-0 mt-3 text-2xl font-extrabold leading-tight tracking-tight">
                                    Bookings, lists, budgets.
                                </h3>
                                <p className="mb-0 mt-3 text-base leading-7 text-[#65554D]">
                                    Save reservations, share checklists, and
                                    track trip expenses in one place.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section
                    data-scroll-reveal
                    className="px-5 py-12 sm:px-8 sm:py-16"
                >
                    <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#EAE2D9] bg-white shadow-[0_10px_32px_rgba(60,40,30,0.06)] md:grid-cols-2">
                        <div className="relative min-h-64 bg-[#FFF0DF] md:min-h-[27rem]">
                            <img
                                src={travelIllustration}
                                alt="PuddleTrails’ cheerful travel companions flying over a sunny island"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <span
                                className={`absolute bottom-5 left-5 ${photoBadge}`}
                            >
                                <Plane className="h-4 w-4" aria-hidden="true" />{" "}
                                Window seat energy
                            </span>
                        </div>
                        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                            <p className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#C94F46]">
                                <Sun className="h-4 w-4" aria-hidden="true" />{" "}
                                Save the “remember when” for later
                            </p>
                            <h2 className="mb-0 mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                                Less scrolling back.
                                <br />
                                More looking forward.
                            </h2>
                            <p className="mt-4 text-base leading-7 text-[#65554D]">
                                Your trip details stop getting buried in
                                messages. The crew can check the plan, add
                                ideas, and get excited in one shared home.
                            </p>
                            <Link
                                to="/signup"
                                className={`${primaryButton} mt-7 w-fit`}
                            >
                                Make your trip board{" "}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section
                    data-scroll-reveal
                    id="get-started"
                    aria-labelledby="get-started-title"
                    className="px-5 pb-16 pt-8 sm:px-8 sm:pb-24"
                >
                    <div className="mx-auto flex max-w-7xl flex-col items-center rounded-[2rem] bg-[#FFF0DF] px-5 py-12 text-center sm:px-10 sm:py-16">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-label text-xs font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">
                            <Sun className="h-4 w-4" aria-hidden="true" /> Your
                            next “we should go”
                        </p>
                        <h2
                            id="get-started-title"
                            className="mb-0 mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
                        >
                            Ready to make it a real trip?
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#65554D]">
                            Create your account, bring your crew, and start
                            putting the good bits together.
                        </p>
                        <Link
                            to="/signup"
                            className={buttonStyles({
                                size: "inline",
                                className: "mt-7",
                            })}
                        >
                            Create your account{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
