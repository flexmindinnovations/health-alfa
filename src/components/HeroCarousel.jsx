import {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import {Mousewheel, Pagination, Virtual} from "swiper/modules";
import {CarouselCard} from "@components/CarouselCard.jsx";
import classes from '@styles/HeroCarousel.module.css';

const data = [
    {
        image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "Your Health, Simplified with Health Alpha",
        category: "Simplifying your health journey with Health Alpha, offering easy access to all your medical documents, reminders, and wellness tools, so you can focus on what matters most—your health."
    },
    {
        image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "A Personal Health Partner You Can Count On",
        category: "Health Alpha is your trusted personal health companion, providing the tools and support you need to manage your health and stay on top of important appointments and health goals."
    },
    {
        image: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "Stay Organized, Stay Healthy",
        category: "With Health Alpha, you can stay organized by storing and tracking your health data in one place, making it easy to manage your wellness and stay healthy."
    },
    {
        image: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "For You and Your Loved Ones",
        category: "Health Alpha is designed not only for you but for your entire family, helping you manage health records, appointments, and more to ensure everyone stays healthy and safe."
    },
    {
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "Take Control of Your Health Today",
        category: "Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips."
    }
];

export function HeroCarousel() {
    const swiperRef = useRef(null);
    const [allowScroll, setAllowScroll] = useState(false);

    useEffect(() => {
        const paginationBullets = document.querySelectorAll(".swiper-pagination-bullet");
        paginationBullets.forEach((bullet, index) => {
            bullet.setAttribute("aria-label", `Slide ${index + 1}`);
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (swiperRef.current) {
            const rect = swiperRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (rect.top < 0 || rect.bottom > window.innerHeight) {
                    console.log('called if')
                    swiperRef.current.scrollIntoView({behavior: "smooth", block: "start"});
                    setAllowScroll(false);
                } else {
                    console.log('called else')
                    setAllowScroll(true);
                }
            }
        }
    };

    return (
        <div ref={swiperRef} className="w-full h-screen mb-4">
            <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={10}
                effect="coverflow"
                loop={false}
                virtual
                pagination={{
                    type: "bullets",
                    clickable: true,
                    bulletClass: classes.customBullet,
                    bulletActiveClass: classes.customBulletActive
                }}
                mousewheel={{
                    forceToAxis: true,
                    releaseOnEdges: true,
                    thresholdDelta: 15,
                    thresholdTime: 500,
                }}
                modules={[Virtual, Pagination, Mousewheel]}
                style={{height: "100vh", width: "100%"}}
            >
                {data.map((slide, index) => (
                    <SwiperSlide key={index} virtualIndex={index}>
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f4f4f4"
                            }}
                        >
                            <CarouselCard {...slide} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
