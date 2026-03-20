"use client";

import { useEffect } from "react";

const EVENT_NAME = "alternate-links-updated";

export default function RegisterAlternateLinks({
    links,
}: {
    links: Record<string, string>;
}) {
    useEffect(() => {
        // Write to sessionStorage
        sessionStorage.setItem("alternateLinks", JSON.stringify(links));

        // Fire a custom event so LanguageSwitcher updates immediately,
        // regardless of which useEffect ran first
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: links }));

        return () => {
            sessionStorage.removeItem("alternateLinks");
            // Notify switcher that we left the page (no more alternate links)
            window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
        };
    }, [links]);

    return null;
}
