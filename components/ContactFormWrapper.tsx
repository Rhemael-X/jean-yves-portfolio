"use client";

import dynamic from "next/dynamic";

const ContactFormDynamic = dynamic(() => import("./ContactForm"), {
    ssr: false,
    loading: () => (
        <div
            className="rounded-xl p-8 animate-pulse"
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                minHeight: "400px",
            }}
        />
    ),
});

export default function ContactFormWrapper() {
    return <ContactFormDynamic />;
}
