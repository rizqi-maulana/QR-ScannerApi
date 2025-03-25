import type { Metadata } from "next";
import "globals";

export const metadata: Metadata = {
  title: "ScanHadir API",
  description: "ScanHadir API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
