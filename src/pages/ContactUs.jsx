import { Container, Title, Text, SimpleGrid, Card, Group, ThemeIcon, Stack, Anchor, Space } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle"; // Assuming this hook exists
import { useTranslation } from "react-i18next";
import { Edit3, Handshake, Mail, MessageCircle } from "lucide-react"; // Keep lucide icons

// --- Data remains the same ---
const contactDetails = [
    {
        title: "generalInquiries",
        email: "info@healthalpha.ae",
        icon: Mail,
        description: "generalInquiriesDescription"
    },
    {
        title: "customerSupport",
        email: "support@healthalpha.ae",
        icon: MessageCircle,
        description:
            "Need assistance? Our dedicated customer support team is here to help you with any questions or issues you may have. Whether it's about your account, our services, or technical support, we're just an email away.",
    },
    {
        title: "feedbackAndSuggestions",
        email: "feedback@healthalpha.ae",
        icon: Edit3,
        description:
            "We value your feedback! If you have suggestions or ideas on how we can improve our services, please share them with us. Your insights are crucial in helping us enhance your experience and better serve your needs.",
    },
    {
        title: "partnerships",
        email: "partnerships@healthalpha.ae",
        icon: Handshake,
        description:
            "Join us in creating meaningful collaborations! If you're a healthcare provider, organization, or innovator, connect with us to explore partnership opportunities aimed at improving healthcare accessibility.",
    },
];

// --- Redesigned Contact Card Component ---
// Moved outside ContactUs component as it's self-contained
const ContactCard = ({ title, icon: Icon, email, description }) => (
    <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        h="100%" // Make card fill the grid cell height
        sx={(theme) => ({
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.shadows.md,
            },
        })}
    >
        <Stack justify="space-between" h="100%" w={'100%'}>
            {/* Top section: Icon, Title */}
            <Stack gap="md">
                <Stack gap="md" align="center">
                    <ThemeIcon size={44} radius="xl" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}> {/* Or "filled" */}
                        <Icon size={24} /> {/* Render the passed icon component */}
                    </ThemeIcon>
                    <Text size="lg" fw={700} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} className="text-center !text-xl mb-8" c="primary" ta="center">
                        {title}
                    </Text>
                </Stack>

                {/* Description */}
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {description}
                </Text>
            </Stack>

            {/* Bottom section: Email Link */}
            <Anchor
                href={`mailto:${email}`}
                size="sm"
                fw={500}
                ta={'center'}
            >
                {email}
            </Anchor>
        </Stack>
    </Card>
);


export default function ContactUs() {
    const { t } = useTranslation();
    useDocumentTitle(t("contactUs"));

    return (
        <Container fluid>
            <Stack align="center" gap={20} h={"100%"} w={"100%"} pb={30}
                styles={{
                    root: {
                        height: '100%',
                        overflowY: 'auto',
                        backgroundColor: '#f4fdfc',
                        backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, rgba(0,0,0,0) 1px)',
                        backgroundSize: '20px 20px 20px 20px',
                        backgroundPosition: '0 0, 10px 10px, 5px 5px, 15px 15px',
                    },
                    inner: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            >
                <div className="w-full !flex-1 min-h-[50vh] md:min-h-[40vh] lg:min-h-[40vh] xl:min-h-[40vh] relative flex items-end justify-center bg-gradient-to-b from-white to-[#f4fdfc] overflow-hidden">
                    {/* Introductory Text */}
                    <Stack align="center" gap={4}
                        styles={{
                            root: {
                                width: '100%',
                                margin: '0 auto',
                            }
                        }}
                    > {/* Constrain width of intro text */}
                        <Text size="xl" fw={700} mb={20} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} className="text-center !text-4xl mb-8" c="primary" ta="center">
                            {t('contactUs')}
                        </Text>
                        <Text maw={'60%'} ta="center" size="xs" c="dimmed" fz="md">
                            {t('contactUsIntroduction')}
                        </Text>
                    </Stack>
                </div>

                {/* Grid of Contact Cards */}
                <SimpleGrid
                    cols={{ base: 1, sm: 2 }} // Responsive columns
                    spacing="md" // Spacing between grid items
                    verticalSpacing="md"
                    maw={'80%'}
                    w="100%"
                >
                    {contactDetails.map((contact, index) => (
                        <ContactCard
                            key={index}
                            title={t(contact.title)}
                            icon={contact.icon}
                            email={contact.email}
                            description={t(contact.description)} // Translate description
                        />
                    ))}
                </SimpleGrid>
            </Stack>
        </Container>
    );
}