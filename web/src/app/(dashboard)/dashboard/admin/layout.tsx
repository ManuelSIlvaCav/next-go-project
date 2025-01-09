import { cookies } from "next/headers";
import AdminBreadcrumb from "./admin-breadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("AdminLayout");
  const cookieStore = await cookies();
  console.log("AdminLayout", { cookieStore });
  /* Check if the cookie has is_admin, resources are secured so if the token is invalid nothing can be updated/read */

  return (
    <div className="w-[75vw] flex flex-col pl-4">
      <AdminBreadcrumb />
      {children}
    </div>
  );
}
