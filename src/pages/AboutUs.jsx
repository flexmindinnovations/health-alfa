import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import logo from '/images/logo.png'

export function AboutUs() {
  const { t } = useTranslation();
  useDocumentTitle(t("aboutUs"));

  return (
    <Container m={0} p={0} size='lg' w='100%' maw='100%' h='100%' className="flex items-center justify-center">
      <div
        size="lg"
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-6xl space-y-5 relative md:max-h-screen"
      >
        <h3 className="text-center text-3xl font-extrabold !text-cPrimaryFilled tracking-wide">
          About Us
        </h3>

        <p className="text-gray-800 text-base leading-relaxed">
          At <span className="font-semibold !text-cPrimaryFilled">Health Alpha</span>,
          we are passionate about transforming the way individuals and families
          manage their health. Founded with the goal of bridging the gaps in
          healthcare accessibility and organization, our platform is the result
          of dedicated research and real-world healthcare insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
          <div className="p-4 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold !text-cPrimaryFilled">
              All-in-One Health Solution
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              From emergency contacts to appointment scheduling, our platform is
              designed to keep you prepared and informed at all times.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold !text-cPrimaryFilled">
              Multi-Language Support
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Inclusivity is key. Our platform supports multiple languages and
              tracks alternative medicine options like Ayurveda and homeopathy.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold !text-cPrimaryFilled">
              Informed Wellness
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Our vision is to create a community where users can achieve their
              health goals, access expert consultations, and stay on top of their
              well-being effortlessly.
            </p>
          </div>
        </div>
        <p className="text-gray-800 text-base leading-relaxed">
          With tools to manage dependents' health records, personalized
          reminders, and expert insights, <span className="font-semibold !text-cPrimaryFilled">Health Alpha</span> ensures
          you are always in control of your health journey.
        </p>

        <div className="text-center">
          <div className="w-24 h-1 !text-cPrimaryFilled mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Your Health, Your Way
          </h2>
        </div>
      </div>
    </Container>
  );
}
