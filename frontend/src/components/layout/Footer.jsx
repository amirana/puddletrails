import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white px-6 py-16 text-left sm:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-[2fr_repeat(2,1fr)] md:gap-8">
                    <div className="max-w-sm">
                        <h2 className="m-0 text-xl font-bold tracking-[-0.05em] !text-slate-950">
                            PuddleTrails
                        </h2>
                        <p className="mt-4 text-sm font-medium text-slate-900">
                            Plan trips. Together.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            Your shared space for planning the next adventure.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="m-0 mb-1 font-medium text-slate-900">Legal</h3>
                        <Link className="text-slate-500 transition-colors hover:text-slate-950" to="/privacy">Privacy</Link>
                        <Link className="text-slate-500 transition-colors hover:text-slate-950" to="/terms">Terms</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="m-0 mb-1 font-medium text-slate-900">Social</h3>
                        <a className="text-slate-500 transition-colors hover:text-slate-950" href="#">Instagram</a>
                        <a className="text-slate-500 transition-colors hover:text-slate-950" href="#">X</a>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
                    <p>© 2026 PuddleTrails</p>
                    <p>Made for travelers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
