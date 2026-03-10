"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-primary)" }}>
            <div className="text-center max-w-lg px-6">
                <div className="text-6xl font-bold gradient-text mb-4">500</div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    Une erreur est survenue
                </h2>
                <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                    Quelque chose s'est mal passé. Essayez de recharger la page.
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={reset} className="btn-primary">
                        Réessayer
                    </button>
                    <Link href="/" className="btn-outline">
                        Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
