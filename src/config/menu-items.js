import {
  Home,
  Users,
  FileText,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  ShieldCheck,
  ShoppingCart,
  Headset,
  Info
} from 'lucide-react';

export const MENU_ITEMS = [
  {
    id: 1,
    key: 'HOME',
    title: 'Home',
    icon: Home,
    route: '',
    active: false,
  },
  {
    id: 2,
    key: 'USERS',
    title: 'Users',
    icon: Users,
    route: '/users',
    active: false,
  },
  {
    id: 3,
    key: 'DOCUMENTS',
    title: 'Documents',
    icon: FileText,
    route: '/documents',
    active: false,
  },
  {
    id: 4,
    key: 'MEDICAL_TESTS',
    title: 'Medical Tests',
    icon: Activity, // Using "Activity" for medical tests
    route: '/medical-tests',
    active: false,
  },
  {
    id: 5,
    key: 'HEALTH_CONDITIONS',
    title: 'Health Conditions',
    icon: Heart, // Using "Heart" for health conditions
    route: '/health-conditions',
    active: false,
  },
  {
    id: 6,
    key: 'MEDICATIONS',
    title: 'Medications',
    icon: Pill, // Using "Pill" for medications
    route: '/medications',
    active: false,
  },
  {
    id: 7,
    key: 'ALLERGIES',
    title: 'Allergies',
    icon: AlertCircle, // Using "AlertCircle" for allergies
    route: '/allergies',
    active: false,
  },
  {
    id: 8,
    key: 'IMMUNIZATIONS',
    title: 'Immunizations',
    icon: ShieldCheck, // Using "ShieldCheck" for immunizations
    route: '/immunizations',
    active: false,
  },
  // {
  //   id: 9,
  //   key: 'ORDERS',
  //   title: 'Orders',
  //   icon: ShoppingCart,
  //   route: '/orders',
  //   active: false,
  // }
  {
    id: 10,
    key: 'CONTACT',
    title: 'Contact Us',
    icon: Headset,
    route: '/contact-us',
    active: false,
  },
  {
    id: 11,
    key: 'ABOUT',
    title: 'About Us',
    icon: Info,
    route: '/about-us',
    active: false,
  }
];
