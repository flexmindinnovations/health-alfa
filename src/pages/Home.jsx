import { Button, Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { HeroCarousel } from "@components/HeroCarousel.jsx";

export default function Home() {
    const { t } = useTranslation();
    useDocumentTitle(t("home"));

    const services = [
        {
            title: "Comprehensive Health Record Management",
            description:
                "Upload, store, and access medical documents, lab results, prescriptions, and doctor’s notes with ease. Offline access and automatic syncing ensure your records are always available.",
            icon: "📂",
        },
        {
            title: "Doctor, Clinic, and Veterinary Locator",
            description:
                "Find healthcare providers near you, including specialists like gynecologists, maternity hospitals, dermatologists, and veterinary services. Read reviews and choose the best for your needs.",
            icon: "📍",
        },
        {
            title: "Personalized Health Tracking",
            description:
                "Monitor vital metrics like blood pressure, blood sugar levels, and heart rate. Get reminders for medication and appointments to stay on top of your health.",
            icon: "📊",
        },
        {
            title: "Dependents’ Health and Women’s Health Management",
            description:
                "Manage health records for your children, elderly family members, and track menstrual cycles, pregnancies, and specific women’s health conditions. Find top surgeons and specialists.",
            icon: "👨‍👩‍👧‍👦",
        },
        {
            title: "Medical Expense and Donation Tracking",
            description:
                "Categorize expenses for medical visits, medications, and lab tests. Join a community of volunteers for blood or organ donation.",
            icon: "💳",
        },
        {
            title: "Veterinary Health and Specialized Features for Women",
            description:
                "Manage pets’ health records, track their wellness activities, and provide care for veterinary needs. Also track women’s health including surgeries and cosmetic procedures.",
            icon: "🐾",
        },
    ];

    return (
        <Container m={0} p={0} size='lg' w='100%' maw='100%' h='100%' className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <HeroCarousel height={'calc(100vh - 80px)'} />

            {/* Services Section */}
            <section className="py-16">
                <Container size="lg">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
                        <p className="mt-4">
                            Discover how Health Alpha empowers you to take control of your health and well-being.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className=" shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300"
                            >
                                <div className="flex gap-2">
                                    <div className="text-3xl">{service.icon} </div>
                                    <h3 className="text-base font-semibold !text-cPrimaryFilled">{service.title}</h3>
                                </div>
                                <p className="mt-3">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-r text-white !bg-cPrimaryFilled py-12 text-center">
                <h2 className="text-3xl font-bold">Join Our Health Community</h2>
                <p className="mt-4 text-lg">
                    Experience a higher level of control and assurance in managing your health.
                </p>
            </section>
        </Container>
    );
}
