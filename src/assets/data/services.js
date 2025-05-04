import HealthRecordImage from '@assets/images/services/health-record.png';
import EmergencyImage from '@assets/images/services/emergency.png';
import MultilingleImage from '@assets/images/services/multilingle.png';
import FamilyImage from '@assets/images/services/family.png';
import FindDoctorsImage from '@assets/images/services/find-doctors.png';
import PersonalHealthImage from '@assets/images/services/personal-health.png';
import { FileText, Search, Heart, User, Globe, Lock } from 'lucide-react';

export const services = [
    {
        title: "Health Record Management",
        description:
            "Forget the hassle of sorting through stacks of papers. Upload all your medical documents, lab results, prescriptions, and more to Health Alpha. You’ll have everything you need, neatly organized and accessible at any time.",
        icon: FileText,
        image: HealthRecordImage
    },
    {
        title: "Find Doctors Nearby",
        description:
            "Looking for a doctor, specialist, or clinic? Health Alpha makes it simple. With just a few taps, you can locate trusted healthcare professionals near you, read reviews, and book appointments seamlessly.",
        icon: Search,
        image: FindDoctorsImage
    },
    {
        title: "Personalized Health Tracking",
        description:
            "Your health is unique, and so are your goals. Health Alpha helps you track everything from blood pressure and sugar levels to heart rate and oxygen saturation. Stay on top of your wellness with reminders for fitness activities, sleep improvements, and stress management.",
        icon: Heart,
        image: PersonalHealthImage
    },
    {
        title: "Manage Dependents’ Health",
        description:
            "Whether it’s your child, elderly parent, or even your pet, Health Alpha helps you stay organized. Manage their health records, set reminders for appointments, and keep track of vaccinations—all from one app.",
        icon: User,
        image: FamilyImage
    },
    {
        title: "Multilingual Support",
        description:
            "Health Alpha offers multilingual support to ensure that language is never a barrier to managing your health. Access the app in your preferred language and navigate through its features with ease.",
        icon: Globe,
        image: MultilingleImage
    },
    {
        title: "Emergency Info Lock Screen",
        description:
            "In case of emergencies, Health Alpha provides an emergency info lock screen where you can store vital medical details for quick access. This feature ensures your loved ones can easily find your medical information when needed.",
        icon: Lock,
        image: EmergencyImage
    },
];