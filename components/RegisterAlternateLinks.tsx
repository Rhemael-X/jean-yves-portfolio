"use client";

import { useEffect } from "react";

// This component runs on the client and stores the translated URLs
// for the current page into sessionStorage so the LanguageSwitcher
// (which lives in the Header/layout, outside this page's tree) can read them.
export default function RegisterAlternateLinks({
    links,
}: {
    links: Record<string, string>;
}) {
    useEffect(() => {
        sessionStorage.setItem("alternateLinks", JSON.stringify(links));
        return () => {
            // Clean up when leaving a page that has translated slugs
            sessionStorage.removeItem("alternateLinks");
        };
    }, [links]);

    return null;
}
