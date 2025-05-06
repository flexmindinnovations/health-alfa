import { Container, Title, Text, Button, AspectRatio, Stack, Group, Avatar, useMantineTheme, Box } from "@mantine/core";
import { motion } from "framer-motion";
import { HeroCarousel } from "@components/HeroCarousel.jsx";
import { services } from '@assets/data/services.js';
import { createElement } from 'react';
import { utils } from "@config/utils";

const ServiceCard = ({ service, index }) => {
    const theme = useMantineTheme();
    const isEven = index % 2 === 0;
    const animationDir = isEven ? -100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0, x: animationDir }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            // Use Grid for better layout control
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 px-6 py-2 md:px-10`}
        >
            {/* Image Section */}
            <Box className="w-full md:w-1/2">
                <img
                    src={service.image}
                    alt={service.title}
                    className="object-fill w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                />
            </Box>

            {/* Content Section */}
            <Box className="w-full md:w-1/2 text-center md:text-left">
                <Group gap="md" mb="md" justify={isEven ? 'flex-start' : 'flex-start'}>
                    {/* Icon */}
                    <Avatar size="lg" radius="xl" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                        {createElement(service.icon, { size: 28, strokeWidth: 1.5 })}
                    </Avatar>

                    {/* Title */}
                    <Text size={'lg'} fw={700} fs={50} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                        {service.title}
                    </Text>
                </Group>

                {/* Description */}
                <Text c="dimmed" size="md" lh="lg">
                    {service.description}
                </Text>
            </Box>
        </motion.div>
    );
};

export default function Home() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <motion.section
                className="relative w-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <HeroCarousel />
            </motion.section>

            {/* Services Section */}
            <Container fluid
                style={{ ...utils.dotsBackground }}
                component="section"
                className="pt-16 md:pt-24 min-h-96"
            >
                <Stack gap={20} className="w-full bg-gradient-to-b from-white to-[#f4fdfc]"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0px, #f4fdfc 200px, #f4fdfc 100%)',
                        minHeight: '100vh',
                        padding: '2rem',
                    }}
                >
                    <Stack align="center" gap={10}>
                        <Text
                            variant={"gradient"}
                            fw={700}
                            ta="center"
                            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                            className="!text-3xl md:!text-4xl font-bold"
                        >
                            Our Services
                        </Text>
                        <Text ta="center" c="dimmed" size="lg" className="max-w-2xl">
                            Simplify your healthcare with powerful, intuitive features.
                        </Text>
                    </Stack>
                    <div
                        className="max-w-6xl mx-auto"

                    >
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </Stack>
            </Container>

            {/* Community CTA */}
            <Box component="section" className="relative bg-gradient-to-r from-tb-900 to-tb-600 text-white py-20 px-6 text-center">
                <Stack gap={20} align="center" justify="center">
                    <Title order={2} className="text-3xl sm:text-4xl font-bold">Join Our Health Community</Title>
                    <Text size="xl" mt="md" className="max-w-xl mx-auto opacity-90">
                        Take charge of your well-being with tools that are built for your lifestyle.
                    </Text>
                    {/* <Button mt="xl" size="lg" radius="xl" variant="white" color="blue" component="a" href="/register">
                        Get Started Today
                    </Button> */}
                </Stack>
            </Box>
        </div>
    );
}
