import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-primary)" }}>
            <div className="text-center max-w-lg px-6">
                <div
                    className="text-8xl font-bold mb-4"
                    style={{
                        background: "linear-gradient(135deg, var(--accent-cyan), #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    Page non trouvée
                </h2>
                <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                    La page que vous cherchez n'existe pas ou a été déplacée.
                </p>
                <Link href="/fr" className="btn-primary">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
