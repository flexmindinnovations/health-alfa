import HealthRecordImage from "@assets/images/services/health-record.png";
import EmergencyImage from "@assets/images/services/emergency.png";
import MultilingleImage from "@assets/images/services/multilingle.png";
import FamilyImage from "@assets/images/services/family.png";
import FindDoctorsImage from "@assets/images/services/find-doctors.png";
import PersonalHealthImage from "@assets/images/services/personal-health.png";
import skipClinic from "@assets/images/hero/skip_clinic.png";
import startFeeling from "@assets/images/hero/start_feeling.png";
import secureFamily from "@assets/images/hero/secure_family.png";
import yourHealth from "@assets/images/hero/your_health.png";
import whereTechnology from "@assets/images/hero/where_technology.png";
import instantAccess from "@assets/images/hero/instant_access.png";
import connectingPatient from "@assets/images/hero/connecting_patients.png";
import connectWithUs from "@assets/images/hero/connect_with-us.png";
import careOnYourPhone from "@assets/images/hero/care_on_your_phone.png";
import healthAlpha from "@assets/images/hero/health_alpha.png";
import { FileText, Search, Heart, User, Globe, Lock } from "lucide-react";

export const services = [
  {
    title: "Organize, Access, Control: Your Medical History in One Place",
    description:
      "You will never have to worry about losing your test reports. All your medical records, prescriptions, imaging tests, and notes from doctors are safe and easy to access using Health Alpha. You can access everything when you're offline. It also syncs automatically when you're online. You can find records by date, type, or doctor. You can even export records as images or PDFs to send as necessary. Your medical records are now easy and convenient to manage.",
    icon: FileText,
    image: healthAlpha,
  },
  {
    title: "Instant Care, Right Around the Corner",
    description:
      "Want to find a local gynecologist, pediatrician, or sonography clinic? Health Alpha helps you find the best hospitals and clinics in Dubai. You can filter by location and specialty in real time. Book appointments without delay and avoid the waiting game. Whether it is a maternity hospital or a skin specialist, finding healthcare is quicker and easier. Future visits will also remind you, so you never miss an appointment.",
    icon: Search,
    image: instantAccess,
  },
  {
    title: "Your Goals, Our Guidance: AI-Driven Wellness Made Simple",
    description:
      "Your health goals are personal, and so is your tracker. Want to lose weight, sleep better, get fit, or relieve stress? Health Alpha helps you set and track your own goals. Keep track of blood pressure, blood sugar, hydration, and even exercise with reminders using our personal health tracker. The virtual health assistant adds convenience to your day-to-day life.",
    icon: Heart,
    image: connectingPatient,
  },
  {
    title: "Care for Loved Ones, Effortlessly",
    description:
      "Caring for your loved ones' health is now easier than ever. With Health Alpha, you can track your child’s or elderly parents’ digital medical records, appointments, and test results all in one place. You can sort reports by test type, like MRI or blood tests. You can also track full-body checkups and scheduled appointments. Parents can access and update a child's health profile without risk whenever necessary",
    icon: User,
    image: careOnYourPhone,
  },
  {
    title: "Breaking Barriers, Building Trust",
    description:
      "Users must have the ability to access healthcare application in a language of their choice. That's why Health Alpha provides multilingual support. Whether you are English, Arabic, Hindi, or another speaker, it doesn't matter You will receive clear instruction, reminders, and lists of DHA-approved doctors. This will make the application more beneficial to all users, particularly in a multicultural city like Dubai.",
    icon: Globe,
    image: secureFamily,
  },
  {
    title: "Safety First: Critical Data When Every Second Counts",
    description:
      "During a medical emergency, seconds count. Health Alpha shows important health information on your phone's lock screen. You can include information such as your blood group, allergies, and emergency contact. First person can easily access this information during an emergency. They do not have to unlock your phone. It's an easy but effective means of being ready when you need it most, powered by smart digital health innovation.",
    icon: Lock,
    image: connectWithUs,
  },
];
