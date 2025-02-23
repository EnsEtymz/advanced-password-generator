import { Toaster } from "sonner";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white md:bg-[#F0F2F5]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
