import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { Container, Text, Title, useMantineTheme } from '@mantine/core'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Mousewheel, Virtual, EffectFade, Autoplay } from "swiper/modules";
import { useMediaQuery } from '@mantine/hooks';

const slidesContent = [
  {
    title: "Meet Health Alpha",
    description: "Discover Health Alpha, a platform built to simplify healthcare access and management for individuals and families alike."
  },
  {
    title: "Making Healthcare Simple for Everyone",
    description: "Our mission is to break down healthcare complexities, offering intuitive tools and services that anyone can use with ease."
  },
  {
    title: "Our Story",
    description: "Health Alpha began with a simple yet powerful idea: to make health management accessible and seamless for everyone, everywhere."
  },
  {
    title: "A Mission for Better Health",
    description: "We are committed to improving lives through smarter technology and compassionate design, empowering users to take control of their well-being."
  },
  {
    title: "We’re Here for You, Always",
    description: "Our platform is designed around your needs, offering continuous support, trusted resources, and features that prioritize your health and peace of mind."
  },
  {
    title: "Join the Health Alpha Community",
    description: "Be part of a growing community that believes in better, smarter, and more personalized healthcare for all."
  }
];


export default function AboutUs() {
  const { t } = useTranslation();
  useDocumentTitle(t("aboutUs"));
  const swiperRef = useRef(null);
  const theme = useMantineTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  // Reset body styles for consistent centering
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
  }, []);

  return (
    <Container fluid p={0} mx={'auto'}>
      <div className="swiper w-full h-[500px]" ref={swiperRef}>
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
          {
            slidesContent.map((slide, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <motion.div className="h-full flex flex-col items-center justify-center bg-tb-900 gap-5">
                  <Title c={theme.white}>{slide.title}</Title>
                  <Text c={theme.white} size="lg">{slide.description}</Text>
                </motion.div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>

      <motion.div className="my-4" style={{ maxWidth: isMobile ? '100%' : '80%', margin: '50px auto' }}>
        <Title className="text-center text-3xl font-extrabold !text-cPrimaryFilled tracking-wide">
          {t('aboutUs')}
        </Title>

        <Text size="lg" styles={{ root: { textAlign: 'justify' } }}>
          At <b>Health Alpha</b>, we understand that managing your health or the health of your loved ones can sometimes feel overwhelming. That’s why we created a platform that makes it easier, simpler, and more intuitive.
          Our story began with a simple idea: health should be manageable for everyone, no matter who you are or where you live. With Health Alpha, we’ve built a space where all your health needs come together—secure, easy to use, and designed to empower you.
          We’re not just about technology; we’re about people. Everything we do is aimed at helping you make informed decisions, manage your time better, and focus on what really matters—staying healthy and happy.
          With features like multilingual support, tools for tracking health goals, and even an emergency info lock screen, Health Alpha isn’t just another app—it’s a thoughtful solution for real-life challenges. We’re here to support you every step of the way because your health deserves the best care possible.
        </Text>
      </motion.div>
    </Container>
  );
}
