import { type Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixlinx Industrial Co., Ltd. - Fasteners & Retail Packaging",
  description:
    "Fixlinx Industrial Co., Ltd. supplies high-performance fasteners and retail-ready packaging formats, from Wenzhou, China to markets worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
