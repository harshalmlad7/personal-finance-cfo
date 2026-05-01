import "./globals.css";

export const metadata = {
  title: "Personal Finance CFO",
  description: "AI-powered personal finance command center"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
