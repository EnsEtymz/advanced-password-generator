import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <body className="bg-white md:bg-[#F0F2F5]">
        <Providers>
          <div className="flex flex-col min-h-screen justify-between ">
          <Navbar />
          <main className="py-12">
          {children}
          </main>
          <Footer /></div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
