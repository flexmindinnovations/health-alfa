import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { ActionIcon, Text, Stack } from "@mantine/core";
import ColorThief from "colorthief";

// Images
import healthSimplified from '@assets/images/hero/health_simplified.jpg';
import carePets from "@assets/images/hero/care_pets.jpg";
import care from "@assets/images/hero/care.jpg";
import criticalInfo from "@assets/images/hero/critical_info.jpg";
import manageHealth from "@assets/images/hero/manage_health.jpg";
import queue from "@assets/images/hero/queue.jpg";
import safeInformation from "@assets/images/hero/safe_information.jpg";
import smarterLive from "@assets/images/hero/smarter_live.jpg";

const slides = [
  { image: healthSimplified, heading: "Your Health, Simplified", subheading: "Smart. Secure. Always accessible." },
  { image: manageHealth, heading: "Manage Health Effortlessly", subheading: "Track records, appointments, and wellness goals." },
  { image: criticalInfo, heading: "Critical Info Instantly", subheading: "Emergency access when it matters most." },
  { image: care, heading: "End-to-End Care Tools", subheading: "From prescriptions to appointments." },
  { image: carePets, heading: "Care Beyond Humans", subheading: "Manage records for your whole family—even pets." },
  { image: safeInformation, heading: "Data Privacy by Design", subheading: "Built from the ground up for security." },
  { image: smarterLive, heading: "Smarter, Healthier Living", subheading: "Personalized insights. Better choices." },
];

export function HeroCarousel() {
  const [dominantColors, setDominantColors] = useState([]);
  const [contrastColors, setContrastColors] = useState([]);

  function getContrastColor([r, g, b]) {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  useEffect(() => {
    const colorThief = new ColorThief();
  
    const loadColors = async () => {
      const results = await Promise.all(
        slides.map((slide) =>
          new Promise(async (resolve) => {
            try {
              const response = await fetch(slide.image);
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = url;
  
              img.onload = () => {
                try {
                  const color = colorThief.getColor(img);
                  const contrast = getContrastColor(color);
                  URL.revokeObjectURL(url);
                  resolve({ color, contrast });
                } catch {
                  resolve({ color: [0, 0, 0], contrast: "#ffffff" });
                }
              };
            } catch {
              resolve({ color: [0, 0, 0], contrast: "#ffffff" });
            }
          })
        )
      );
  
      setDominantColors(results.map((r) => r.color));
      setContrastColors(results.map((r) => r.contrast));
    };
  
    loadColors();
  }, []);
  

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        slidesPerView={1}
        loop
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => {
          const bgColor = dominantColors[index]
            ? `rgba(${dominantColors[index][0]}, ${dominantColors[index][1]}, ${dominantColors[index][2]}, 0.45)`
            : 'rgba(0, 0, 0, 0.4)';

          const textColor = contrastColors[index] || '#ffffff';

          return (
            <SwiperSlide key={index}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0 backdrop-blur-lg"
                  style={{ backgroundColor: bgColor }}
                />

                {/* Centered content */}
                <motion.div
                  className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-center px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Stack gap={30} align="center" justify="center" className="w-full h-full">
                    <Text
                      fw={700}
                      style={{ color: textColor }}
                      className="!text-4xl !leading-6 md:text-6xl lg:!text-6xl h-20 xl:!text-6xl drop-shadow-lg"
                    >
                      {slide.heading}
                    </Text>
                    <Text
                      style={{ color: textColor }}
                      className="!text-xl md:text-2xl font-medium max-w-2xl drop-shadow-md"
                    >
                      {slide.subheading}
                    </Text>
                  </Stack>
                </motion.div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Scroll Down Icon */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ActionIcon
          size={48}
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
