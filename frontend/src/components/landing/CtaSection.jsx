import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "../../assets/hero.jpg";

const CtaSection = () => {
    return (
        <section className="bg-white px-6 py-24 sm:py-32">
            <div className="relative mx-auto flex min-h-[420px] max-w-6xl items-end overflow-hidden rounded-3xl bg-slate-950 px-7 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:min-h-[480px] sm:px-12 sm:py-14">
                <img
                    src={heroImg}
                    alt="Travelers looking out over a coastline"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/15" />
                <div className="relative z-10 max-w-xl text-left">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-200">READY TO PLAN?</p>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] !text-white sm:text-5xl">
                        Your next trip starts with a shared plan.
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-slate-200 sm:text-lg">
                        Bring your people, places, and plans together in one simple workspace.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-50"
                        >
                            Create your trip <ArrowRight className="h-4 w-4" />
                        </Link>
                        <span className="text-sm font-medium text-white/75">Free to start. No card required.</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
