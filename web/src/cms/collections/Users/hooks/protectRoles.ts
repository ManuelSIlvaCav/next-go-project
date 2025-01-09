// ensure there is always a `user` role

import { FieldHook, User } from "payload";

// do not let non-admins change roles
export const protectRoles: FieldHook<{ id: string } & User> = ({
  data,
  req,
}) => {
  const isAdmin =
    req.user?.roles.includes("admin") || data.email === "demo@payloadcms.com"; // for the seed script

  console.log("loggin protectRoles", { isAdmin, data, req });
  if (!isAdmin) {
    return ["user"];
  }

  const userRoles = new Set(data?.roles || []);
  userRoles.add("user");
  return [...userRoles];
};
