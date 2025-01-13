import type { Tenant, User } from "../payload-types";

import { Config } from "@/payload-types";
import type { CollectionSlug } from "payload";

export const extractID = <T extends Config["collections"][CollectionSlug]>(
  objectOrID: T | T["id"]
): T["id"] => {
  if (objectOrID && typeof objectOrID === "object") return objectOrID.id;

  return objectOrID;
};

export const getTenantAccessIDs = (user: null | User): Tenant["id"][] => {
  if (!user) {
    return [];
  }
  return (
    user?.tenants?.reduce<Tenant["id"][]>((acc, { tenant }) => {
      if (tenant) {
        acc.push(extractID(tenant));
      }
      return acc;
    }, []) || []
  );
};

export const getTenantAdminTenantAccessIDs = (
  user: null | User
): Tenant["id"][] => {
  if (!user) {
    return [];
  }

  return (
    user?.tenants?.reduce<Tenant["id"][]>((acc, { roles, tenant }) => {
      if (roles.includes("tenant-admin") && tenant) {
        acc.push(extractID(tenant));
      }
      return acc;
    }, []) || []
  );
};
