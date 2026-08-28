import "./global.css";
import type { ReactNode } from "react";
import Topbar from "../components/TopBar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        {children}
      </body>
    </html>
  );
}