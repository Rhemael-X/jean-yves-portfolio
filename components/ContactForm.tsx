"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    message: z.string().min(10).max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

type FormState = "idle" | "submitting" | "success" | "error" | "rate_limited" | "server_misconfigured" | "email_failed";

export default function ContactForm() {
    const t = useTranslations("contact");
    const [formState, setFormState] = useState<FormState>("idle");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [values, setValues] = useState({ name: "", email: "", message: "", _gotcha: "" });

    const validate = (): boolean => {
        const result = contactSchema.safeParse({ name: values.name, email: values.email, message: values.message });
        if (result.success) {
            setErrors({});
            return true;
        }
        const fieldErrors: FieldErrors = {};
        result.error.errors.forEach((err) => {
            const field = err.path[0] as keyof ContactFormData;
            if (!fieldErrors[field]) fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name as keyof ContactFormData]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setFormState("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (res.status === 429) {
                setFormState("rate_limited");
                return;
            }

            if (!res.ok) {
                // Read the error code from the API for a precise message
                try {
                    const data = await res.json();
                    if (data?.error === "server_misconfigured") {
                        setFormState("server_misconfigured");
                    } else if (data?.error === "email_failed") {
                        setFormState("email_failed");
                    } else {
                        setFormState("error");
                    }
                } catch {
                    setFormState("error");
                }
                return;
            }

            setFormState("success");
            setValues({ name: "", email: "", message: "", _gotcha: "" });
        } catch {
            setFormState("error");
        }
    };

    if (formState === "success") {
        return (
            <div
                className="rounded-xl p-8 text-center"
                style={{ background: "rgba(100,255,218,0.05)", border: "1px solid rgba(100,255,218,0.3)" }}
            >
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--accent-cyan)" }}>
                    {t("success_title")}
                </h3>
                <p style={{ color: "var(--text-muted)" }}>{t("success_msg")}</p>
                <button
                    onClick={() => setFormState("idle")}
                    className="btn-outline mt-6 text-sm"
                >
                    Nouveau message
                </button>
            </div>
        );
    }

    const inputStyle = {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
        outline: "none",
        transition: "border-color 0.2s",
        width: "100%",
        padding: "0.75rem 1rem",
        fontSize: "0.9375rem",
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Honeypot */}
            <input
                type="text"
                name="_gotcha"
                value={values._gotcha}
                onChange={handleChange}
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none" }}
            />

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {t("name")}
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    placeholder={t("name_placeholder")}
                    autoComplete="name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    style={{ ...inputStyle, borderColor: errors.name ? "#f87171" : "var(--border)" }}
                    onFocus={(e) => { if (!errors.name) e.target.style.borderColor = "var(--accent-cyan)"; }}
                    onBlur={(e) => { if (!errors.name) e.target.style.borderColor = "var(--border)"; }}
                />
                {errors.name && (
                    <p id="name-error" className="text-xs mt-1" style={{ color: "#f87171" }}>
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {t("email")}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder={t("email_placeholder")}
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    style={{ ...inputStyle, borderColor: errors.email ? "#f87171" : "var(--border)" }}
                    onFocus={(e) => { if (!errors.email) e.target.style.borderColor = "var(--accent-cyan)"; }}
                    onBlur={(e) => { if (!errors.email) e.target.style.borderColor = "var(--border)"; }}
                />
                {errors.email && (
                    <p id="email-error" className="text-xs mt-1" style={{ color: "#f87171" }}>
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {t("message")}
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    placeholder={t("message_placeholder")}
                    rows={6}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    style={{ ...inputStyle, borderColor: errors.message ? "#f87171" : "var(--border)", resize: "vertical", minHeight: "120px" }}
                    onFocus={(e) => { if (!errors.message) e.target.style.borderColor = "var(--accent-cyan)"; }}
                    onBlur={(e) => { if (!errors.message) e.target.style.borderColor = "var(--border)"; }}
                />
                <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                        <p id="message-error" className="text-xs" style={{ color: "#f87171" }}>{errors.message}</p>
                    ) : <span />}
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {values.message.length}/2000
                    </p>
                </div>
            </div>

            {/* Error messages */}
            {formState === "error" && (
                <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                    {t("error_msg")}
                </div>
            )}
            {formState === "rate_limited" && (
                <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}>
                    {t("rate_limit")}
                </div>
            )}
            {formState === "server_misconfigured" && (
                <div className="p-3 rounded-lg text-sm space-y-1" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                    <p className="font-semibold">{t("error_config_title")}</p>
                    <p>{t("error_config_msg")}</p>
                </div>
            )}
            {formState === "email_failed" && (
                <div className="p-3 rounded-lg text-sm space-y-1" style={{ background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}>
                    <p className="font-semibold">{t("error_email_title")}</p>
                    <p>{t("error_email_msg")}</p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={formState === "submitting"}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {formState === "submitting" ? (
                    <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        {t("sending")}
                    </>
                ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        {t("submit")}
                    </>
                )}
            </button>
        </form>
    );
}
