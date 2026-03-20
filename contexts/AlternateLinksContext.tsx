"use client";

import { createContext, useContext, ReactNode } from "react";

// Maps each locale to its full translated URL
// e.g. { fr: "/fr/projects/mon-slug-fr", en: "/en/projects/my-slug-en" }
type AlternateLinks = Record<string, string>;

const AlternateLinksContext = createContext<AlternateLinks | null>(null);

export function AlternateLinksProvider({
    children,
    links,
}: {
    children: ReactNode;
    links: AlternateLinks;
}) {
    return (
        <AlternateLinksContext.Provider value={links}>
            {children}
        </AlternateLinksContext.Provider>
    );
}

// Returns the translated URL for a given locale, or null if not set
export function useAlternateLinks() {
    return useContext(AlternateLinksContext);
}
