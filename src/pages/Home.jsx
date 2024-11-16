import Button from "@components/button.jsx";
import { Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import image from '/images/banner.jpg'
import Header from '@components/header'

export function Home() {
  const { t } = useTranslation();
  useDocumentTitle(t("home"));

  const services = [
    {
      title: "Comprehensive Health Record Management",
      description:
        "Upload, store, and access medical documents, lab results, prescriptions, and doctor’s notes with ease. Offline access and automatic syncing ensure your records are always available.",
      icon: "📂",
    },
    {
      title: "Doctor, Clinic, and Veterinary Locator",
      description:
        "Find healthcare providers near you, including specialists like gynecologists, maternity hospitals, dermatologists, and veterinary services. Read reviews and choose the best for your needs.",
      icon: "📍",
    },
    {
      title: "Personalized Health Tracking",
      description:
        "Monitor vital metrics like blood pressure, blood sugar levels, and heart rate. Get reminders for medication and appointments to stay on top of your health.",
      icon: "📊",
    },
    {
      title: "Dependents’ Health and Women’s Health Management",
      description:
        "Manage health records for your children, elderly family members, and track menstrual cycles, pregnancies, and specific women’s health conditions. Find top surgeons and specialists.",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      title: "Medical Expense and Donation Tracking",
      description:
        "Categorize expenses for medical visits, medications, and lab tests. Join a community of volunteers for blood or organ donation.",
      icon: "💳",
    },
    {
      title: "Veterinary Health and Specialized Features for Women",
      description:
        "Manage pets’ health records, track their wellness activities, and provide care for veterinary needs. Also track women’s health including surgeries and cosmetic procedures.",
      icon: "🐾",
    },
  ];
  
  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
     {/* <Header /> */}
      {/* Hero Section */}
      <div
        className="relative w-full h-[600px] md:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
     
        <div className="absolute inset-0 bg-black opacity-60" />

        <section className="relative z-10 flex flex-col items-center justify-center text-center h-full py-16 px-6 lg:px-10">
          <h1 className="text-3xl md:4xl lg:5xl font-extrabold leading-tight text-white">
            Simplify Your Health Management
          </h1>
          <p className="mt-6 text-md lg:text-xl text-white">
            In today’s fast-paced world, managing your health and wellness can be a challenge. At Health Alpha, we aim to simplify this process with a platform designed to give you seamless access to your health information and care resources. From tracking medical documents to scheduling appointments with top-rated doctors, Health Alpha is committed to making your healthcare journey smooth, accessible, and stress-free.
          </p>
          <div className="mt-10">
            <Button className="px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-full text-lg shadow-lg transition-all duration-300">
              Get Started
            </Button>
          </div>
        </section>
      </div>

      {/* Services Section */}
      <section className="py-16 bg-gray-100">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
            <p className="mt-4 text-gray-600">
              Discover how Health Alpha empowers you to take control of your health and well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300"
              >
                <div className="flex gap-2">
                  <div className="text-3xl">{service.icon} </div>
                  <h3 className="text-base font-semibold text-blue-600">{service.title}</h3>
                </div>
                <p className="mt-3 text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold">Join Our Health Community</h2>
        <p className="mt-4 text-lg">
          Experience a higher level of control and assurance in managing your health.
        </p>
      </section>
    </div>
  );
}

export default Home;
