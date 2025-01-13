import type { FieldAccess } from "payload";

import { getTenantAccessIDs } from "@/utilities/getTenantAccessIDs";
import { isSuperAdmin } from "../../../access/isSuperAdmin";

export const tenantFieldUpdate: FieldAccess = (args) => {
  const tenantIDs = getTenantAccessIDs(args.req.user);
  return Boolean(isSuperAdmin(args) || tenantIDs.length > 0);
};
