// ensure there is always a `user` role

import { User } from "@/payload-types";
import { FieldHook } from "payload";

// do not let non-admins change roles
export const protectRoles: FieldHook<{ id: string } & User> = ({
  data,
  req,
}) => {
  const isAdmin =
    req.user?.roles?.includes("super-admin") ||
    data?.email === "demo@payloadcms.com" ||
    data?.roles?.includes("super-admin");

  console.log("loggin protectRoles", { isAdmin, data, req });
  if (!isAdmin) {
    return ["user"];
  }

  const userRoles = new Set(data?.roles || []);
  userRoles.add("user");
  return [...userRoles];
};
