import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Mousewheel, Virtual, EffectFade, Autoplay } from "swiper/modules";
import { CarouselCard } from "@components/CarouselCard.jsx";
import { ActionIcon, useMantineTheme } from '@mantine/core';
import heroImage from "../assets/images/hero.webp";
import healthSimplified from "../assets/images/hero/health_simplified.jpg";
import carePets from "../assets/images/hero/care_pets.jpg";
import care from "../assets/images/hero/care.jpg";
import criticalInfo from "../assets/images/hero/critical_info.jpg";
import manageHealth from "../assets/images/hero/manage_health.jpg";
import queue from "../assets/images/hero/queue.jpg";
import safeInformation from "../assets/images/hero/safe_information.jpg";
import smarterLive from "../assets/images/hero/smarter_live.jpg";
import { ChevronsDown } from 'lucide-react';
import { motion } from "framer-motion";
import { AspectRatio, Image } from '@mantine/core';

const data = [
  {
    image: healthSimplified,
    title: "Your Health, Simplified with Health Alpha",
    category:
      "Simplifying your health journey with Health Alpha, offering easy access to all your medical documents, reminders, and wellness tools, so you can focus on what matters most—your health.",
  },
  {
    image: carePets,
    title: "A Personal Health Partner You Can Count On",
    category:
      "Health Alpha is your trusted personal health companion, providing the tools and support you need to manage your health and stay on top of important appointments and health goals.",
  },
  {
    image: care,
    title: "Stay Organized, Stay Healthy",
    category:
      "With Health Alpha, you can stay organized by storing and tracking your health data in one place, making it easy to manage your wellness and stay healthy.",
  },
  {
    image: criticalInfo,
    title: "For You and Your Loved Ones",
    category:
      "Health Alpha is designed not only for you but for your entire family, helping you manage health records, appointments, and more to ensure everyone stays healthy and safe.",
  },
  {
    image: manageHealth,
    title: "Take Control of Your Health Today",
    category:
      "Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips.",
  },
  {
    image: queue,
    title: "Take Control of Your Health Today",
    category:
      "Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips.",
  },
  {
    image: safeInformation,
    title: "Take Control of Your Health Today",
    category:
      "Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips.",
  },
  {
    image: smarterLive,
    title: "Take Control of Your Health Today",
    category:
      "Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips.",
  },
];

const images = [healthSimplified, care, criticalInfo, manageHealth, queue, safeInformation, smarterLive, carePets];

export function HeroCarousel() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useMantineTheme();

  return (
    <div
      ref={swiperRef}
      className="w-full h-[calc(100vh-100px)] relative"
      style={{ zIndex: 10 }}
    >

      <Swiper
        slidesPerView={1}
        loop={true}
        modules={[Autoplay, EffectFade]}
        allowTouchMove={false}
        effect='fade'
        fadeEffect={{
          crossFade: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        style={{ height: "100%", width: "100%", backgroundColor: "transparent", zIndex: 10 }}
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            <div
              className="w-full h-full flex items-center justify-center bg-transparent"
            >
              <CarouselCard slide={slide} isActive={index === activeIndex} />
              {/* <AspectRatio ratio={16 / 9} w={'100%'}>
                <Image src={slide} styles={{ root: { objectFit: 'fill' } }} />
              </AspectRatio> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={`nav-button absolute flex items-center justify-center -bottom-6 z-[9999] rounded-full left-1/2 -translate-x-1/2`}
        style={{
          backgroundColor: theme.colors.secondary[9]
        }}
      >
        <ActionIcon h={50} w={50} variant="transparent" c={theme.white}>
          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <ChevronsDown size={24} />
          </motion.div>
        </ActionIcon>
      </div>
    </div >
  );
}
