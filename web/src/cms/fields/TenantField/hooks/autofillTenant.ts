import { getTenantAccessIDs } from "@/utilities/getTenantAccessIDs";
import type { FieldHook } from "payload";

export const autofillTenant: FieldHook = ({ req, value }) => {
  // If there is no value,
  // and the user only has one tenant,
  // return that tenant ID as the value
  console.log("autofillTenant", { req, value });
  if (!value) {
    const tenantIDs = getTenantAccessIDs(req.user);
    console.log("tenantIDs", tenantIDs);
    if (tenantIDs.length === 1) {
      return tenantIDs[0];
    }
  }

  return value;
};
