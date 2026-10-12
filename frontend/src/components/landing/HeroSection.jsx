import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.jpg";
import { ArrowRight, CalendarDays, MapPin, Sparkles, Users } from "lucide-react";

const HeroSection = () => {
    return (
        <section
            className="relative isolate overflow-hidden bg-[#f6f8f7] px-6 pb-16 pt-32 sm:pb-24 sm:pt-40"
        >
            <div className="absolute -right-48 -top-64 h-[560px] w-[560px] rounded-full bg-emerald-100/70 blur-3xl" />
            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-6xl text-center">
                <div className="mx-auto max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-emerald-700 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        TRAVEL, ORGANIZED
                    </span>
                    <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.06em] !text-slate-950 sm:text-6xl lg:text-7xl">
                        Make the plan.<br />Enjoy the journey.
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                        Invite your travel group, keep every day, expense, and
                        reservation in one place — no more scattered group chats.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800"
                        >
                            Start planning <ArrowRight className="h-4 w-4" />
                        </Link>
                        <p className="text-sm text-slate-500">Free to start. No card required.</p>
                    </div>
                </div>

                <div className="relative mx-auto mt-14 max-w-5xl text-left">
                    <div className="absolute inset-x-14 -bottom-7 h-14 rounded-full bg-slate-900/15 blur-2xl" />
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                        <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            <div className="ml-3 h-5 w-44 rounded-md bg-slate-200/70" />
                        </div>
                        <div className="grid min-h-[360px] md:grid-cols-[210px_1fr]">
                            <aside className="hidden border-r border-slate-200 bg-slate-50 p-5 md:block">
                                <p className="text-lg font-bold tracking-[-0.04em] text-slate-950">PuddleTrails</p>
                                <div className="mt-8 space-y-2 text-sm font-medium text-slate-500">
                                    <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-emerald-800">Overview</p>
                                    <p className="px-3 py-2.5">Itinerary</p>
                                    <p className="px-3 py-2.5">Bookings</p>
                                    <p className="px-3 py-2.5">Expenses</p>
                                </div>
                                <div className="mt-12 rounded-xl bg-slate-900 p-3.5 text-white">
                                    <p className="text-xs text-slate-400">TRIP PROGRESS</p>
                                    <p className="mt-1 text-sm font-semibold">12 days to go</p>
                                    <div className="mt-3 h-1.5 rounded-full bg-white/20"><div className="h-full w-2/3 rounded-full bg-emerald-400" /></div>
                                </div>
                            </aside>
                            <div className="p-5 sm:p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.12em] text-emerald-700">SCOTLAND · SEPTEMBER 2026</p>
                                        <h2 className="mt-1 !text-2xl font-semibold tracking-[-0.04em] !text-slate-950 sm:!text-3xl">Highlands escape</h2>
                                    </div>
                                    <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 sm:flex"><Users className="h-3.5 w-3.5" /> 4 travelers</div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                        <img className="h-32 w-full object-cover" src={heroImg} alt="Scotland coast" />
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><MapPin className="h-3.5 w-3.5" /> TODAY · ISLE OF SKYE</div>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">Explore the Quiraing</p>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-emerald-700 p-4 text-white">
                                        <CalendarDays className="h-5 w-5 text-emerald-200" />
                                        <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-emerald-200">NEXT UP</p>
                                        <p className="mt-1 text-sm font-semibold">Dinner at The Three Chimneys</p>
                                        <p className="mt-2 text-xs text-emerald-100">7:30 PM · Dunvegan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
