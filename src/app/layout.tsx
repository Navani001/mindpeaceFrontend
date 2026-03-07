import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { Providers } from "./provider";
import "./globals.css";
// import "@/styles/globals.css";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Mind peace",
  description: "Mind peace application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: 'light' }}
      className={`h-full light ${poppins.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="h-full antialiased light" data-theme="light">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}