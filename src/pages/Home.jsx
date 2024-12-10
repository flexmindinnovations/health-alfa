import {Card, Container, Text} from "@mantine/core";
import {HeroCarousel} from "@components/HeroCarousel.jsx";
import {FileText, Globe, Heart, Lock, Search, User} from "lucide-react";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import 'lenis/dist/lenis.css'

const HeroSection = ({height}) => {


    return (<motion.div
        className="w-full"
        style={{height}}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5, type: "spring"}}
    >
        <HeroCarousel height={height}/>
    </motion.div>);
};

export default function Home() {
    const [height, setHeight] = useState(0);
    const services = [{
        title: "Health Record Management",
        description: "Forget the hassle of sorting through stacks of papers. Upload all your medical documents, lab results, prescriptions, and more to Health Alpha. You’ll have everything you need, neatly organized and accessible at any time.",
        icon: <FileText size={32} className="text-cPrimaryFilled"/>,
    }, {
        title: "Find Doctors Nearby",
        description: "Looking for a doctor, specialist, or clinic? Health Alpha makes it simple. With just a few taps, you can locate trusted healthcare professionals near you, read reviews, and book appointments seamlessly.",
        icon: <Search size={32} className="text-cPrimaryFilled"/>,
    }, {
        title: "Personalized Health Tracking",
        description: "Your health is unique, and so are your goals. Health Alpha helps you track everything from blood pressure and sugar levels to heart rate and oxygen saturation. Stay on top of your wellness with reminders for fitness activities, sleep improvements, and stress management.",
        icon: <Heart size={32} className="text-cPrimaryFilled"/>,
    }, {
        title: "Manage Dependents’ Health",
        description: "Whether it’s your child, elderly parent, or even your pet, Health Alpha helps you stay organized. Manage their health records, set reminders for appointments, and keep track of vaccinations—all from one app.",
        icon: <User size={32} className="text-cPrimaryFilled"/>,
    }, {
        title: "Multilingual Support",
        description: "Health Alpha offers multilingual support to ensure that language is never a barrier to managing your health. Access the app in your preferred language and navigate through its features with ease.",
        icon: <Globe size={32} className="text-cPrimaryFilled"/>,
    }, {
        title: "Emergency Info Lock Screen",
        description: "In case of emergencies, Health Alpha provides an emergency info lock screen where you can store vital medical details for quick access. This feature ensures your loved ones can easily find your medical information when needed.",
        icon: <Lock size={32} className="text-cPrimaryFilled"/>,
    },];

    useEffect(() => {
        const updateHeight = () => {
            setHeight(window.innerHeight - 80);
        };
        window.addEventListener("resize", updateHeight);

        updateHeight();

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    return (<Container m={0} p={0} size="lg" w="100%" maw="100%" h="100%" className="!min-h-screen flex flex-col">
        <HeroSection height={height}/>
        <section className="py-16">
            <Container size="lg">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
                    <p className="mt-4">
                        Health Alpha offers a comprehensive suite of tools to help you manage your health with ease.
                        From secure storage of medical records and seamless appointment scheduling to personalized
                        health tracking and multilingual support, we simplify healthcare for individuals and
                        families.
                        With features designed for managing both personal and dependent health needs, including
                        reminders and doctor searches, Health Alpha ensures you stay on top of your wellness, no
                        matter where life takes you. Empower your health journey with intuitive, secure, and
                        accessible solutions from Health Alpha.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (<Card
                        key={index}
                        radius="md"
                        padding="lg"
                        withBorder
                        className="transition duration-300 hover:shadow-2xl hover:scale-105 transform"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-cPrimaryFilled">{service.icon}</div>
                            <Text weight={600} size="lg" className="!text-cPrimaryFilled">
                                {service.title}
                            </Text>
                        </div>
                        <Text mt="md">{service.description}</Text>
                    </Card>))}
                </div>
            </Container>
        </section>
        <section className="bg-gradient-to-r text-white !bg-cPrimaryFilled py-12 text-center">
            <h2 className="text-3xl font-bold">Join Our Health Community</h2>
            <p className="mt-4 text-lg">
                Experience a higher level of control and assurance in managing your health.
            </p>
        </section>
    </Container>);
}
