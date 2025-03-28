import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="32" />
      {/* Sayfa Başlığı */}
      <title>PassVolt</title>
      <meta
        name="description"
        content="This is an awesome app built with Next.js!"
      />
      <body className="bg-white md:bg-[#F0F2F5] dark:bg-black dark:text-white">
        <Providers>
        <ThemeProvider attribute="class">
          <div className="flex flex-col min-h-screen justify-between ">
          <Navbar />
          <Suspense fallback={<Loader />}>
          <main className="py-6 ">
          {children}
          </main>
          </Suspense>
          <Footer /></div>
        </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
