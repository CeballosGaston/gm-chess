import type { Metadata } from "next";
import Navbar from "../components/ui/Navbar";
import Providers from "../providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GM Chess Marketplace",
  description: "Juega contra los mejores del mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <Providers>
          <Navbar />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
