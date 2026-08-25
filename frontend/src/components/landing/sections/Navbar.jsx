import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="w-full bg-[#FFFDF8]">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-semibold tracking-tight text-[#172033]"
                >
                    Traverse
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-full px-5 py-2.5 text-sm font-medium text-[#172033] transition-colors hover:bg-[#F4EFE7]"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/signup"
                        className="rounded-full bg-[#E9785D] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D9654B]"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
