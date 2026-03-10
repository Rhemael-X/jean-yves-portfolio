import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const locales = ["fr", "en"];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange={false}
                >
                    <NextIntlClientProvider messages={messages}>
                        <div className="flex min-h-screen flex-col transition-theme">
                            <Header locale={locale} />
                            <main className="flex-1">{children}</main>
                            <Footer locale={locale} />
                        </div>
                    </NextIntlClientProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
