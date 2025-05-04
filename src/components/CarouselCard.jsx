import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Overlay, Container, Title, Text, Box } from '@mantine/core';

export function CarouselCard({ slide, heading, subheading }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 }); // Animate once when it comes into view
    const fadeIn = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 1, ease: 'easeOut' },
      },
    };

    return (
      <Box
        ref={ref}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Image */}
        <img
          src={slide}
          alt={heading || "Carousel slide"} // Use heading for alt text
          className="absolute inset-0 w-full h-full object-fill"
          loading="lazy"
        />

        {/* Overlay */}
        <Overlay color="#000" opacity={0.6} zIndex={1} />

        {/* Content */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative z-20 flex items-center justify-center h-full text-white px-4"
        >
          {/* <Container size="lg" className="text-center">
            <Title order={1} className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-4">
              {heading || 'Your Health, Simplified'}
            </Title>
            <Text size="lg" className="drop-shadow-md text-gray-100">
              {subheading || 'Smart. Secure. Always accessible.'}
            </Text>
          </Container> */}
        </motion.div>
      </Box>
    );
  }