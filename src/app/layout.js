import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "APT Casino on TRN Network",
  description: "Play casino games and earn rewards on TRN Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* FuturePass SDK */}
        <Script
          id="futurepass-sdk"
          src="https://sdk.futurepass.trn.network/futurepass.js"
          strategy="beforeInteractive"
        />
      </head>
      <body 
        className={`${inter.className} overflow-x-hidden w-full`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
