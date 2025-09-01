import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import { SocketProvider } from "@/app/socket.context";
import Header from "./components/Header";
import { Socket } from "dgram";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Neighborhood",
  description: "Hyperlocal neighborhood help",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-50 min-h-screen"}>
        <SocketProvider>
        <Providers>
          <Header />
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </Providers>
        </SocketProvider>
      </body>
    </html>
  );
}
