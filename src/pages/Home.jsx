import { Card, Container, Text } from "@mantine/core";
import { HeroCarousel } from "@components/HeroCarousel.jsx";
import { FileText, Globe, Heart, Lock, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import 'lenis/dist/lenis.css';

const services = [
    {
        title: "Health Record Management",
        description:
            "Forget the hassle of sorting through stacks of papers. Upload all your medical documents, lab results, prescriptions, and more to Health Alpha. You’ll have everything you need, neatly organized and accessible at any time.",
        icon: <FileText size={32} className="text-cPrimaryFilled" />,
    },
    {
        title: "Find Doctors Nearby",
        description:
            "Looking for a doctor, specialist, or clinic? Health Alpha makes it simple. With just a few taps, you can locate trusted healthcare professionals near you, read reviews, and book appointments seamlessly.",
        icon: <Search size={32} className="text-cPrimaryFilled" />,
    },
    {
        title: "Personalized Health Tracking",
        description:
            "Your health is unique, and so are your goals. Health Alpha helps you track everything from blood pressure and sugar levels to heart rate and oxygen saturation. Stay on top of your wellness with reminders for fitness activities, sleep improvements, and stress management.",
        icon: <Heart size={32} className="text-cPrimaryFilled" />,
    },
    {
        title: "Manage Dependents’ Health",
        description:
            "Whether it’s your child, elderly parent, or even your pet, Health Alpha helps you stay organized. Manage their health records, set reminders for appointments, and keep track of vaccinations—all from one app.",
        icon: <User size={32} className="text-cPrimaryFilled" />,
    },
    {
        title: "Multilingual Support",
        description:
            "Health Alpha offers multilingual support to ensure that language is never a barrier to managing your health. Access the app in your preferred language and navigate through its features with ease.",
        icon: <Globe size={32} className="text-cPrimaryFilled" />,
    },
    {
        title: "Emergency Info Lock Screen",
        description:
            "In case of emergencies, Health Alpha provides an emergency info lock screen where you can store vital medical details for quick access. This feature ensures your loved ones can easily find your medical information when needed.",
        icon: <Lock size={32} className="text-cPrimaryFilled" />,
    },
];

const HeroSection = ({ height }) => (
    <motion.div
        className="w-full"
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
    >
        <HeroCarousel height={height} animateAllSlides />
    </motion.div>
);

export default function Home() {
    const [height, setHeight] = useState(0);

    const updateHeight = useCallback(() => {
        setHeight(window.innerHeight - 80);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", updateHeight);
        updateHeight();
        return () => window.removeEventListener("resize", updateHeight);
    }, [updateHeight]);

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Hero Section */}
            <HeroSection height={height} />

            {/* Services Section */}
            <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
                <Container size="xl" mx={'auto'}>
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                            Our Services
                        </h2>
                        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600">
                            Health Alpha offers a comprehensive suite of tools to help you manage your health with ease.
                            From secure storage of medical records to personalized health tracking, we simplify healthcare for everyone.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Card
                                key={index}
                                radius="md"
                                padding="lg"
                                withBorder
                                className="transition duration-300 hover:shadow-2xl hover:scale-105"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-cPrimaryFilled">{service.icon}</div>
                                    <Text weight={600} size="lg" className="text-cPrimaryFilled">
                                        {service.title}
                                    </Text>
                                </div>
                                <Text mt="md" className="text-gray-600">
                                    {service.description}
                                </Text>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Community Section */}
            <section className="bg-tb-800 text-white py-8 sm:py-12 lg:py-16 text-center">
                <Container size="lg" mx={'auto'}>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        Join Our Health Community
                    </h2>
                    <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl">
                        Experience a higher level of control and assurance in managing your health.
                    </p>
                </Container>
            </section>
        </div>
    );
}
