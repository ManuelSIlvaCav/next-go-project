"use client";

import CMSAuthProvider from "@/cms/providers/Auth";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CMSAuthProvider>{children}</CMSAuthProvider>;
}
