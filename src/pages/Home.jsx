import Button from "@components/button.jsx"
import { Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@hooks/DocumentTitle";

export function Home() {
    const { t } = useTranslation();
    useDocumentTitle(t("home"));

    const keyFeatures = [
        {
          title: "Track Your Health",
          description:
            "Stay on top of your health with real-time tracking tools for vital metrics like blood pressure, heart rate, and oxygen saturation. Get personalized health insights based on your data.",
          items: [
            "Monitor blood pressure and heart rate trends over time.",
            "Track daily oxygen saturation levels.",
            "Set health goals and receive progress reports."
          ]
        },
        {
          title: "Personalized Notifications",
          description:
            "Receive timely reminders and tailored health notifications to keep you on track with your health goals. Set reminders for medications, appointments, and health tasks.",
          items: [
            "Get customized medication reminders based on your schedule.",
            "Receive notifications for upcoming doctor’s appointments."
          ]
        },
        {
          title: "Multi-Language Support",
          description:
            "Easily access your health resources in your preferred language, making healthcare accessible to a diverse community. Enjoy a seamless experience in any language of your choice.",
          items: [
            "Choose from a wide selection of languages for a personalized experience.",
            "Automatically detect and switch to your device’s language settings."
          ]
        }
      ];

      return (
        <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
          {/* Header Section */}
          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 text-center">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-semibold">Seamless Access to Your Health Information</h2>
              <p className="text-lg mt-4">
                We understand that in today’s fast-paced world, having seamless access to your health information and care resources is essential. Our platform is designed to bring simplicity, organization, and comprehensive healthcare management right to your fingertips.
              </p>
            </div>
          </section>
    
          {/* Features Section */}
          <section className="bg-gray-100 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white px-6 py-4 sm:py-6 shadow-lg rounded-lg"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-600">{feature.title}</h3>
                    <p className="text-sm sm:text-md text-gray-600 mt-2">{feature.description}</p>
                    <ul className="mt-2 text-sm sm:text-md text-gray-500 px-2 list-disc text-left">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Call to Action Section */}
          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 text-center">
            <h3 className="text-2xl font-semibold">Join Our Health Community</h3>
            <p className="mt-2 text-lg">Experience a higher level of control and assurance in managing your health.</p>
            <button className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-lg rounded-full">Get Started</button>
          </section>
        </div>
      );
}

export default Home;
