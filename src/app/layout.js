import "./globals.css";

export const metadata = {
  title: "Domino's Customer Support",
  description: "24/7 Customer Support for Domino's Pizza India - We're here to help!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ fontFamily: "'Poppins', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
