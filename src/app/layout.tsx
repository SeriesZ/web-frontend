import type { Metadata } from "next";
import "@/styles/common.scss";
import Gnb from "@/components/common/Gnb";
import Fnb from "@/components/common/Fnb";

export const metadata: Metadata = {
  title: "Series0",
  description: "Generated by create next app",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Gnb />
        {children}
        <Fnb />
      </body>
    </html>
  );
}
