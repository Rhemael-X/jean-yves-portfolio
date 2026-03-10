import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["Fira Code", "monospace"],
            },
            colors: {
                cyan: {
                    400: "#22d3ee",
                    500: "#06b6d4",
                },
            },
            animation: {
                "spin-slow": "spin 8s linear infinite",
            },
        },
    },
    plugins: [],
};

export default config;
