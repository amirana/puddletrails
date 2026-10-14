import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Check, MapPin, ShieldCheck, UserRound } from "lucide-react";
import AuthContext from "../context/AuthContext.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import Footer from "../components/layout/Footer.jsx";

const inputClass = "mt-2 w-full rounded-xl border border-[#E9D9CA] bg-white px-4 py-3 text-sm text-[#29201D] placeholder:text-[#A49388] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15";

const Profile = () => {
    const { user, updateProfile, updateAvatar } = useContext(AuthContext);
    const [city, setCity] = useState(user?.city || "");
    const [country, setCountry] = useState(user?.country || "");
    const [photo, setPhoto] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const fileInput = useRef(null);
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Traveler";
    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "PT";

    const saveHomeBase = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");
        try {
            await updateProfile({ city: city.trim(), country: country.trim() });
            setMessage("Your home base has been updated.");
        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    const uploadPhoto = async (event) => {
        event.preventDefault();
        if (!photo) return;
        setUploading(true);
        setMessage("");
        setError("");
        try {
            await updateAvatar(photo);
            setPhoto(null);
            if (fileInput.current) fileInput.current.value = "";
            setMessage("Your profile photo has been updated.");
        } catch (err) {
            setError(err.message || "Unable to upload your profile photo.");
        } finally {
            setUploading(false);
        }
    };

    const choosePhoto = (event) => {
        const selected = event.target.files?.[0];
        setError("");
        setMessage("");
        if (!selected) return setPhoto(null);
        if (!selected.type.startsWith("image/")) {
            setPhoto(null);
            setError("Choose an image file for your profile photo.");
            event.target.value = "";
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            setPhoto(null);
            setError("Profile photos must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }
        setPhoto(selected);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] font-copy text-[#29201D]">
            <AppHeader />
            <main className="w-full flex-1 px-4 py-6 sm:px-8 sm:py-10">
                <div className="mx-auto max-w-4xl">
                    <Link to="/dashboard" className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#65554D] transition hover:bg-[#FFF2E8] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Your trips
                    </Link>

                    <div className="mb-5 mt-5">
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#B55243]">Your account</p>
                        <h1 className="mb-1 text-2xl font-extrabold tracking-normal sm:text-3xl">Profile</h1>
                        <p className="text-sm text-[#786A62]">Make your profile feel like yours.</p>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-[#E9D9CA] bg-white shadow-[0_12px_32px_rgba(41,32,29,0.05)]">
                        <div className="flex flex-col gap-4 border-b border-[#F0E7DE] bg-[#FFF5E8] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#FFE3D8] text-lg font-bold text-[#A94E42] shadow-sm">
                                {user?.avatar ? <img src={user.avatar} alt={`${fullName}'s profile`} className="h-full w-full object-cover" /> : initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="mb-1 truncate text-lg font-bold">{fullName}</h2>
                                <p className="mb-0 truncate text-sm text-[#786A62]">{user?.email}</p>
                            </div>
                            <form onSubmit={uploadPhoto} className="flex flex-wrap items-center gap-2">
                                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={choosePhoto} className="sr-only" aria-label="Choose profile photo" />
                                <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E8CDBB] bg-white px-4 text-sm font-semibold text-[#6F5146] transition hover:bg-[#FFF9F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F]">
                                    <Camera className="h-4 w-4" aria-hidden="true" /> {photo ? "Choose another" : "Change photo"}
                                </button>
                                {photo && <button type="submit" disabled={uploading} className="inline-flex min-h-10 items-center rounded-full bg-[#E9573F] px-4 text-sm font-semibold text-white transition hover:bg-[#CE4935] disabled:cursor-not-allowed disabled:opacity-60">{uploading ? "Uploading…" : "Upload photo"}</button>}
                            </form>
                        </div>

                        <form onSubmit={saveHomeBase} className="px-5 py-5 sm:px-7 sm:py-6">
                            <div className="mb-4 flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0DE] text-[#69845C]"><MapPin className="h-4 w-4" aria-hidden="true" /></span>
                                <div>
                                    <h2 className="mb-0 text-base font-bold">Home base</h2>
                                    <p className="mb-0 text-xs text-[#88786E]">Where are you usually setting off from?</p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-semibold text-[#51443E]">City<input value={city} onChange={(event) => setCity(event.target.value)} maxLength={100} autoComplete="address-level2" placeholder="e.g. Mumbai" className={inputClass} /></label>
                                <label className="text-sm font-semibold text-[#51443E]">Country<input value={country} onChange={(event) => setCountry(event.target.value)} maxLength={100} autoComplete="country-name" placeholder="e.g. India" className={inputClass} /></label>
                            </div>
                            <div className="mt-5 flex flex-col gap-3 border-t border-[#F0E7DE] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-xs text-[#786A62]">
                                    <ShieldCheck className="h-4 w-4 text-[#7F9A6B]" aria-hidden="true" />
                                    {user?.isVerified ? "Email verified" : "Email not verified"}
                                </div>
                                <button type="submit" disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#E9573F] px-5 text-sm font-semibold text-white transition hover:bg-[#CE4935] disabled:cursor-not-allowed disabled:opacity-60">
                                    <Check className="h-4 w-4" aria-hidden="true" /> {saving ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                            {message && <p role="status" className="mb-0 mt-3 text-sm font-medium text-[#557448]">{message}</p>}
                            {error && <p role="alert" className="mb-0 mt-3 text-sm font-medium text-[#B54135]">{error}</p>}
                        </form>
                    </div>
                    <p className="mt-3 flex items-center gap-2 px-1 text-xs text-[#88786E]"><UserRound className="h-3.5 w-3.5" aria-hidden="true" /> Your name and email are managed by your account settings.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
