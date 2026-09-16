import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="absolute top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
            <nav className="mx-auto flex h-18 max-w-6xl items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl font-bold tracking-[-0.055em] text-slate-950 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950"
                >
                    Traverse
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1 sm:gap-3">
                    <Link
                        to="/login"
                        className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 sm:px-4"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 sm:px-5"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
