import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { Container, Text, Title, useMantineTheme, Divider, Stack, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import { useMediaQuery } from '@mantine/hooks';
import { utils } from "@config/utils";

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

  // useEffect(() => {
  //   document.body.style.margin = "0";
  //   document.body.style.padding = "0";
  //   document.body.style.height = "100vh";
  //   document.body.style.display = "flex";
  //   document.body.style.justifyContent = "center";
  //   document.body.style.alignItems = "center";
  // }, []);

  return (
    <Container fluid style={{...utils.dotsBackground}}> 
      <Stack p={0} mx="auto"
        gap={20}
        className="relative overflow-auto bg-gradient-to-b from-white to-[#f4fdfc]"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0px, #f4fdfc 300px, #f4fdfc 100%)',
          minHeight: '100vh',
          width: '100%',
          padding: '2rem',
        }}
      >
        <div className="w-full min-h-[300px] md:h-[300px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px] overflow-hidden mx-auto relative"
          ref={swiperRef}
        >
          <Swiper
            slidesPerView={1}
            loop={true}
            modules={[Autoplay, EffectFade]}
            allowTouchMove={false}
            effect='fade'
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="absolute inset-0 h-full w-full"
          >
            {slidesContent.map((slide, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <motion.div
                  className="h-full flex flex-col items-center justify-end px-4 md:px-10 text-center "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Text size="lg" fw={700} mb={20} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} className="text-center !text-2xl mb-8" c="primary" ta="center">
                    {slide.title}
                  </Text>
                  <Text maw={'60%'} ta="center" size="xs" c="dimmed" fz="md">
                    {slide.description}
                  </Text>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          className="relative z-10 py-16 px-6 sm:px-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Text fw={700} c={"primar"} ta={"center"} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} className="text-center !text-4xl mb-8">
            {t('aboutUs')}
          </Text>
          <Divider my="md" variant="dotted" color="cyan" />
          <Text size="md" c="dimmed" className="text-justify leading-relaxed">
            At <strong>Health Alpha</strong>, we understand that managing your health or the health of your loved ones can sometimes feel overwhelming. That’s why we created a platform that makes it easier, simpler, and more intuitive. Our story began with a simple idea: health should be manageable for everyone, no matter who you are or where you live. With Health Alpha, we’ve built a space where all your health needs come together—secure, easy to use, and designed to empower you. We’re not just about technology; we’re about people. Everything we do is aimed at helping you make informed decisions, manage your time better, and focus on what really matters—staying healthy and happy. With features like multilingual support, tools for tracking health goals, and even an emergency info lock screen, Health Alpha isn’t just another app—it’s a thoughtful solution for real-life challenges. We’re here to support you every step of the way because your health deserves the best care possible.
          </Text>
        </motion.div>
      <Box component="section" className="relative w-full bg-gradient-to-r from-tb-900 to-tb-600 text-white py-20 px-6 text-center">
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
      </Stack>
    </Container>
  );
}
