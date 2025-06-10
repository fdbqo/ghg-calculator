import "./globals.css";
import type { Metadata } from "next";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "Emissions Calculator",
  description: "Calculate electricity, fuel, and heating CO2e emissions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
