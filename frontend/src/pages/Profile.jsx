import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import AuthContext from "../context/AuthContext.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import Footer from "../components/layout/Footer.jsx";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Traveler";
    const location = [user?.city, user?.country].filter(Boolean).join(", ");

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] font-copy text-[#29201D]">
            <AppHeader />
            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12">
                <div className="mx-auto max-w-4xl">
                    <Link to="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#65554D] transition hover:bg-[#FFF2E8] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Your trips
                    </Link>

                    <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#E9D9CA] bg-white shadow-[0_18px_50px_rgba(41,32,29,0.06)]">
                        <div className="bg-[#FFF2E0] px-6 py-7 sm:px-10 sm:py-9">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD34E] text-[#29201D]">
                                <UserRound className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <p className="mt-5 font-label text-xs font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Your traveler profile</p>
                            <h1 className="mb-0 mt-2 text-3xl font-black leading-tight sm:text-4xl">{fullName}</h1>
                            <p className="mt-2 break-all text-sm text-[#786A62] sm:text-base">{user?.email}</p>
                        </div>

                        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:gap-6 sm:px-10 sm:py-8">
                            <div className="rounded-2xl bg-[#FFFCF7] p-5">
                                <div className="flex items-center gap-2 text-[#9B4A3E]">
                                    <Mail className="h-4 w-4" aria-hidden="true" />
                                    <h2 className="mb-0 text-sm font-bold">Email</h2>
                                </div>
                                <p className="mt-3 break-all text-sm text-[#51443E]">{user?.email || "No email available"}</p>
                            </div>
                            <div className="rounded-2xl bg-[#FFFCF7] p-5">
                                <div className="flex items-center gap-2 text-[#9B4A3E]">
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    <h2 className="mb-0 text-sm font-bold">Home base</h2>
                                </div>
                                <p className="mt-3 text-sm text-[#51443E]">{location || "Add a home base when profile editing is available."}</p>
                            </div>
                            <div className="rounded-2xl bg-[#FFFCF7] p-5 sm:col-span-2">
                                <div className="flex items-center gap-2 text-[#9B4A3E]">
                                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                                    <h2 className="mb-0 text-sm font-bold">Account status</h2>
                                </div>
                                <p className="mt-3 text-sm text-[#51443E]">{user?.isVerified ? "Email verified" : "Email not verified"}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
