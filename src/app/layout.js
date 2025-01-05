
import "./globals.css";


export const metadata = {
  title: "Ai-Writer",
  description: "Ai-Writer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
