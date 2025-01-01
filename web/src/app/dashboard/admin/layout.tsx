import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("AdminLayout");
  const cookieStore = await cookies();
  console.log("cookieStore", cookieStore);
  return <div className="w-[75vw] flex flex-col pl-4">{children}</div>;
}
