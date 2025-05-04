import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade"; // Ensure fade effect CSS is imported
import { Autoplay, EffectFade } from "swiper/modules";
import { ActionIcon, useMantineTheme } from '@mantine/core';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsDown } from 'lucide-react';
import { CarouselCard } from "@components/CarouselCard.jsx";
import healthSimplified from '@assets/images/hero/health_simplified.jpg';
import carePets from "@assets/images/hero/care_pets.jpg";
import care from "@assets/images/hero/care.jpg";
import criticalInfo from "@assets/images/hero/critical_info.jpg";
import manageHealth from "@assets/images/hero/manage_health.jpg";
import queue from "@assets/images/hero/queue.jpg";
import safeInformation from "@assets/images/hero/safe_information.jpg";
import smarterLive from "@assets/images/hero/smarter_live.jpg";

// Structure slide data
const slidesData = [
  {
    image: healthSimplified,
    heading: "Your Health, Simplified",
    subheading: "Smart. Secure. Always accessible.",
  },
  {
    image: manageHealth,
    heading: "Manage Your Health Effortlessly",
    subheading: "Track records, appointments, and wellness goals in one place.",
  },
  {
    image: criticalInfo,
    heading: "Critical Info When It Matters",
    subheading: "Emergency details accessible right from your lock screen.",
  },
  {
    image: care,
    heading: "Comprehensive Care Tools",
    subheading: "From finding doctors to managing prescriptions.",
  },
  {
    image: carePets,
    heading: "Care for Your Loved Ones Too",
    subheading: "Manage health records for family members and even pets.",
  },
  {
    image: safeInformation,
    heading: "Your Information, Secured",
    subheading: "Built with privacy and security at its core.",
  },
  {
    image: smarterLive,
    heading: "Live Smarter, Live Healthier",
    subheading: "Personalized insights to guide your wellness journey.",
  },
  // Add more slides if needed, like the 'queue' image
];

export function HeroCarousel() {
  const theme = useMantineTheme();
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Swiper
        slidesPerView={1}
        loop
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        allowTouchMove={false}
        autoplay={{
          delay: 5000, // Adjust timing as needed
          disableOnInteraction: false,
        }}
        className="absolute inset-0 z-0"
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full">
              <CarouselCard slide={slide.image} heading={slide.heading} subheading={slide.subheading} />
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ActionIcon
          size={50}
          variant="gradient"
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          radius="xl"
        >
          <ChevronsDown size={24} />
        </ActionIcon>
      </motion.div>
    </div>
  );
}
