import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import logo from '/images/logo.png'

export function AboutUs() {
  const { t } = useTranslation();
  useDocumentTitle(t("aboutUs"));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-4">
      <Container
        size="lg"
        className="bg-white shadow-2xl rounded-3xl p-12 mx-auto max-w-5xl space-y-10 relative"
      >
        {/* <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="w-20 h-20 bg-amber-50 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
                <img src={logo} height={50} width={50} alt="logo" />
            </span>
          </div>
        </div> */}

        <h1 className="text-center text-4xl font-extrabold text-blue-600 tracking-wide">
          About Us
        </h1>

        <p className="text-gray-800 text-lg leading-relaxed">
          At <span className="font-semibold text-blue-600">Health Alpha</span>,
          we are passionate about transforming the way individuals and families
          manage their health. Founded with the goal of bridging the gaps in
          healthcare accessibility and organization, our platform is the result
          of dedicated research and real-world healthcare insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              All-in-One Health Solution
            </h3>
            <p className="text-gray-700 leading-relaxed">
              From emergency contacts to appointment scheduling, our platform is
              designed to keep you prepared and informed at all times.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Multi-Language Support
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Inclusivity is key. Our platform supports multiple languages and
              tracks alternative medicine options like Ayurveda and homeopathy.
            </p>
          </div>
        </div>

        <div className="bg-blue-100 p-8 rounded-xl shadow-inner text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Empowering Informed Health Choices
          </h2>
          <p className="text-gray-800 leading-relaxed">
            Our vision is to create a community where users can achieve their
            health goals, access expert consultations, and stay on top of their
            well-being effortlessly.
          </p>
        </div>

        <p className="text-gray-800 text-lg leading-relaxed">
          With tools to manage dependents' health records, personalized
          reminders, and expert insights, <span className="font-semibold text-blue-600">Health Alpha</span> ensures
          you are always in control of your health journey.
        </p>

        <div className="text-center">
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Your Health, Your Way
          </h2>
        </div>
      </Container>
    </div>
  );
}
