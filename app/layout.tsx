import "./globals.css";

export const metadata = {
  title: "Little Alchemy 2 Hints and Cheats",
  description: "Unofficial hints and cheats guide for Little Alchemy 2.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
