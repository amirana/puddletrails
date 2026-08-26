import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-black/10 bg-white px-6 py-16 text-left sm:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-[2fr_repeat(3,1fr)] md:gap-8">
                    <div className="max-w-sm">
                        <h2 className="m-0 text-xl font-semibold tracking-tight !text-[#08060d]">
                            Traverse
                        </h2>
                        <p className="mt-4 text-sm font-medium text-[#08060d]">
                            Plan trips. Together.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#6b6375]">
                            Your shared space for planning the next adventure.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="m-0 mb-1 font-medium text-[#08060d]">Product</h3>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="#features">Features</Link>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="#how-it-works">How it works</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="m-0 mb-1 font-medium text-[#08060d]">Legal</h3>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="/privacy">Privacy</Link>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="/terms">Terms</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="m-0 mb-1 font-medium text-[#08060d]">Social</h3>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="#">Instagram</Link>
                        <Link className="text-[#6b6375] hover:text-[#08060d]" to="#">X</Link>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-[#6b6375] sm:flex-row sm:justify-between">
                    <p>© 2026 Traverse</p>
                    <p>Made for travelers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
