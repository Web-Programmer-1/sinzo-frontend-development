
import { Metadata } from "next";
import Providers from "./providers";
import { Poppins } from "next/font/google";

import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-poppins",
});




export const metadata: Metadata = {
  title: "Sinzo Shop BD",
  description: "wood business. Advance Me",
  keywords: ["wood business", "wood business solution", "wood business solution provider", "wood business solution provider in Bangladesh", "wood business solution provider in Bangladesh", "wood business solution provider in Bangladesh", "wood business solution provider in Bangladesh"],
  authors: [{ name: "sinzo shop", url: "https://wood-business.vercel.app" }],
  creator: "shop business",
  publisher: "shop business",
  icons: {
    icon: "/sinzo-logo.jpeg",
    shortcut:"/sinzo-logo.jpeg",
    apple:"/sinzo-logo.jpeg",
  },
  openGraph: {
    title: "wood business",
    description: "wood business. Advance wood business solution",
  },
};





export default function RootLayout({ children }: { children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
