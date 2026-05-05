import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/ui/Navbar";

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
    <html lang="es">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}