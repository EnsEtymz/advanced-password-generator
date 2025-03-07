import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white md:bg-[#F0F2F5]">
      <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
