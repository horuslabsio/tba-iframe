import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
};
export default function TokenRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
