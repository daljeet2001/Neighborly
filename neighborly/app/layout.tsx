import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Neighborhood",
  description: "Hyperlocal neighborhood help",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-50 min-h-screen"}>
        <Providers>
          <header className="bg-white p-4 shadow">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-lg font-semibold">Neighborly</h1>
              <nav className="flex gap-4">
                <a href="/" className="text-sm">Feed</a>
                <a href="/auth/login" className="text-sm">Login</a>
                <a href="/auth/register" className="text-sm">Register</a>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
