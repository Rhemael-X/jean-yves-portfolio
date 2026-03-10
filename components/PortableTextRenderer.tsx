"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
    block: {
        h2: ({ children }) => (
            <h2 className="prose-portfolio" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2rem", marginBottom: "0.75rem" }}>
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
                {children}
            </h3>
        ),
        normal: ({ children }) => (
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" }}>
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote
                style={{
                    borderLeft: "3px solid var(--accent-cyan)",
                    paddingLeft: "1rem",
                    marginLeft: 0,
                    marginBottom: "1rem",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                }}
            >
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol style={{ paddingLeft: "1.5rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>
                {children}
            </ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li style={{ marginBottom: "0.25rem", lineHeight: 1.7 }}>{children}</li>
        ),
        number: ({ children }) => (
            <li style={{ marginBottom: "0.25rem", lineHeight: 1.7 }}>{children}</li>
        ),
    },
    marks: {
        strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: "var(--text-primary)" }}>{children}</strong>
        ),
        em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
        code: ({ children }) => (
            <code
                style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "0.875em",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    padding: "0.15em 0.4em",
                    borderRadius: "4px",
                    color: "var(--accent-cyan)",
                }}
            >
                {children}
            </code>
        ),
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-cyan)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
                {children}
            </a>
        ),
    },
};

interface PortableTextRendererProps {
    value: any[];
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
    if (!value || value.length === 0) return null;
    return <PortableText value={value} components={components} />;
}
