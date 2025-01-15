import {Container} from "@mantine/core";
import {useDocumentTitle} from "@hooks/DocumentTitle";
import {useTranslation} from "react-i18next";
import {Edit3, Handshake, Mail, MessageCircle} from "lucide-react";

export default function ContactUs() {
    const {t} = useTranslation();
    useDocumentTitle(t("contactUs"));

    const gridClasses = [
        "col-span-1 row-span-2",
        "col-span-1 row-span-1",
        "col-span-1 row-span-2",
        "col-span-1 row-span-1",
    ];
    const baseCardClasses = "rounded-3xl shadow-xl p-3 border-solid border-1 border-gray-200";

    const contactDetails = [
        {
            title: "General Inquiries",
            email: "info@healthalpha.com",
            icon: <Mail className="h-7 w-7 text-cPrimaryFilled"/>,
            description:
                "For any general information about Health Alpha, our mission, services, or platform features, feel free to reach out. We're here to guide you in understanding how we simplify health management for everyone. Whether you're a new user exploring our platform or an organization seeking more details about our offerings, our team is happy to assist you.",
        },
        {
            title: "Customer Support",
            email: "support@healthalpha.com",
            icon: <MessageCircle className="h-7 w-7 text-cPrimaryFilled"/>,
            description:
                "Facing issues with our app? Whether it’s account setup, troubleshooting, or feature-related questions, our dedicated support team is here to help you navigate seamlessly through Health Alpha.",
        },
        {
            title: "Feedback & Suggestions",
            email: "feedback@healthalpha.com",
            icon: <Edit3 className="h-7 w-7 text-cPrimaryFilled"/>,
            description:
                "Your input matters! Share your feedback and suggestions to help us refine our platform, add new features, and ensure Health Alpha meets the needs of our users. We welcome all ideas, whether it's about improving user experience, adding new health-tracking features, or expanding our services. Together, let’s create a more user-friendly and innovative health management solution.",
        },
        {
            title: "Partnerships",
            email: "partnerships@healthalpha.com",
            icon: <Handshake className="h-7 w-7 text-cPrimaryFilled"/>,
            description:
                "Join us in creating meaningful collaborations! If you're a healthcare provider, organization, or innovator, connect with us to explore partnership opportunities aimed at improving healthcare accessibility.",
        },
    ];

    return (
        <Container
            m={0}
            p={0}
            size="lg"
            w="100%"
            maw="100%"
            h="100%"
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: 'column',
                justifyContent: "center",
                padding: 0,
                paddingTop: "32px",
            }}
        >
            <div
                className="max-w-5xl px-4"
                style={{
                    maxHeight: "75vh",
                }}
            >
                <div className="text-center mb-4">
                    <h1 className="text-3xl !text-cPrimaryFilled font-bold mb-4">
                        {t('contactUs')}
                    </h1>
                    <p className="text-base leading-relaxed">
                        We&#39;re here to assist you. If you have any questions or feedback,
                        please feel free to reach out to us.
                    </p>
                </div>
                <div
                    className="grid grid-cols-1 h-screen md:grid-cols-2 gap-5 w-full p-5 md:grid-rows-[repeat(6,minmax(auto,300px))]">
                    {contactDetails.map((contact, index) => (
                        <div
                            key={index}
                            className={`card item${index + 1} ${gridClasses[index]} ${baseCardClasses}`}
                        >
                            <ContactCard
                                title={contact.title}
                                icon={contact.icon}
                                email={contact.email}
                                description={contact.description}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}

const ContactCard = ({title, icon, email, description}) => (
    <div>
        <div className="flex flex-col items-start gap-4 p-4">
            {/* Icon */}
            <div className="flex items-center justify-center gap-4">
                <div
                    className="flex items-center justify-center overflow-hidden transform hover:scale-110 transition-all duration-300 ease-in-out">
                    <span className="text-xl">{icon}</span>
                </div>
                <h3 className="text-xl !text-cPrimaryFilled font-bold tracking-tight transition-transform duration-300 ease-in-out transform hover:translate-x-1">
                    {title}
                </h3>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-2 justify-center">
                <p className="text-sm text-gray-600">{description}</p>
                <a
                    href={`mailto:${email}`}
                    className="text-sm text-indigo-500 font-bold hover:text-indigo-700"
                >
                    {email}
                </a>
            </div>
        </div>
    </div>
);
