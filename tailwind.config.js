import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cDefault: "var(--mantine-primary-color-0)",
                'cPrimaryFilled': "var(--mantine-primary-color-filled)",
                'cTextPrimary': "var(--mantine-primary-color-filled)",
                'custom-blue': '#143345',
                'tb': {
                    '50': '#effafc',
                    '100': '#d6f2f7',
                    '200': '#b3e4ee',
                    '300': '#7ed0e2',
                    '400': '#42b3ce',
                    '500': '#2696b4',
                    '600': '#227998',
                    '700': '#22627c',
                    '800': '#245266',
                    '900': '#224557',
                    '950': '#112c3b',
                },
                'pueblo': {
                    '50': '#fff7ec',
                    '100': '#ffedd2',
                    '200': '#ffd7a5',
                    '300': '#ffba6c',
                    '400': '#ff9130',
                    '500': '#ff7108',
                    '600': '#f75400',
                    '700': '#cd3c01',
                    '800': '#a2300a',
                    '900': '#7c280b',
                    '950': '#471203',
                },
            }
        },
    },
    darkMode: 'class',
    plugins: [
        nextui()
    ],
}

