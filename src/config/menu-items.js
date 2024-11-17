import {Activity, AlertCircle, FileText, Headset, Heart, Home, Info, Pill, ShieldCheck, Users} from 'lucide-react';

export const MENU_ITEMS = [
    {
        id: 1,
        key: 'home',
        title: 'Home',
        icon: Home,
        route: '',
        active: false,
    },
    {
        id: 2,
        key: 'users',
        title: 'Users',
        icon: Users,
        route: '/users',
        active: false,
    },
    {
        id: 3,
        key: 'documents',
        title: 'Documents',
        icon: FileText,
        route: '/documents',
        active: false,
    },
    {
        id: 4,
        key: 'medicalTests',
        title: 'Medical Tests',
        icon: Activity, // Using "Activity" for medical tests
        route: '/medical-tests',
        active: false,
    },
    {
        id: 5,
        key: 'healthConditions',
        title: 'Health Conditions',
        icon: Heart, // Using "Heart" for health conditions
        route: '/health-conditions',
        active: false,
    },
    {
        id: 6,
        key: 'medications',
        title: 'Medications',
        icon: Pill, // Using "Pill" for medications
        route: '/medications',
        active: false,
    },
    {
        id: 7,
        key: 'allergies',
        title: 'Allergies',
        icon: AlertCircle, // Using "AlertCircle" for allergies
        route: '/allergies',
        active: false,
    },
    {
        id: 8,
        key: 'immunizations',
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
        key: 'contactUs',
        title: 'Contact Us',
        icon: Headset,
        route: '/contact-us',
        active: false,
    },
    {
        id: 11,
        key: 'aboutUs',
        title: 'About Us',
        icon: Info,
        route: '/about-us',
        active: false,
    }
];
