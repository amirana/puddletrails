import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.webp";

const Footer = () => {
    const { user } = useContext(AuthContext);

    return (
        <footer className="border-t border-[#29201D]/10 px-5 py-7 sm:px-8 sm:py-7">
            <div className="mx-auto grid max-w-7xl justify-items-center gap-5 text-center sm:grid-cols-[1fr_auto_1fr] sm:justify-items-stretch sm:gap-4 sm:text-left">
                <div className="flex flex-col items-center gap-0.5 sm:items-start">
                    <Link
                        to={user ? "/dashboard" : "/"}
                        aria-label="PuddleTrails home"
                        className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94F46]"
                    >
                        <img
                            src={logo}
                            alt="PuddleTrails"
                            className="h-10 w-auto mix-blend-multiply"
                        />
                    </Link>
                    <span className="text-xs font-medium text-[#786A62]">
                        Take the scenic route.
                    </span>
                </div>
                <nav
                    aria-label="Footer links"
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[#65554D] sm:justify-start"
                >
                    <Link
                        to="/privacy"
                        className="transition-colors hover:text-[#C94F46] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94F46]"
                    >
                        Privacy policy
                    </Link>
                    <a
                        href="https://x.com/yourhandle"
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-[#C94F46] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94F46]"
                    >
                        X
                    </a>
                    <a
                        href="https://www.instagram.com/puddletrailsapp/"
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-[#C94F46] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94F46]"
                    >
                        Instagram
                    </a>
                </nav>
                <p className="text-xs font-semibold text-[#786A62] sm:justify-self-end sm:self-center">
                    © {new Date().getFullYear()} PuddleTrails
                </p>
            </div>
        </footer>
    );
};

export default Footer;
