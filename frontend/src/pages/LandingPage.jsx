import CtaSection from "../components/landing/CtaSection.jsx";
import FeatureSection from "../components/landing/FeatureSection.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Header.jsx";

const features = [
    {
        number: "01",
        eyebrow: "PLAN YOUR DAYS",
        title: "Build your itinerary",
        description:
            "Organize your trip day by day, add activities and places, and rearrange plans whenever things change. Move activities across days without starting over.",
        supportingText:
            "Tentative times. Flexible plans. One shared itinerary.",
        image: "https://placehold.co/1200x600",
        imageAlt: "Traverse itinerary preview",
    },
    {
        number: "02",
        eyebrow: "TRAVEL TOGETHER",
        title: "Plan with your people",
        description:
            "Invite your travel group, choose who can edit and who can view, and keep everyone working from the same plan.",
        supportingText: "Owner. Editor. Viewer. One shared trip.",
        image: "https://placehold.co/1200x600",
        imageAlt: "Traverse collaboration preview",
    },
    {
        number: "03",
        eyebrow: "KEEP IT ORGANIZED",
        title: "Everything you need, in one place",
        description:
            "Keep reservations, expenses, checklists, and important files together so you don't have to search through scattered group chats and folders.",
        supportingText: "Reservations. Expenses. Checklists. Files.",
        image: "https://placehold.co/1200x600",
        imageAlt: "Traverse organization preview",
    },
    {
        number: "04",
        eyebrow: "YOUR WHOLE TRIP",
        title: "One shared plan from start to finish",
        description:
            "Bring your itinerary, people, bookings, expenses, and trip details together in one shared workspace.",
        supportingText: "One trip. One shared plan.",
        image: "https://placehold.co/1200x600",
        imageAlt: "Traverse trip overview preview",
    },
];

const Features = () => {
    return (
        <>
            {features.map((feature) => (
                <FeatureSection key={feature.number} {...feature} />
            ))}
        </>
    );
};

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main>
                <HeroSection />

                <Features />

                <CtaSection />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
