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
            }
        },
    },
    darkMode: 'class',
    plugins: [
        nextui()
    ],
}

