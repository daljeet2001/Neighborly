"use client";

import "./globals.css";
import { Nunito } from "next/font/google";
import Providers from "./components/Providers";
import { SocketProvider } from "@/app/socket.context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

 const hideFooter =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  return (
    <html lang="en">
      <body className={nunito.className + " bg-gray-50 min-h-screen"}>
        <SocketProvider>
          <Providers>
            <Header />
            <main className="max-w-4xl mx-auto p-4">{children}</main>
            {!hideFooter && <Footer />}
          </Providers>
        </SocketProvider>
      </body>
    </html>
  );
}
