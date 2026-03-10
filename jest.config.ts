import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: {
                    jsx: "react-jsx",
                },
            },
        ],
    },
    testMatch: ["**/*.test.ts", "**/*.test.tsx"],
    collectCoverageFrom: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
};

export default config;
