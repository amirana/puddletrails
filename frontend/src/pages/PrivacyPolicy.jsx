import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer.jsx";
import logo from "../assets/logo.png";

const sections = [
    {
        title: "Information we collect",
        paragraphs: [
            "When you create an account, we collect your name and email address, and a securely hashed password. You may also add profile details such as a photo, city, or country.",
            "When you plan a trip, we store the details you add, such as destinations, dates, itineraries, notes, comments, checklists, budgets, expenses, bookings, and attached files. Please avoid adding information that your group does not need.",
        ],
    },
    {
        title: "How we use information",
        paragraphs: [
            "We use this information to provide PuddleTrails, keep your account secure, share trip plans with the people you invite, send account and trip emails, and respond to support requests.",
        ],
    },
    {
        title: "How trip information is shared",
        paragraphs: [
            "Trip information is available to the members of that trip according to their access. When you invite someone, we use the email address you provide to send the invitation and help them join the trip.",
            "We use service providers to host the app and its data, send email, and store reservation attachments. They process information for us to provide those services. We may also disclose information if required by law or needed to protect the service and its users. We do not sell personal information.",
        ],
    },
    {
        title: "Cookies and security",
        paragraphs: [
            "PuddleTrails uses a necessary sign-in cookie to keep your account session working. We do not currently use advertising cookies. Passwords are stored as hashes, and session tokens are protected using measures designed to reduce unauthorized access.",
            "No internet service can guarantee perfect security. Please use a unique password and contact us if you think your account has been accessed without permission.",
        ],
    },
    {
        title: "How long we keep information",
        paragraphs: [
            "We keep account and trip information while it is needed to provide the service and maintain your account. We may retain limited records for legal, security, or operational reasons. To ask us to correct or delete information, contact us using the address below.",
        ],
    },
    {
        title: "Your choices and rights",
        paragraphs: [
            "Depending on where you live, you may have the right to request access to, correction of, deletion of, or a copy of your personal information, or to object to or restrict certain uses. We will respond in line with the laws that apply to your request.",
        ],
    },
    {
        title: "Children’s privacy",
        paragraphs: [
            "PuddleTrails is intended for adults planning trips with their groups and is not designed for children under 13. If you believe a child has provided personal information, contact us so we can review it.",
        ],
    },
    {
        title: "Changes and contact",
        paragraphs: [
            "We may update this policy as PuddleTrails changes. We will post the current version here and update the date above.",
            "PuddleTrails is operated by [legal business or operator name]. For privacy questions or requests, email [privacy contact email]. Replace these placeholders with monitored contact details before launch.",
        ],
    },
];

const PrivacyPolicy = () => (
    <div className="flex min-h-screen flex-col bg-[#FFFCF7] text-[#29201D]">
        <header className="px-5 py-2 sm:px-8">
            <nav aria-label="Privacy page navigation" className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4">
                <Link to="/" aria-label="PuddleTrails home" className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94F46]">
                    <img src={logo} alt="PuddleTrails" className="h-12 w-auto mix-blend-multiply sm:h-14" />
                </Link>
                <Link to="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#65554D] transition-colors hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94F46]"><ArrowLeft className="h-4 w-4" /> Back home</Link>
            </nav>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
            <p className="font-label text-xs font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">The fine print, made readable</p>
            <h1 className="mb-0 mt-3 text-4xl font-black leading-tight sm:text-5xl">Privacy policy</h1>
            <p className="mt-3 text-sm text-[#786A62]">Last updated October 13, 2026</p>
            <p className="mt-6 text-base leading-7 text-[#65554D]">This policy explains what information PuddleTrails collects, how we use it, and the choices you have when you use our trip-planning service.</p>

            <div className="mt-6 rounded-xl border border-[#E8B899] bg-[#FFF4E3] px-4 py-3 text-sm leading-6 text-[#65554D]">
                <strong className="text-[#29201D]">Setup note:</strong> This is a general starter policy. Replace the bracketed operator and contact details, confirm it against your final service providers and practices, and have it reviewed for the places where you operate before publishing.
            </div>

            <div className="mt-8 divide-y divide-[#EEE7DF]">
                {sections.map(({ title, paragraphs }) => (
                    <section key={title} className="py-6 first:pt-0">
                        <h2 className="mb-0 text-xl font-extrabold">{title}</h2>
                        {paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-7 text-[#65554D]">{paragraph}</p>)}
                    </section>
                ))}
            </div>
        </main>
        <Footer />
    </div>
);

export default PrivacyPolicy;
