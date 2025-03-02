import { Card, Container, Title, Text, Image, AspectRatio } from "@mantine/core";
import { HeroCarousel } from "@components/HeroCarousel.jsx";
import { FileText, Globe, Heart, Lock, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import 'lenis/dist/lenis.css';
import HealthRecordImage from '../assets/images/services/health-record.png';
import EmergencyImage from '../assets/images/services/emergency.png';
import MultilingleImage from '../assets/images/services/multilingle.png';
import FamilyImage from '../assets/images/services/family.jpg';
import FindDoctorsImage from '../assets/images/services/find-doctors.png';
import PersonalHealthImage from '../assets/images/services/personal-health.png';

const gradient = 'linear-gradient(to right, #143345, #4cccd3, #2ab1b9)';
const services = [
    {
        title: "Health Record Management",
        description:
            "Forget the hassle of sorting through stacks of papers. Upload all your medical documents, lab results, prescriptions, and more to Health Alpha. You’ll have everything you need, neatly organized and accessible at any time.",
        icon: <FileText size={32} className="text-cPrimaryFilled" />,
        image: HealthRecordImage
    },
    {
        title: "Find Doctors Nearby",
        description:
            "Looking for a doctor, specialist, or clinic? Health Alpha makes it simple. With just a few taps, you can locate trusted healthcare professionals near you, read reviews, and book appointments seamlessly.",
        icon: <Search size={32} className="text-cPrimaryFilled" />,
        image: FindDoctorsImage
    },
    {
        title: "Personalized Health Tracking",
        description:
            "Your health is unique, and so are your goals. Health Alpha helps you track everything from blood pressure and sugar levels to heart rate and oxygen saturation. Stay on top of your wellness with reminders for fitness activities, sleep improvements, and stress management.",
        icon: <Heart size={32} className="text-cPrimaryFilled" />,
        image: PersonalHealthImage
    },
    {
        title: "Manage Dependents’ Health",
        description:
            "Whether it’s your child, elderly parent, or even your pet, Health Alpha helps you stay organized. Manage their health records, set reminders for appointments, and keep track of vaccinations—all from one app.",
        icon: <User size={32} className="text-cPrimaryFilled" />,
        image: FamilyImage
    },
    {
        title: "Multilingual Support",
        description:
            "Health Alpha offers multilingual support to ensure that language is never a barrier to managing your health. Access the app in your preferred language and navigate through its features with ease.",
        icon: <Globe size={32} className="text-cPrimaryFilled" />,
        image: MultilingleImage
    },
    {
        title: "Emergency Info Lock Screen",
        description:
            "In case of emergencies, Health Alpha provides an emergency info lock screen where you can store vital medical details for quick access. This feature ensures your loved ones can easily find your medical information when needed.",
        icon: <Lock size={32} className="text-cPrimaryFilled" />,
        image: EmergencyImage
    },
];

const ServicesCard = ({ service, dir }) => {
    return (
        <Card
            radius="md"
            padding={0}
            className="transition duration-300 md:col-span-2 lg:col-span-3 w-full"
        >
            <div
                className={`flex flex-col-reverse text-center lg:text-left ${dir === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } items-center lg:justify-between gap-10 w-full`}
            >
                <motion.div
                    initial={{ opacity: 0, transform: `translateX(${dir === 'left' ? '-100px' : '100px'})` }}
                    whileInView={{ opacity: 1, transform: "translateX(0)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                    className="w-full max-w-[500px]"
                    style={{ willChange: 'transform, opacity' }}
                >
                    <AspectRatio ratio={1}>
                        <Image fit="scale-down" src={service.image} alt={service.title} loading="lazy" />
                    </AspectRatio>
                </motion.div>

                <div className="content w-full max-w-[500px]">
                    <motion.div
                        initial={{ opacity: 0, transform: `translateX(${dir === 'left' ? '100px' : '-100px'})` }}
                        whileInView={{ opacity: 1, transform: "translateX(0)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.2 }}
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <Title
                            size="h2"
                            weight={600}
                            className="text-transparent bg-clip-text"
                            style={{
                                background: gradient,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {service.title}
                        </Title>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, transform: `translateX(${dir === 'left' ? '100px' : '-100px'})` }}
                        whileInView={{ opacity: 1, transform: "translateX(0)" }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.2 }}
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <Text mt="md" className="text-gray-600">
                            {service.description}
                        </Text>
                    </motion.div>
                </div>
            </div>
        </Card>
    );
};


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
            <HeroSection />

            {/* Services Section */}
            <section className="py-10 px-4 sm:py-12 md:py-16 lg:py-20">
                <Container size="xl" mx={'auto'}>
                    <div className="text-center mb-8 sm:mb-12">
                        <Title
                            size={'h1'}
                            className="text-transparent bg-clip-text"
                            style={{
                                background: gradient,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            Our Services
                        </Title>
                        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600">
                            Health Alpha offers a comprehensive suite of tools to help you manage your health with ease.
                            From secure storage of medical records to personalized health tracking, we simplify healthcare for everyone.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) =>
                            <ServicesCard
                                key={index}
                                service={service}
                                dir={index % 2 === 0 ? 'left' : 'right'}
                            />
                        )}
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
