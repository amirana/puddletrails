import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="fixed top-0 z-50 w-full px-6 py-6">
            <nav className="mx-auto flex max-w-6xl items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl font-semibold tracking-tight text-white transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                    Traverse
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-full bg-[#b8dfc7] px-5 py-2.5 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
