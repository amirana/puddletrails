import { Link } from "react-router-dom";

const CtaSection = () => {
    return (
        <section className="border-t border-black/10 bg-white px-6 py-24 text-center sm:py-32">
            <div className="mx-auto max-w-2xl">
                <span className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                    READY TO PLAN?
                </span>

                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-5xl">
                    Your next trip starts here.
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6b6375] sm:text-lg">
                    Bring your travel group together, build the plan, and keep
                    everything you need in one shared trip.
                </p>

                <Link
                    to="/signup"
                    className="mt-8 inline-block rounded-full bg-[#b8dfc7] px-7 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1]"
                >
                    Plan a Trip
                </Link>
            </div>
        </section>
    );
};

export default CtaSection;
