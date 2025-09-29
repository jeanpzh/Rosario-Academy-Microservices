import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { openGraphImage } from "./shared-metadata";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  openGraph: {
    ...openGraphImage,
  },
  title: "Academia Rosario",
  metadataBase: new URL(defaultUrl),
  description: "Academia emblemática deportiva",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
