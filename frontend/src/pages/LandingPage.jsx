import {
    ArrowRight,
    CalendarDays,
    Compass,
    Eye,
    ListChecks,
    MapPin,
    MessageCircle,
    Paperclip,
    PenLine,
    Plane,
    Route,
    ShieldCheck,
    Users,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import WaitlistForm from "../components/landing/WaitlistForm.jsx";

const nextUp = [
    {
        icon: Route,
        label: "Day-by-day plans",
        blurb: "Mon: museum. Tue: ??? Let's fix that.",
    },
    {
        icon: MessageCircle,
        label: "Trip-day comments",
        blurb: "Argue about the itinerary, not across 12 texts.",
    },
    {
        icon: ListChecks,
        label: "Your own checklists",
        blurb: "Someone always forgets the chargers. Not this time.",
    },
    {
        icon: CalendarDays,
        label: "Reservations",
        blurb: "Book wherever you want. Once it's confirmed, it lives here.",
    },
    {
        icon: Paperclip,
        label: "Trip files",
        blurb: "Boarding passes that aren't buried in your camera roll.",
    },
    {
        icon: WalletCards,
        label: "A simple trip budget",
        blurb: "Know who owes what. Finally.",
    },
];

const roles = [
    {
        icon: ShieldCheck,
        name: "Owner",
        desc: "Made the trip, keeps the final say.",
    },
    {
        icon: PenLine,
        name: "Editor",
        desc: "Can shape the plan — add, move, adjust.",
    },
    {
        icon: Eye,
        name: "Viewer",
        desc: "Just wants to know what time the flight is.",
    },
];

const steps = [
    {
        num: "01",
        title: "Create a trip",
        desc: "Destination and dates. Done in under a minute.",
    },
    {
        num: "02",
        title: "Bring your people in",
        desc: "Invite by email, pick their role, no guessing.",
    },
    {
        num: "03",
        title: "Plan it together",
        desc: "One shared place — not six overlapping chats.",
    },
];

const LandingPage = () => (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242238]">
        <header className="sticky top-0 z-50 border-b border-[#E7E2E9] bg-[#FAF8F5]/95 px-5 backdrop-blur-xl sm:px-8">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex h-[72px] max-w-6xl items-center justify-between"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2.5 rounded-md text-lg font-bold tracking-tight text-[#242238] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6757A8]"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6757A8] text-white">
                        <Compass className="h-5 w-5" />
                    </span>
                    Traverse
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                        to="/login"
                        className="rounded-lg px-2 py-2 text-xs font-semibold text-[#6C6878] transition hover:text-[#242238] sm:px-3 sm:text-sm"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="rounded-lg px-2 py-2 text-xs font-semibold text-[#6C6878] transition hover:text-[#242238] sm:px-3 sm:text-sm"
                    >
                        Sign up
                    </Link>
                    <a
                        href="#waitlist"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#6757A8] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#55468F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6757A8] sm:ml-1 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                        <span className="sm:hidden">Waitlist</span>
                        <span className="hidden sm:inline">
                            Join the waitlist
                        </span>{" "}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                </div>
            </nav>
        </header>

        <main>
            {/* Hero */}
            <section className="overflow-hidden px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-20 lg:pt-24">
                <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DDD6EF] bg-[#F1EDFA] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#5E4E9A]">
                            <span className="h-2 w-2 rounded-full bg-[#E17C5B]" />{" "}
                            Traverse beta · early access
                        </div>
                        <h1 className="!mb-0 !mt-7 max-w-xl !text-5xl font-semibold leading-[1.04] tracking-[-0.06em] text-[#242238] sm:!text-[3.5rem] lg:!text-[3.75rem]">
                            Plan the trip.
                            <span className="mt-1 block text-[#C5664B]">
                                Skip the scroll.
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-7 text-[#696575] sm:text-lg sm:leading-8">
                            Group trips start in a chat and die in a chat.
                            Traverse gives your trip an actual home — dates,
                            destination, and the whole crew, in one shared plan.
                        </p>
                        <div
                            id="waitlist"
                            className="mt-9 max-w-lg scroll-mt-28"
                        >
                            <WaitlistForm buttonLabel="Get beta access" />
                            <p className="mt-3 text-xs leading-5 text-[#85818D]">
                                One email when beta invites open. No spam, no
                                pressure.
                            </p>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[540px] lg:justify-self-end">
                        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#E8DFF4] blur-2xl" />
                        <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-[#F4DCCF] blur-2xl" />
                        <div className="relative overflow-hidden rounded-[30px] border border-white bg-white p-2.5 shadow-[0_28px_80px_rgba(45,38,72,0.14)] sm:p-3">
                            <div className="relative h-[340px] overflow-hidden rounded-[22px] sm:h-[430px]">
                                <img
                                    src={heroImage}
                                    alt="Two travelers taking in a dramatic Icelandic coastline"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A31]/65 via-transparent to-[#1C1A31]/10" />
                                <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-[#242238]/35 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md sm:left-7 sm:top-7">
                                    MADE FOR THE WHOLE CREW
                                </span>
                                <div className="absolute bottom-6 left-5 right-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                                        The good bit starts here
                                    </p>
                                    <p className="mt-2 max-w-md font-serif text-3xl italic leading-tight sm:text-4xl">
                                        "We should go."
                                        <br />
                                        "Okay, let's actually plan it."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-5 right-5 flex items-center gap-2.5 rounded-2xl border border-[#E9E4EF] bg-white px-4 py-3 shadow-[0_12px_34px_rgba(45,38,72,0.12)] sm:-right-5 sm:bottom-7">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDFA] text-[#6757A8]">
                                <MapPin className="h-[18px] w-[18px]" />
                            </span>
                            <span>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C8796]">
                                    One home for
                                </span>
                                <span className="mt-0.5 block text-xs font-semibold text-[#302D45]">
                                    the trip details
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why another trip planner */}
            <section className="scroll-mt-24 border-y border-[#E7E2E9] bg-white px-6 py-20 sm:px-10 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5664B]">
                            We know, we know
                        </p>
                        <h2 className="!mb-0 !mt-4 !text-3xl font-semibold tracking-[-0.045em] text-[#242238] sm:!text-4xl">
                            Yes, there are other trip planners.
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-[#777380] sm:text-base">
                            Most of them hand everyone the same link and call
                            that "collaboration." Traverse gives your trip real
                            roles — so "wait, who deleted the hotel booking?"
                            stops being a thing that happens.
                        </p>
                    </div>

                    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#E7E2E9] bg-[#FAF8F5] px-6 py-5 sm:px-7">
                        <div className="flex items-start gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCEDE6] text-[#B85B41]">
                                <Plane className="h-[18px] w-[18px]" />
                            </span>
                            <p className="text-left text-sm leading-6 text-[#696575] sm:text-base">
                                <span className="font-semibold text-[#242238]">
                                    To be upfront —{" "}
                                </span>
                                we don't book your flights. Book wherever you
                                already trust, then bring the confirmation here,
                                where it won't get lost in a chat thread.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-5 sm:grid-cols-3">
                        {roles.map(({ icon: Icon, name, desc }) => (
                            <div
                                key={name}
                                className="rounded-[24px] border border-[#E7E2E9] bg-[#FAF8F5] p-6 text-center sm:p-7"
                            >
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAF8] text-[#6757A8]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mb-0 mt-5 text-lg font-semibold tracking-tight text-[#242238]">
                                    {name}
                                </h3>
                                <p className="mt-1.5 text-sm leading-6 text-[#777380]">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5664B]">
                            How it works
                        </p>
                        <h2 className="!mb-0 !mt-4 !text-3xl font-semibold tracking-[-0.045em] text-[#242238] sm:!text-4xl">
                            Three steps. No tutorial needed.
                        </h2>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-3">
                        {steps.map(({ num, title, desc }) => (
                            <div
                                key={num}
                                className="rounded-[24px] border border-[#E7E2E9] bg-white p-6 sm:p-7"
                            >
                                <span className="text-sm font-bold tracking-[0.08em] text-[#C5B8E8]">
                                    {num}
                                </span>
                                <h3 className="mb-0 mt-2 text-lg font-semibold tracking-tight text-[#242238]">
                                    {title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-6 text-[#777380]">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's live now */}
            <section
                id="about"
                className="scroll-mt-24 border-y border-[#E7E2E9] bg-white px-6 py-20 sm:px-10 sm:py-24"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5664B]">
                            A calmer starting point
                        </p>
                        <h2 className="!mb-0 !mt-4 !text-3xl font-semibold tracking-[-0.045em] text-[#242238] sm:!text-4xl">
                            Start with the trip. Grow into the whole plan.
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-[#777380] sm:text-base">
                            The first build gives your trip a home and makes
                            shared access clearer. We'll build the rest with
                            beta travelers.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        <article className="rounded-[24px] border border-[#E7E2E9] bg-[#FAF8F5] p-6 sm:p-8">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAF8] text-[#6757A8]">
                                <MapPin className="h-5 w-5" />
                            </span>
                            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6757A8]">
                                In the first build
                            </p>
                            <h3 className="mb-0 mt-2 text-xl font-semibold tracking-tight text-[#242238]">
                                Trip details, together.
                            </h3>
                            <p className="mt-2 max-w-md text-sm leading-6 text-[#777380]">
                                Create a trip and keep its destination, dates,
                                and description in one place everyone with
                                access can find.
                            </p>
                        </article>
                        <article className="rounded-[24px] border border-[#E7E2E9] bg-[#FAF8F5] p-6 sm:p-8">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCEDE6] text-[#B85B41]">
                                <Users className="h-5 w-5" />
                            </span>
                            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#B85B41]">
                                A clear foundation
                            </p>
                            <h3 className="mb-0 mt-2 text-xl font-semibold tracking-tight text-[#242238]">
                                Bring your crew in with clear roles.
                            </h3>
                            <p className="mt-2 max-w-md text-sm leading-6 text-[#777380]">
                                Invite people by email, choose who can edit or
                                view, and keep trip access in the owner's hands.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section
                id="roadmap"
                className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-24"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5664B]">
                                On the roadmap
                            </p>
                            <h2 className="!mb-0 !mt-4 !text-3xl font-semibold tracking-[-0.045em] text-[#242238] sm:!text-4xl">
                                The trip has more chapters.
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-[#777380]">
                            Here's what we're working toward. Beta testers will
                            help us figure out what matters most.
                        </p>
                    </div>
                    <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {nextUp.map(({ icon: Icon, label, blurb }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-[#E7E2E9] bg-white p-5"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EDFA] text-[#6757A8]">
                                    <Icon className="h-[18px] w-[18px]" />
                                </span>
                                <p className="mb-0 mt-3.5 text-sm font-semibold text-[#464254]">
                                    {label}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#8A8591]">
                                    {blurb}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-xs text-[#8A8591]">
                        Planned features can change as we learn. We'll be clear
                        about what's ready in each beta release.
                    </p>
                </div>
            </section>

            {/* Founder note */}
            <section className="border-y border-[#E7E2E9] bg-white px-6 py-16 sm:px-10">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5664B]">
                        One person, not a company
                    </p>
                    <p className="mt-4 text-base leading-7 text-[#464254] sm:text-lg">
                        Hi — I'm building Traverse solo. I got tired of planning
                        every trip across a dozen chat threads, so I'm building
                        the tool I actually wanted. If you've got a trip coming
                        up and five apps open just to plan it, this one's for
                        you. Follow along, tell me what's missing — I'm actually
                        reading it.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-20 sm:px-10 sm:pb-24">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[28px] bg-[#292540] px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F2B59D]">
                            Early access
                        </p>
                        <h2 className="!mb-0 !mt-3 !text-2xl font-semibold tracking-tight text-white sm:!text-3xl">
                            Got a trip coming up? Help us make the planning part
                            better.
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-white/70">
                            Join the list and we'll let you know when beta
                            invites are ready.
                        </p>
                    </div>
                    <a
                        href="#waitlist"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F2B59D] px-5 py-3 text-sm font-bold text-[#292540] transition hover:bg-[#F6C6B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Join the waitlist <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </section>
        </main>

        <footer className="border-t border-[#E7E2E9] bg-white px-6 py-8 sm:px-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#242238]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6757A8] text-white">
                        <Compass className="h-4 w-4" />
                    </span>
                    Traverse{" "}
                    <span className="font-normal text-[#85818D]">
                        · Plan trips. Together.
                    </span>
                </Link>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#777380]">
                    <Link to="/login" className="hover:text-[#242238]">
                        Log in
                    </Link>
                    <span>&copy; {new Date().getFullYear()} Traverse</span>
                </div>
            </div>
        </footer>
    </div>
);

export default LandingPage;
