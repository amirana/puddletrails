import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.jpg";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
    return (
        <section
            className="relative isolate w-full overflow-hidden px-6 pb-12 pt-32 sm:pt-36"
        >
            <div
                className="absolute inset-x-0 top-0 h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImg})` }}
            />
            {/* Overlay for text legibility over the photo */}
            <div className="absolute inset-x-0 top-0 h-screen bg-black/50" />

            <div className="relative z-10 mx-auto max-w-3xl text-center text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#b8dfc7]" />
                    Plan smarter, together
                </span>

                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                    <span className="block">Plan trips together.</span>
                    <span className="block font-serif italic text-[#b8dfc7]">
                        On one shared itinerary.
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
                    Invite your travel group, keep every day, expense, and
                    reservation in one place — no more scattered group chats.
                </p>

                <Link
                    to="/signup"
                    className="mt-8 inline-block rounded-full bg-[#b8dfc7] px-8 py-3.5 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] sm:text-base"
                >
                    Plan a Trip
                </Link>
            </div>

            <div className="relative z-10 mx-auto mt-12 w-fit max-w-full overflow-hidden rounded-2xl border border-white/20 bg-black/20 shadow-2xl">
                <img
                    className="block max-w-full"
                    src="https://placehold.co/1200x800"
                    alt="Traverse product demo preview"
                />
            </div>
        </section>
    );
};

export default HeroSection;
