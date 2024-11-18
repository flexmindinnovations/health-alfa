import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";

export function ContactUs() {
  const { t } = useTranslation();
  useDocumentTitle(t("contactUs"));

  // Define an array of contact card information
  const contactDetails = [
    {
      title: "General Inquiries",
      email: "info@healthalpha.com",
      icon: "📧"
    },
    {
      title: "Customer Support",
      email: "support@healthalpha.com",
      icon: "💬"
    },
    {
      title: "Feedback & Suggestions",
      email: "feedback@healthalpha.com",
      icon: "📝"
    },
    {
      title: "Partnerships & Business Inquiries",
      email: "partnerships@healthalpha.com",
      icon: "🤝"
    }
  ];

  return (
    <Container
    m={0} p={0} size='lg' w='100%' maw='100%' h='100%'
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <div className="max-w-6xl">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl !text-cPrimaryFilled font-bold mb-4">Contact Us</h1>
          <p className="text-balance">
            We're here to assist you. If you have any questions or feedback, please feel free to reach out to us.
          </p>
        </div>

        {/* Grid Layout for Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Map through contactDetails array to generate ContactCards */}
          {contactDetails.map((contact, index) => (
            <ContactCard
              key={index}
              title={contact.title}
              email={contact.email}
              icon={contact.icon}
            />
          ))}
        </div>

        {/* Address Section */}
        <div className="text-center mt-6 border-t pt-4">
          <h3 className="text-xl !text-cPrimaryFilled font-semibold mb-2">Our Address</h3>
          <p>Health Alpha Headquarters</p>
          <p>123 Wellness Avenue, Dubai, UAE</p>
        </div>
      </div>
    </Container>
  );
}

const ContactCard = ({ title, email, icon }) => (
  <div className="p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-4">{icon}</span>
      <h3 className="text-xl  !text-cPrimaryFilled font-semibold">{title}</h3>
    </div>
    <p>
      Email:{" "}
      <a
        href={`mailto:${email}`}
        className="hover:text-blue-800 transition-colors"
      >
        {email}
      </a>
    </p>
  </div>
);
